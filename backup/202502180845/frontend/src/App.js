import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/homepage.js';
import Dashboard from './pages/dashboard';
import Header from './components/header.js';
import RegisterForm from './pages/registerForm.js';
import ExpenseDetail from './pages/expenseDetail.js';
import AnnualSummary from './pages/annualSummary.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/dashboard" element={
          <>
            <Header />
            <Dashboard />
          </>
        } />
        <Route path="/registerForm" element={
          <>
            <Header />
            <RegisterForm />
          </>
        }/>
        <Route path="/expenseDetail" element={
          <>
            <Header />
            <ExpenseDetail />
          </>
        }/>
        <Route path="/annualSummary" element={
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
