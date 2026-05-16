import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Icon from '../components/Icon';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { handleLogin, handleRegister } = useApp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await handleLogin(email, password);
        toast.success('Welcome back!');
      } else {
        await handleRegister(name, email, password);
        toast.success('Account created successfully!');
      }
    } catch (err) {
      toast.error(err.message || 'Authentication failed');
    }
  };

  return (
    <div className="page-container flex-center">
      <div className="auth-card glow-card card-3d">
        <div className="auth-header">
          <div className="auth-icon">⚔️</div>
          <h2>{isLogin ? 'Login to SyntraHub' : 'Create Account'}</h2>
          <p>{isLogin ? 'Access your library and reading plan' : 'Join the world of AI-powered reading'}</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label><Icon name="user" /> Full Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
          )}
          <div className="form-group">
            <label><Icon name="mail" /> Email Address</label>
            <input 
              type="email" 
              placeholder="user@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label><Icon name="lock" /> Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button className="btn-link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Register Now' : 'Login Instead'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
