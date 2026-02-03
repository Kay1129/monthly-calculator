# Monthly Expense Calculator

A full-stack web application that helps roommates or friends **track, split, and analyze shared monthly expenses** in a transparent way. Built with the MERN stack, it demonstrates real-world problem solving, clean data modeling, and end-to-end full-stack development.

---

## What This App Does

The Monthly Expense Calculator lets users record household expenses and automatically computes how much each person has paid, how much they owe, and how spending compares over time.

### Core Features

- **Dashboard** – View total monthly spend, average per person, comparison with last month, and recent activity  
- **Expense registration** – Record expenses with amount, payer, location (e.g. supermarket), description, and billing month  
- **Expense detail** – Browse all monthly expenses and filter by payer  
- **Annual summary** – Yearly overview with charts (BarChart, LineChart, DonutChart) and metrics such as:
  - Total annual costs  
  - Highest / lowest spending month  
  - Spending breakdown by store  
  - Average cost per person  

### Business Logic

- Automatically calculates **per-person averages** and **amounts to settle**  
- Supports a designated **bill manager** so participants see who overpaid or underpaid  
- Designed for **multi-user access** on the same network (e.g. shared Wi‑Fi) so multiple users can log and view expenses

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 18, React Router, Tailwind CSS, Tremor (charts), Radix UI, Headless UI |
| **Backend** | Node.js, Express, RESTful API |
| **Database** | MongoDB, Mongoose |
| **Testing** | Jest, Supertest (backend), React Testing Library (frontend) |

---

## Testing & Quality Assurance

The project includes **full test coverage for both backend and frontend**, created with AI assistance. Test strategy, cases, and conclusions are documented in the **testing report** folder for deeper review.

### Backend Tests

- **Location**: `routers/__tests__/`
- **Framework**: Jest + Supertest
- **Coverage**: 6 API routes, 17 test cases
- **Run**: `npm test` (from project root)

### Frontend Tests

- **Location**: `frontend/src/pages/MonthlyCalculator/__tests__/`
- **Framework**: Jest + React Testing Library
- **Coverage**: 4 main components, 15 test cases
- **Run**: `cd frontend && npm test -- --watchAll=false`

### Test Documentation

Detailed documentation is in the `docs/` folder:

| Document | Description |
|----------|-------------|
| [`testingReport/BACKEND.md`](testingReport/BACKEND.md) | Backend test cases, rationale, and conclusions |
| [`testingReport/FRONTEND.md`](testingReport/FRONTEND.md) | Frontend test cases, rationale, and conclusions |

Both documents include:

- How to run tests  
- Test case tables with scenarios and expected results  
- Test conclusions and pass criteria  

---

## How to Run This Project (For Interviewers/Public Users)

### Prerequisites

- **Node.js** (v16 or higher recommended)
- **MongoDB** running locally (default: `mongodb://127.0.0.1:27017`)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd monthly-calculator
```

### Step 2: Install Dependencies

Install MongoDB from the official website


Install **root** (backend) dependencies:

```bash
npm install
```

Populate the database with sample expense records:

```bash
node seed/seed.js
```

### Step 4: Start the Application

From the **project root**:

```bash
npm start
```

This runs:

- **Backend** (Express) on `http://localhost:3000`  
- **Frontend** (React) on `http://localhost:3001`  

Open `http://localhost:3001` in your browser to use the app.

### Step 5: Run Tests

**Backend tests** (from project root):

```bash
npm test
```

**Frontend tests** (from project root or `frontend/`):

```bash
cd frontend
npm test -- --watchAll=false
```

---

## Project Structure

```
monthly-calculator/
├── app.js                 # Express entry point
├── models/                # Mongoose models (Expense, FamilyMember, etc.)
├── routers/               # API routes
│   └── __tests__/         # Backend Jest tests
├── seed/                  # Seed script for sample data
├── frontend/              # React app
│   ├── src/
│   │   ├── pages/         # Page components
│   │   │   ├── homepage.js
│   │   │   └── MonthlyCalculator/
│   │   │       ├── dashboard.js
│   │   │       ├── registerForm.js
│   │   │       ├── expenseDetail.js
│   │   │       ├── annualSummary.js
│   │   │       └── __tests__/   # Frontend Jest tests
│   │   └── ...
│   └── __mocks__/         # Test mocks (e.g. react-router-dom)
└── docs/                  # Test documentation
    ├── TEST_DOCUMENTATION.md
    └── FRONTEND_TEST_DOCUMENTATION.md
```

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expense/annualSummary/:year` | Annual expense summary |
| GET | `/api/expense/monthSummary/:regDate` | Monthly dashboard data |
| GET | `/api/expense/:regDate` | Monthly expense list |
| GET | `/api/expense/:regDate/:payer` | Personal expense list |
| GET | `/api/familyMember` | Family member list |
| POST | `/api/expense` | Create new expense |

---

## Database Schema (Expense)

- `payer` – Who paid  
- `price` – Amount (Decimal128)  
- `location` – Store / merchant  
- `description` – Optional notes  
- `regDate` – Billing month (e.g. `2026-January`)  

---

## Future Improvements

- User authentication and authorization  
- Multiple households or groups  
- Expense categories and custom tags  
- Richer analytics and visualizations  
- Deployment (e.g. Render, Railway, Fly.io)  

---