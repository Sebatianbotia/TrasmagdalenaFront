import React, { use, useState } from 'react';
import '../styles/Login.css';
import { authService } from '../services/authServices';

const Login = ({onClose, handleSubmit}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email,setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]= useState(false)
  const [error, setError] = useState('')

  const togglePasswordVisibility = () => {

    setShowPassword(!showPassword);
  };

   const ValidateUser = async (e) => {
    e.preventDefault()
    console.log(email)
    console.log(password)
    setLoading(true)
    try{
        const data = await authService.login(email, password);

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', data.user);

        console.log("todo bien", data)
        handleSubmit();
    } 
    catch{
          setError("Credenciales no validas")
    } 
    finally{
      setLoading(false)
    }
   }

 
  return (
    <div className="login-page">
      <div className="login-container">
        {onClose && (
          <button className="close-login-btn" onClick={onClose}>
            <span className="material-symbols-outlined">X</span>
          </button>
        )}
        <div className="login-card">
          <div className="login-header">
            <h1 className="brand-name">Transmagdalena</h1>
          </div>

          <div className="login-title">
            <p className="title">Inicio de sesion</p>
          </div>

          <form className="login-form" onSubmit={ValidateUser}>
            <div className="form-group">
              <label className="form-label">Correo electronico</label>
              <input
                type="text"
                className="form-input"
                placeholder="xdxdlolo69@gmail.com"
                name="username"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">contraseña</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input password-input"
                  placeholder="hola123"
                  name="password"
                  value={password}
                  onChange={(e)=> setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={togglePasswordVisibility}
                  aria-label="Toggle password visibility"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'viendo' : 'No viendo'}
                  </span>
                </button>
              </div>
            </div>

            <div className="forgot-password-wrapper">
              <a href="#" className="forgot-password-link">
                Olvidó la clave?
              </a>
            </div>

            <div className="form-actions">
              <button type="submit" className="login-btn" onClick={ValidateUser} disabled={loading}>
                {loading? 'ingresando': 'Ingresar'}
              </button>
              <p className="register-text">
                Not tiene cuenta?{' '}
                <a href="#" className="register-link">
                  Registrarme
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;