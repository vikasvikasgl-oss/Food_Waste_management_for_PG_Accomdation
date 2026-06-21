import { useState } from 'react';
import SpotlightCard from '../components/SpotlightCard';
import { getUsers, registerUser, type User } from '../utils/db';
import { AnimatePresence, motion } from 'motion/react';

interface LoginProps {
  onLogin: (user: User) => void;
  showToast: (msg: string, type?: 'success' | 'danger' | 'warning') => void;
}

export default function Login({ onLogin, showToast }: LoginProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'resident' | 'manager'>('resident');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      showToast("Please fill in all required fields.", "danger");
      return;
    }

    try {
      const users = await getUsers();

      if (mode === 'login') {
        const existingUser = users.find(
          u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
        );
        if (existingUser) {
          onLogin(existingUser);
          showToast(`Welcome back, ${existingUser.name}!`, "success");
        } else {
          showToast("Invalid email or password.", "danger");
        }
      } else {
        if (!name.trim()) {
          showToast("Please enter your name.", "danger");
          return;
        }
        const emailExists = users.some(
          u => u.email.toLowerCase() === email.trim().toLowerCase()
        );
        if (emailExists) {
          showToast("Email address already registered.", "danger");
          return;
        }

        const newUser = await registerUser({
          name: name.trim(),
          email: email.trim(),
          role: role,
          password: password
        });

        onLogin(newUser);
        showToast(`Account registered successfully as ${role === 'manager' ? 'Manager' : 'Resident'}!`, "success");
      }
    } catch (err) {
      console.error(err);
      showToast("Operation failed. Server error.", "danger");
    }
  };

  return (
    <main className="container">
      <div style={{ maxWidth: '480px', margin: '2rem auto' }}>
        <SpotlightCard style={{ padding: '2rem' }} glowColor="rgba(255, 75, 43, 0.1)">
          <div style={{ display: 'flex', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', position: 'relative' }}>
            <button 
              className={`tab-btn ${mode === 'login' ? 'active' : ''}`} 
              onClick={() => setMode('login')}
              style={{
                flex: 1, background: 'none', border: 'none', color: mode === 'login' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: 600, padding: '0.75rem', cursor: 'pointer', position: 'relative', outline: 'none'
              }}
            >
              <span style={{ position: 'relative', zIndex: 1 }}>Login</span>
              {mode === 'login' && (
                <motion.div
                  layoutId="loginTabUnderline"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'var(--gradient-primary)'
                  }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}
            </button>
            <button 
              className={`tab-btn ${mode === 'register' ? 'active' : ''}`} 
              onClick={() => setMode('register')}
              style={{
                flex: 1, background: 'none', border: 'none', color: mode === 'register' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: 600, padding: '0.75rem', cursor: 'pointer', position: 'relative', outline: 'none'
              }}
            >
              <span style={{ position: 'relative', zIndex: 1 }}>Register</span>
              {mode === 'register' && (
                <motion.div
                  layoutId="loginTabUnderline"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'var(--gradient-primary)'
                  }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}
            </button>
          </div>
          
          <h2 style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: '1.5rem' }}>
            {mode === 'login' ? 'Access Your Account' : 'Create Manager Account'}
          </h2>
          
          <form onSubmit={handleSubmit} style={{ maxWidth: '100%', border: 'none', padding: 0, background: 'transparent' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: mode === 'login' ? -15 : 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: mode === 'login' ? 15 : -15 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                <div>
                  <label htmlFor="auth-email">Email Address</label>
                  <input 
                    type="email" 
                    id="auth-email" 
                    placeholder="manager@hostel.com or student@hostel.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ marginTop: '0.5rem', marginBottom: '1rem' }}
                  />
                </div>
                
                {mode === 'register' && (
                  <>
                    <div>
                      <label htmlFor="auth-name">Full Name / Mess Name</label>
                      <input 
                        type="text" 
                        id="auth-name" 
                        placeholder="Greenwood Residency Mess" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ marginTop: '0.5rem', marginBottom: '1rem' }}
                      />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <label>Select Role</label>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', textTransform: 'none', fontWeight: 500, color: '#fff' }}>
                          <input 
                            type="radio" 
                            name="auth-role" 
                            checked={role === 'resident'} 
                            onChange={() => setRole('resident')} 
                            style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }}
                          />
                          Resident / Student
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', textTransform: 'none', fontWeight: 500, color: '#fff' }}>
                          <input 
                            type="radio" 
                            name="auth-role" 
                            checked={role === 'manager'} 
                            onChange={() => setRole('manager')}
                            style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }}
                          />
                          Mess Manager
                        </label>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label htmlFor="auth-password">Password</label>
                  <input 
                    type="password" 
                    id="auth-password" 
                    placeholder="••••••••" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}
                  />
                </div>

                <button type="submit" style={{ width: '100%' }}>
                  {mode === 'login' ? 'Login' : 'Register Account'}
                </button>
              </motion.div>
            </AnimatePresence>
          </form>
        </SpotlightCard>
      </div>
    </main>
  );
}
