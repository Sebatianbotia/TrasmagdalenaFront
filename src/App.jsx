import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Panel from './components/Admin/Panel';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const closeSesion= () =>{
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  const handleOpenRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleBackToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const handleCloseRegister = () => {
    setShowRegister(false);
  };

  const handleLoginSuccess = (rol, userData) => {
    console.log('Usuario autenticado con rol:', rol);
    setUser(userData);
    
    if (rol === 'ADMIN') {
      setShowPanel(true);
      setShowLogin(false);
    } else {
      setShowLogin(false);
    }
  };

  const handleCloseSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    setShowPanel(false);
    setShowLogin(false);
    setShowRegister(false);
    setUser(null);
  };

  return (
    <>
      {showPanel ? (
        <Panel onClose={handleCloseSesion} />
      ) : showRegister ? (
        <Register 
          onClose={handleCloseRegister}
          onBackToLogin={handleBackToLogin}
        />
      ) : showLogin ? (
        <Login 
          onClose={handleCloseLogin} 
          onLoginSuccess={handleLoginSuccess}
          onOpenRegister={handleOpenRegister}
        />
      ) : (
        <LandingPage 
          onLoginClick={handleLoginClick}
          user={user}
          onLogout={handleCloseSesion}
        />
      )}
    </>
  );
}

export default App;