import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/homepage.js';
import Dashboard from './pages/MonthlyCalculator/dashboard.js';
import Header from './components/header.js';
import RegisterForm from './pages/MonthlyCalculator/registerForm.js';
import ExpenseDetail from './pages/MonthlyCalculator/expenseDetail.js';
import AnnualSummary from './pages/MonthlyCalculator/annualSummary.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/MonthlyCalculator/dashboard" element={
          <>
            <Header />
            <Dashboard />
          </>
        } />
        <Route path="/MonthlyCalculator/registerForm" element={
          <>
            <Header />
            <RegisterForm />
          </>
        }/>
        <Route path="/MonthlyCalculator/expenseDetail" element={
          <>
            <Header />
            <ExpenseDetail />
          </>
        }/>
        <Route path="/MonthlyCalculator/annualSummary" element={
          <>
            <Header />
            <AnnualSummary />
          </>
        }/>
      </Routes>
    </Router>
  );
}

export default App;
