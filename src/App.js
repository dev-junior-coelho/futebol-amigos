import React from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Teams from './pages/Teams';
import Schedule from './pages/Schedule';
import Members from './pages/Members';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ChegadosProvider } from './contexts/ChegadosContext';

function App() {
  // Configurar o basename para o GitHub Pages
  const basename = process.env.NODE_ENV === 'production' ? '/futebol-amigos' : '';

  return (
    <Router basename={basename}>
      <div className="App">
        <ChegadosProvider>
          <Navbar />
          <div className="main-content" style={{ marginLeft: '220px', marginTop: '20px', width: 'calc(100% - 240px)' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/members" element={<Members />} />
            </Routes>
          </div>
        </ChegadosProvider>
      </div>
    </Router>
  );
}

export default App;