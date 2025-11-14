import React, { useState } from 'react';
import '../styles/Login.css';

const Login = ({ onClose }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí manejarías el login
    console.log('Login submitted');
  };

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

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Correo electronico</label>
              <input
                type="text"
                className="form-input"
                placeholder="xdxdlolo69@gmail.com"
                name="username"
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
              <button type="submit" className="login-btn">
                Ingresar
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