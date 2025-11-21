import React, { useState } from 'react';
import '../styles/Login.css'; // Usa los mismos estilos del login

const Register = ({ onClose, onBackToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    rol: 'PASSENGER',
    bornDate: ''
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.phone || 
        !formData.password || !formData.bornDate) {
      setError('Por favor completa todos los campos');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingresa un email válido');
      return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const registerData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        rol: formData.rol,
        bornDate: formData.bornDate
      };

      const response = await fetch('http://localhost:8080/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerData)
      });

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('El email ya está registrado');
        }
        throw new Error('Error al registrar el usuario');
      }

      const data = await response.json();
      console.log('Usuario registrado exitosamente:', data);
      
      alert('¡Registro exitoso! Ahora puedes iniciar sesión');
      onBackToLogin(); // Volver al login

    } catch (err) {
      console.error('Error en registro:', err);
      setError(err.message);
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
            <p className="title">Crear cuenta</p>
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

          <form className="login-form" onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">Nombre completo</label>
              <input
                type="text"
                className="form-input"
                placeholder="Juan Pérez"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                className="form-input"
                placeholder="usuario@ejemplo.com"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Teléfono</label>
              <input
                type="tel"
                className="form-input"
                placeholder="3001234567"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Fecha de nacimiento</label>
              <input
                type="date"
                className="form-input"
                name="bornDate"
                value={formData.bornDate}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tipo de usuario</label>
              <select
                className="form-input"
                name="rol"
                value={formData.rol}
                onChange={handleInputChange}
                disabled={loading}
                required
              >
                <option value="PASSENGER">Pasajero Regular</option>
                <option value="STUDENT">Estudiante</option>
                <option value="OLD_MAN">Adulto Mayor</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input password-input"
                  placeholder="••••••••"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
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

            <div className="form-group">
              <label className="form-label">Confirmar contraseña</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="form-input password-input"
                  placeholder="••••••••"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={toggleConfirmPasswordVisibility}
                  aria-label="Toggle confirm password visibility"
                  disabled={loading}
                >
                  <span className="material-symbols-outlined">
                    {showConfirmPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="login-btn" 
                disabled={loading}
              >
                {loading ? 'Registrando...' : 'Registrarse'}
              </button>
              <p className="register-text">
                ¿Ya tienes cuenta?{' '}
                <a 
                  href="#" 
                  className="register-link"
                  onClick={(e) => {
                    e.preventDefault();
                    onBackToLogin();
                  }}
                >
                  Iniciar sesión
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;