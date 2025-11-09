import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import SetupPage from './pages/SetupPage';
import PlayPage from './pages/PlayPage';
import HomePage from './pages/HomePage';
import Header from './components/Header';
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Header />
      <Routes>
        <Route path="/setup" element={<SetupPage />} />
        <Route path="/play/:id" element={<PlayPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
