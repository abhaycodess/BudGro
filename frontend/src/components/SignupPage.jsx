import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Container, Grid, TextField, Typography, IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SignupPageVector from '../assets/SignupPageVector.png';
import GoogleIcon from '@mui/icons-material/Google';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  // setLoading(true);
    try {
      const res = await fetch('http://localhost:3002/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('Network error. Please try again.');
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: { xs: 6, md: 0 } }}>
      <Container maxWidth="lg">
        <Grid
          container
          spacing={0}
          alignItems="stretch"
          justifyContent="center"
          direction={{ xs: 'column', md: 'row' }}
          sx={{ minHeight: '80vh' }}
        >
          {/* Vector Image - Left, aligned and stretched */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'stretch', pr: { md: 6 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%' }}>
              <img
                src={SignupPageVector}
                alt="Signup Visual"
                style={{ width: '100%', maxWidth: 520, minWidth: 280, height: '100%', objectFit: 'contain', display: 'block', background: 'none', boxShadow: 'none', borderRadius: 0 }}
              />
            </Box>
          </Grid>
          {/* Signup Form - Right, aligned and stretched */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: 400, px: { xs: 2, md: 6 }, py: { xs: 2, md: 6 }, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h2" sx={{
                fontFamily: 'Cormorant Garamond, serif',
                fontWeight: 700,
                color: '#1A4D2E',
                mb: 2,
                fontSize: { xs: '2rem', md: '2.5rem' },
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                Create Your Account
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, fontFamily: 'Inter, Arial, sans-serif' }}>
                Sign up to start managing your expenses and budgets with BUDGRO.
              </Typography>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<GoogleIcon />}
                sx={{
                  mb: 3,
                  fontWeight: 600,
                  borderRadius: 3,
                  textTransform: 'none',
                  color: '#1A4D2E',
                  borderColor: '#1A4D2E',
                  fontFamily: 'Inter, Arial, sans-serif',
                  background: '#fff',
                  '&:hover': { background: '#f5f5f5', borderColor: '#1A4D2E' }
                }}
                disabled // Remove this when enabling Google sign-in
              >
                Sign up with Google
              </Button>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Full Name"
                  type="text"
                  fullWidth
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  variant="outlined"
                  margin="normal"
                  sx={{ mb: 2, borderRadius: 2 }}
                  InputLabelProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }}
                  inputProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }}
                />
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  variant="outlined"
                  margin="normal"
                  sx={{ mb: 2, borderRadius: 2 }}
                  InputLabelProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }}
                  inputProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }}
                />
                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  variant="outlined"
                  margin="normal"
                  sx={{ mb: 2, borderRadius: 2 }}
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
                <TextField
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  fullWidth
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  variant="outlined"
                  margin="normal"
                  sx={{ mb: 2, borderRadius: 2 }}
                  InputLabelProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }}
                  inputProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                          onClick={() => setShowConfirmPassword((show) => !show)}
                          edge="end"
                          size="large"
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}
                {success && <Typography color="primary" sx={{ mb: 1 }}>{success}</Typography>}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  // disabled={loading}
                  sx={{ py: 1.5, fontWeight: 700, fontSize: '1.1rem', borderRadius: 3, mt: 2, mb: 1, fontFamily: 'Inter, Arial, sans-serif', background: '#1A4D2E', boxShadow: 'none', '&:hover': { background: '#16381F' } }}
                >
                  Sign Up
                </Button>
              </form>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2, fontFamily: 'Inter, Arial, sans-serif', textAlign: 'center' }}>
                Already have an account? <Button href="/login" sx={{ color: '#1A4D2E', fontWeight: 600, fontFamily: 'Inter, Arial, sans-serif', textTransform: 'none', p: 0 }}>Log In</Button>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SignupPage;