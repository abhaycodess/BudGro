import React from 'react';
import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import SignupPageVector from '../assets/SignupPageVector.png';
import GoogleIcon from '@mui/icons-material/Google';

const SignupPage = () => {
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
              <form>
                <TextField
                  label="Full Name"
                  type="text"
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  sx={{ mb: 2, bgcolor: '#fff', borderRadius: 2 }}
                  InputLabelProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }}
                  inputProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }}
                />
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
                />
                <TextField
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  sx={{ mb: 2, bgcolor: '#fff', borderRadius: 2 }}
                  InputLabelProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }}
                  inputProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
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