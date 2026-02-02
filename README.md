 *“This project is currently under active development.”*
 
# Monthly Expense Calculator (MERN)

A full-stack web application designed to help roommates or friends **track, split, and analyze shared monthly expenses** in a clear and transparent way.

This project focuses on **real-world problem solving**, clean data modeling, and practical full-stack development using the MERN stack.

---


## 🎯 Project Motivation

This project was built to:

- Address a real shared-living financial problem
- Practice end-to-end MERN development
- Focus on data accuracy and business logic
- Demonstrate the ability to design, implement, and document a complete full-stack application

---

## ✨ Project Overview

The application allows users to record **individual expenses for a specific month**, including:

- 💰 Expense amount  
- 📍 Location / merchant  
- 📝 Description (optional)  
- 📅 Billing month (e.g. `2026-January`)  

Based on the recorded data, the app automatically calculates and updates:

- Total expenses for the current month  
- Each participant’s total spending  
- Average monthly spending per person  
- Comparisons with the previous month  

By assigning a **main controller (bill manager)**, participants can clearly see:

- Whether they have overpaid or underpaid
- How much they need to settle at the end of the month

---

## 📈 Install prerequirements

1️⃣ Install MongoDB from the official website
- ```mongod --version ```
- Start the MongoDB Service

2️⃣ Install Tailwind & Tremor & React-dom & nodemon & React-script
- ```npm install -D tailwindcss@3.4.17 postcss autoprefixer```
- ```npm install react-router-dom @tremor/react @headlessui/react @headlessui/tailwindcss web-vitals```
- ```npm install -D @tailwindcss/forms```
- ```npm install -D nodemon```
- ```npm install react-scripts```

3️⃣ Run Seed to load the fake data
- ```node seed/seed.js```

4️⃣ Locate to the files in frontend/src/pages and replace the ipv4 address of **const fetchData1** to your local pc IP address.
- For example, if your ip address is 192.168.11.12, then replace to your local server address: 'http://192.168.11.12:3000/api/expense/annualSummary/'+ dbDate
- The purpose is for multiple users who can upload receipts or check expenses' details at the same time if they are using the same WiFi.
---

## 🔍 Run the exe
- ```npm install```
- ```npm start```
---


## 📊 Data Analysis & Insights (Planned / In Progress)

Beyond basic monthly tracking, the application is designed to support **long-term expense analysis**, including:

- 📆 Annual expense summaries
- 📈 Monthly spending trends
- 🏪 Yearly spending breakdown by location (e.g. supermarkets)
- 🔍 Identification of:
  - Highest spending month
  - Lowest spending month

All insights are intended to be displayed using **visual charts and summaries** for better readability.

---

## 🧱 Tech Stack

### Frontend
- **React**
- JavaScript (ES6+)
- Component-based architecture
- Fetch / Axios for API communication

### Backend
- **Node.js**
- **Express**
- RESTful API design

### Database
- **MongoDB**
- **Mongoose**

### Tooling & Practices
- Git & GitHub
- Environment variables for sensitive configuration
- Seed scripts for development and demo data
- Clear separation of frontend and backend concerns

---


## 🧩 Database Design

### Expense Schema (Simplified)

Each expense record contains:

- `payer` – who paid for the expense  
- `price` – expense amount (`Decimal128`)  
- `location` – where the expense occurred  
- `description` – optional notes  
- `regDate` – billing month (`YYYY-MM`)  

The schema is designed to support **monthly aggregation, comparison, and settlement logic**.

---

## 🌱 Seed Data (Development Only)

This project **does not commit real user data**.

For local development and demonstration purposes, a seed script is provided to populate the database with **sample expense records**.

```bash
node backend/seed/seed.js
```

The seed data simulates realistic scenarios:

- Multiple payers
- Different spending locations
- Typical shared living expenses (rent, groceries, utilities, etc.)
  
---

## 🚀 Future Improvements

- User authentication and authorization
- Support for multiple households or groups
- Expense categories and custom tags
- More advanced analytics and visualizations
- Deployment to a cloud platform (e.g. Render, Railway, Fly.io)
  
---
