# 🚀 Identity Reconciliation API

## 📌 Project Overview
This is a backend service built with **Express.js** and **MySQL** using **Sequelize ORM**. It handles **identity reconciliation** by linking contacts based on email and phone numbers, ensuring multiple purchases from the same user are associated correctly.

## 🛠️ Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Environment Variables**: dotenv
- **Middleware**: body-parser

## 📂 Project Structure

Here are the steps you can copy and paste into your GitHub README:  

1. Install dependencies  
   - Run: npm install  

2. Configure environment variables  
   - Create a .env file and add the following:  
     DATABASE_URL=mysql://root:password@localhost:3306/emotorad_db  
     PORT=3000  
   - Replace password with your actual MySQL password  

3. Start MySQL server and create the database  
   - Run: CREATE DATABASE emotorad_db;  

4. Run the application  
   - Start the server using: node index.js  
   - The server should start on http://localhost:3000  

5. Test the API with Postman or cURL  
   - Send a POST request to http://localhost:3000/identify  
   - Request body example: { "email": "doc@zamazon.com", "phoneNumber": "1234567890" }  

6. Verify data in MySQL  
   - Run: USE emotorad_db;  
   - Check data using: SELECT * FROM Contact;  

7. Push to GitHub  
   - Initialize Git: git init  
   - Add files: git add .  
   - Commit: git commit -m "Initial commit - Identity reconciliation task"  
   - Add remote: git remote add origin your-repo-url  
   - Push changes: git push -u origin main  

