import { useState } from 'react';
import LandingPage from './components/LandingPage';
import './App.css';
import Login from './components/Login';
import Panel from './components/Admin/Panel';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  const handleLoginSuccess = (rol, user) => {
    console.log('Usuario autenticado con rol:', rol);
    setUser(user);
    if (rol === 'ADMIN') {
      setShowPanel(true);
      setShowLogin(false);
      setUserRole('ADMIN');
    } else {
      setShowLogin(false);
      setUserRole('USER');
    }
  };

  const handleCloseSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setShowPanel(false);
    setShowLogin(false);
    setUserRole(null);
  };

  return (
    <>
      {showPanel ? (
        // Mostrar panel de admin
        <Panel onClose={handleCloseSesion} />
      ) : showLogin ? (
        // Mostrar login
        <Login 
          onClose={handleCloseLogin} 
          onLoginSuccess={handleLoginSuccess}
          user={user}
        />
      ) : (
        // Mostrar landing page
        <LandingPage 
          onLoginClick={handleLoginClick} 
          userRole={userRole}
          user={user}
        />
      )}
    </>
  );
}

export default App;