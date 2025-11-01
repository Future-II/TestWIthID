import { useState } from 'react';
import './LoginToTaqeem.css';

const LoginToTaqeem = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your login logic here
    console.log('Login attempt with:', { email, password });
  };

  return (
    <div className="loginContainer">
      <button className="loginButton" onClick={() => setIsModalOpen(true)}>
        Login
      </button>

      {isModalOpen && (
        <div className="modalOverlay">
          <div className="modalContent">
            <button className="closeButton" onClick={() => setIsModalOpen(false)}>
              ×
            </button>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <div className="formGroup">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="formGroup">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="submitButton">
                Login
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginToTaqeem;
