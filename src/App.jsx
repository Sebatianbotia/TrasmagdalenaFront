import { useState } from 'react'
import LandingPage from './components/LandingPage'
import './App.css';
import Login from './components/Login';
import Panel from './components/Admin/Panel';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showpanel, setShowPanel] = useState(false)

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

   const handleSubmit =()=>{
    setShowPanel(true);
  }
  const closeSesion = ( )=>{
    setShowPanel(false)
  }

  return (
    <>
      {!showLogin ? (
        <>
          <LandingPage onLoginClick={handleLoginClick} />
        </>
      ) : (!showpanel ?(
        <Login onClose={handleCloseLogin} handleSubmit={handleSubmit} />
      ): <Panel onClose={closeSesion}/>
      )}
    </>
  );
}

export default App;
