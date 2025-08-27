import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, Container, Grid, TextField, Typography, IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginPageVector from '../assets/LoginPageVector.png';



const LoginPage = () => {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Prefill email if passed from landing page
  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  // setLoading(true);
    try {
      const res = await fetch('http://localhost:3002/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('budgro_token', data.token);
        localStorage.setItem('budgro_user', JSON.stringify(data.user));
        // Fetch latest avatar from backend
        try {
          const avatarRes = await fetch('http://localhost:3002/user/avatar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: data.user.email })
          });
          const avatarData = await avatarRes.json();
          if (avatarData.avatar) {
            localStorage.setItem('budgro_avatar', avatarData.avatar);
          } else {
            localStorage.removeItem('budgro_avatar');
          }
        } catch {
          // Ignore avatar fetch errors
        }
        navigate('/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('Network error. Please try again.');
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 8 }}>
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
              {/* Org prompt below description, styled with Cormorant Garamond */}
              <Box sx={{ mb: 3, textAlign: 'left' }}>
                <Typography variant="subtitle1" sx={{ fontFamily: 'Cormorant Garamond, serif', color: 'secondary.main', fontWeight: 600, fontSize: 20, mb: 1 }}>
                  Are you a team, group, or microbusiness?
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'Cormorant Garamond, serif', color: '#1A4D2E', fontWeight: 500, mb: 1 }}>
                  Switch to organization login for collaborative expense management and business features.
                </Typography>
                <Button
                  variant="outlined"
                  color="secondary"
                  component={Link}
                  to="/org-login"
                  sx={{ mt: 1, borderRadius: 3, fontWeight: 600, fontFamily: 'Cormorant Garamond, serif', fontSize: 17, px: 3, py: 1, textTransform: 'none' }}
                >
                  Organization Login
                </Button>
              </Box>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  sx={{ mb: 2, borderRadius: 2, bgcolor: 'background.paper', backgroundColor: 'background.paper' }}
                  InputLabelProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }}
                  inputProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  sx={{ mb: 2, borderRadius: 2 }}
                  InputLabelProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }}
                  inputProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
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
                    style: { backgroundColor: 'white' },
                  }}
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
              </form>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2, fontFamily: 'Inter, Arial, sans-serif', textAlign: 'center' }}>
                Don&apos;t have an account?{' '}
                <span
                  style={{ color: '#1A4D2E', fontWeight: 600, fontFamily: 'Inter, Arial, sans-serif', cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => navigate('/signup')}
                >
                  Sign Up
                </span>
              </Typography>
              {/* Only one org login button, above, so remove this extra link */}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LoginPage;