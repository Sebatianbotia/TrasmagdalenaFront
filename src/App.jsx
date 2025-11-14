import { useState } from 'react'
import LandingPage from './components/LandingPage'
import './App.css';
import Login from './components/Login';

function App() {
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  return (
    <>
      {!showLogin ? (
        <>
          <LandingPage onLoginClick={handleLoginClick} />
        </>
      ) : (
        <Login onClose={handleCloseLogin} />
      )}
    </>
  );
}

export default App;
