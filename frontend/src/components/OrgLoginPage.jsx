import React, { useState } from 'react';
import { Box, Button, Typography, TextField, Container, Grid, IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link, useNavigate } from 'react-router-dom';
import OrgLoginImg from '../assets/OrgLogin.png';

export default function OrgLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: Add org login logic
    // Simulate setting org user info in localStorage
    const orgUser = {
      email,
      name: email.split('@')[0],
      role: 'Organization',
    };
    localStorage.setItem('budgro_token', 'org-demo-token');
    localStorage.setItem('budgro_user', JSON.stringify(orgUser));
    navigate('/org-dashboard');
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 8 }}>
  <Container maxWidth={false} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', minHeight: '100vh', px: 0 }}>
        <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <img src={OrgLoginImg} alt="Organization Login" style={{ width: '100%', maxWidth: 650, minWidth: 340, height: 'auto', display: 'block', background: 'none', boxShadow: 'none', borderRadius: 0 }} />
        </Box>
        <Box sx={{ flex: 1, maxWidth: 420, px: { xs: 2, md: 4 }, py: { xs: 2, md: 6 }, mx: { xs: 'auto', md: 0 }, mr: { md: 6, lg: 10, xl: 16 } }}>
              <Typography variant="h2" sx={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, color: '#1A4D2E', mb: 2, fontSize: { xs: '2rem', md: '2.5rem' } }}>
                Organization Login
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, fontFamily: 'Inter, Arial, sans-serif' }}>
                Manage your business finances, expenses, and team accounts all in one place.
              </Typography>
              <form onSubmit={handleLogin}>
                <TextField
                  label="Organization Email"
                  variant="outlined"
                  fullWidth
                  required
                  sx={{ mb: 2, borderRadius: 2 }}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  InputLabelProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }}
                  inputProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }}
                />
                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  fullWidth
                  required
                  sx={{ mb: 2, borderRadius: 2 }}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  InputLabelProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }}
                  inputProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          onClick={() => setShowPassword((show) => !show)}
                          edge="end"
                          size="large"
                          tabIndex={-1}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ py: 1.5, fontWeight: 700, fontSize: '1.1rem', borderRadius: 3, mt: 2, mb: 1, fontFamily: 'Inter, Arial, sans-serif', background: '#1A4D2E', boxShadow: 'none', '&:hover': { background: '#16381F' } }}>
                  Log In
                </Button>
              </form>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2, fontFamily: 'Inter, Arial, sans-serif', textAlign: 'center' }}>
                Don&apos;t have an account?{' '}
                <span
                  style={{ color: '#27AE60', fontWeight: 600, fontFamily: 'Inter, Arial, sans-serif', cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => navigate('/org-signup')}
                >
                  Sign Up
                </span>
              </Typography>
              <Typography variant="body2" sx={{ color: '#1A4D2E', mt: 1, fontFamily: 'Inter, Arial, sans-serif', textAlign: 'center', cursor: 'pointer', textDecoration: 'underline', fontWeight: 500 }} onClick={() => navigate('/login')}>
                Individual Login
              </Typography>
            </Box>
      </Container>
    </Box>
  );
}
