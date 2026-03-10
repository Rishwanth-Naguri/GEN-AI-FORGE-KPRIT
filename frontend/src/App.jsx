import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import NetworkBackground from './components/NetworkBackground';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ResumeEvaluator from './pages/ResumeEvaluator';
import MockInterview from './pages/MockInterview';
import CareerPath from './pages/CareerPath';
import './App.css';

function App() {
  return (
    <Router>
      <NetworkBackground />
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resume" element={<ResumeEvaluator />} />
        <Route path="/interview" element={<MockInterview />} />
        <Route path="/career" element={<CareerPath />} />
      </Routes>
    </Router>
  );
}

export default App;
