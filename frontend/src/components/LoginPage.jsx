import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import LoginPageVector from '../assets/LoginPageVector.png';

const DUMMY_USER = {
  email: 'demo@budgro.com',
  password: 'password123',
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === DUMMY_USER.email && password === DUMMY_USER.password) {
      localStorage.setItem('budgro_logged_in', 'true');
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Use demo@budgro.com / password123');
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: { xs: 6, md: 0 } }}>
      <Container maxWidth="lg">
        <Grid
          container
          spacing={0}
          alignItems="center"
          justifyContent="center"
          direction={{ xs: 'column', md: 'row' }}
          sx={{ minHeight: '80vh' }}
        >
          {/* Vector Image - Left, Enlarged, No Background */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <img
              src={LoginPageVector}
              alt="Login Visual"
              style={{ width: '100%', maxWidth: 520, minWidth: 280, height: 'auto', display: 'block', background: 'none', boxShadow: 'none', borderRadius: 0 }}
            />
          </Grid>
          {/* Login Form - Right */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: 400, px: { xs: 2, md: 6 }, py: { xs: 2, md: 6 } }}>
              <Typography variant="h2" sx={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, color: '#1A4D2E', mb: 2, fontSize: { xs: '2rem', md: '2.5rem' } }}>
                Welcome Back
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, fontFamily: 'Inter, Arial, sans-serif' }}>
                Log in to your BUDGRO account to manage your expenses and budgets.
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  sx={{ mb: 2, bgcolor: '#fff', borderRadius: 2 }}
                  InputLabelProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }}
                  inputProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  sx={{ mb: 2, bgcolor: '#fff', borderRadius: 2 }}
                  InputLabelProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }}
                  inputProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                {error && (
                  <Typography color="error" sx={{ mb: 1, fontFamily: 'Inter, Arial, sans-serif' }}>{error}</Typography>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ py: 1.5, fontWeight: 700, fontSize: '1.1rem', borderRadius: 3, mt: 2, mb: 1, fontFamily: 'Inter, Arial, sans-serif', background: '#1A4D2E', boxShadow: 'none', '&:hover': { background: '#16381F' } }}
                >
                  Log In
                </Button>
                <div style={{ fontSize: 12, color: '#888', marginTop: 8, textAlign: 'center' }}>
                  Demo: demo@budgro.com / password123
                </div>
              </form>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2, fontFamily: 'Inter, Arial, sans-serif', textAlign: 'center' }}>
                Don&apos;t have an account? <Button href="#" sx={{ color: '#1A4D2E', fontWeight: 600, fontFamily: 'Inter, Arial, sans-serif', textTransform: 'none', p: 0 }}>Sign Up</Button>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LoginPage;