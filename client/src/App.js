import React from 'react';
import PicturePage from './pages/PicturePage.js';
import HomePage from './pages/HomePage.js';
import TextPage from './pages/TextPage.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pic" element={<PicturePage />} />
        <Route path="/txt" element={<TextPage />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
         {/*<Route path="/about" element={<AboutPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;