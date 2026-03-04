import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Translation from './pages/Translation';
import LearnISL from './pages/LearnISL';
import About from './pages/About';
import Auth from './pages/Auth';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/translation" element={<Translation />} />
            <Route path="/learn" element={<LearnISL />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
