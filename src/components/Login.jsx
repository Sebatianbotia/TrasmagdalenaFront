import React, { useState } from 'react';
import '../styles/Login.css';
import { authService } from '../services/authServices';

const Login = ({ onClose, onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const ValidateUser = async (e) => { 
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const data = await authService.login(email, password);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      console.log("Login exitoso", data.user);
      console.log("Rol del usuario:", data.user.rol);
      
      // Llamar al callback con el rol del usuario
      onLoginSuccess(data.user.rol, data.user);
      
    } catch (err) {
      console.error('Error en login:', err);
      setError("Credenciales no válidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {onClose && (
          <button className="close-login-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
        <div className="login-card">
          <div className="login-header">
            <h1 className="brand-name">Transmagdalena</h1>
          </div>

          <div className="login-title">
            <p className="title">Inicio de sesión</p>
          </div>

          {error && (
            <div className="error-message" style={{
              backgroundColor: '#fee',
              color: '#c33',
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '15px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <form className="login-form" onSubmit={ValidateUser}>
            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                className="form-input"
                placeholder="usuario@ejemplo.com"
                name="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input password-input"
                  placeholder="••••••••"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={togglePasswordVisibility}
                  aria-label="Toggle password visibility"
                  disabled={loading}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="forgot-password-wrapper">
              <a href="#" className="forgot-password-link">
                ¿Olvidó la contraseña?
              </a>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="login-btn" 
                disabled={loading}
              >
                {loading ? 'Ingresando...' : 'Ingresar'}
              </button>
              <p className="register-text">
                ¿No tiene cuenta?{' '}
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