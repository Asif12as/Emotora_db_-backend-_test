require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
app.use(bodyParser.json());

// Connect to MySQL using Sequelize
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql",
  logging: false,
});

// Define the Contact model
const Contact = sequelize.define("Contact", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  phoneNumber: { type: DataTypes.STRING, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: true },
  linkedId: { type: DataTypes.INTEGER, allowNull: true },
  linkPrecedence: { type: DataTypes.ENUM("primary", "secondary"), allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  deletedAt: { type: DataTypes.DATE, allowNull: true },
});

// Identity reconciliation endpoint
app.post("/identify", async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;
    if (!email && !phoneNumber) {
      return res.status(400).json({ error: "Email or phone number is required." });
    }

    let existingContacts = await Contact.findAll({
      where: {
        [Sequelize.Op.or]: [{ email }, { phoneNumber }],
      },
    });

    if (existingContacts.length === 0) {
      const newContact = await Contact.create({ email, phoneNumber, linkPrecedence: "primary" });
      return res.status(200).json({
        primaryContactId: newContact.id,
        emails: [newContact.email],
        phoneNumbers: [newContact.phoneNumber],
        secondaryContactIds: [],
      });
    }

    let primaryContact = existingContacts.find((c) => c.linkPrecedence === "primary") || existingContacts[0];

    const secondaryContacts = existingContacts.filter((c) => c.id !== primaryContact.id);
    if (!secondaryContacts.some((c) => c.email === email || c.phoneNumber === phoneNumber)) {
      const newSecondary = await Contact.create({
        email,
        phoneNumber,
        linkedId: primaryContact.id,
        linkPrecedence: "secondary",
      });
      secondaryContacts.push(newSecondary);
    }

    return res.status(200).json({
      primaryContactId: primaryContact.id,
      emails: [primaryContact.email, ...secondaryContacts.map((c) => c.email)].filter(Boolean),
      phoneNumbers: [primaryContact.phoneNumber, ...secondaryContacts.map((c) => c.phoneNumber)].filter(Boolean),
      secondaryContactIds: secondaryContacts.map((c) => c.id),
    });
  } catch (error) {
    console.error("Error identifying contact:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await sequelize.sync(); // Sync database
});
