import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MapBoard from './pages/MapBoard';
import CCTVPage from './pages/CCTVPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MapBoard />} />
                <Route path="/cctv" element={<CCTVPage />} />
            </Routes>
        </Router>
    );
}

export default App;
