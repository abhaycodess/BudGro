import React, { useState } from 'react';
import { Box, Button, Typography, TextField, Container, Grid, MenuItem, Checkbox, FormControlLabel, InputAdornment, Accordion, AccordionSummary, AccordionDetails, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link, useNavigate } from 'react-router-dom';
import OrgSignupImg from '../assets/OrgSignup.png';

const orgTypes = [
  'Startup', 'NGO', 'Enterprise', 'SMB', 'Consultancy', 'Educational', 'Other'
];

export default function OrgSignupPage() {
  // Essential fields only
  const [orgName, setOrgName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [role] = useState('Organization');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  // Collapsible state for optional details
  const [showOptional, setShowOptional] = useState(false);

  // Optional fields (can be filled later)
  const [orgType, setOrgType] = useState('');
  const [adminName, setAdminName] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [currency, setCurrency] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!acceptTerms) {
      setError('You must accept the Terms & Conditions.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    // TODO: Add org signup logic (send only required fields if skipping optional)
  setSuccess('Registration successful! Redirecting...');
  navigate('/org-login');
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 8 }}>
  <Container maxWidth={false} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', minHeight: '100vh', px: 0, mr: { md: 18, lg: 40, xl: 45 } }}>
        <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end', alignItems: 'center', minHeight: 400, pr: { md: 2, lg: 4 } }}>
          <img src={OrgSignupImg} alt="Organization Signup" style={{ width: '100%', maxWidth: 650, minWidth: 340, height: 'auto', display: 'block', background: 'none', boxShadow: 'none', borderRadius: 0 }} />
        </Box>
        <Box sx={{ flex: 1, maxWidth: 500, px: { xs: 2, md: 4 }, py: { xs: 2, md: 6 }, mx: { xs: 'auto', md: 0 }, ml: { md: 0, lg: 0 } }}>
          <Typography variant="h2" sx={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, color: '#1A4D2E', mb: 2, fontSize: { xs: '2rem', md: '2.2rem' } }}>
            Organization Sign Up
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, fontFamily: 'Inter, Arial, sans-serif' }}>
            Register your business or team to manage expenses, users, and more.
          </Typography>
          <form onSubmit={e => handleSignup(e, false)}>
            <Accordion defaultExpanded sx={{ mb: 2, boxShadow: 'none', border: '1px solid #e0e0e0', borderRadius: 3 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: 18, color: 'primary.main' }}>
                Basic Details
              </AccordionSummary>
              <AccordionDetails>
                <TextField label="Organization Name" variant="outlined" fullWidth required sx={{ mb: 2, borderRadius: 2 }} value={orgName} onChange={e => setOrgName(e.target.value)} InputLabelProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }} inputProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }} />
                <TextField label="Official Email Address" variant="outlined" fullWidth required sx={{ mb: 2, borderRadius: 2 }} value={email} onChange={e => setEmail(e.target.value)} InputLabelProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }} inputProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }} />
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
                <TextField
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  variant="outlined"
                  fullWidth
                  required
                  sx={{ mb: 2, borderRadius: 2 }}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
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
                <FormControlLabel
                  control={<Checkbox checked={acceptTerms} onChange={e => setAcceptTerms(e.target.checked)} required sx={{ color: 'primary.main' }} />}
                  label={<span style={{ fontFamily: 'Inter, Arial, sans-serif', fontSize: 15 }}>I agree to the <a href="#" style={{ color: '#1A4D2E', textDecoration: 'underline' }}>Terms & Conditions</a> and <a href="#" style={{ color: '#1A4D2E', textDecoration: 'underline' }}>Privacy Policy</a>.</span>}
                  sx={{ mb: 2 }}
                />
                {/* Role is always Organization, hidden field */}
                <input type="hidden" value={role} readOnly />
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={showOptional} onChange={() => setShowOptional(!showOptional)} sx={{ mb: 2, boxShadow: 'none', border: '1px solid #e0e0e0', borderRadius: 3 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: 18, color: 'primary.main' }}>
                Optional but important (can be added later)
              </AccordionSummary>
              <AccordionDetails>
                <TextField label="Type/Category" select fullWidth sx={{ mb: 2 }} value={orgType} onChange={e => setOrgType(e.target.value)} InputLabelProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }} inputProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }} >
                  <MenuItem value="">Select type</MenuItem>
                  {orgTypes.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                </TextField>
                <TextField label="Admin Name" variant="outlined" fullWidth sx={{ mb: 2 }} value={adminName} onChange={e => setAdminName(e.target.value)} InputLabelProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }} inputProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }} />
                <TextField label="Phone Number" variant="outlined" fullWidth sx={{ mb: 2 }} value={phone} onChange={e => setPhone(e.target.value)} InputLabelProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }} inputProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }} />
                <TextField label="Website/LinkedIn URL" variant="outlined" fullWidth sx={{ mb: 2 }} value={website} onChange={e => setWebsite(e.target.value)} InputLabelProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }} inputProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }} />
                <TextField label="Team Size / Employees" variant="outlined" fullWidth sx={{ mb: 2 }} value={teamSize} onChange={e => setTeamSize(e.target.value)} InputLabelProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }} inputProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }} />
                <TextField label="Preferred Currency" variant="outlined" fullWidth sx={{ mb: 2 }} value={currency} onChange={e => setCurrency(e.target.value)} InputLabelProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }} inputProps={{ style: { fontFamily: 'Inter, Arial, sans-serif' } }} />
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, fontFamily: 'Inter, Arial, sans-serif' }}>
                  You can skip these details and add them later in your organization account page.
                </Typography>
              </AccordionDetails>
            </Accordion>
            {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}
            {success && <Typography color="primary" sx={{ mb: 1 }}>{success}</Typography>}
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ py: 1.5, fontWeight: 700, fontSize: '1.1rem', borderRadius: 3, mt: 2, mb: 1, fontFamily: 'Inter, Arial, sans-serif', background: '#1A4D2E', boxShadow: 'none', '&:hover': { background: '#16381F' } }}>
              Sign Up
            </Button>
            <Button variant="text" color="secondary" fullWidth sx={{ fontWeight: 600, fontFamily: 'Inter, Arial, sans-serif', textTransform: 'none', mb: 1 }} onClick={e => handleSignup(e, true)}>
              Skip Optional Details & Sign Up
            </Button>
          </form>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2, fontFamily: 'Inter, Arial, sans-serif', textAlign: 'center' }}>
            Already have an account?{' '}
            <span
              style={{ color: '#27AE60', fontWeight: 600, fontFamily: 'Inter, Arial, sans-serif', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => navigate('/org-login')}
            >
              Log In
            </span>
          </Typography>
          <Typography variant="body2" sx={{ color: '#1A4D2E', mt: 1, fontFamily: 'Inter, Arial, sans-serif', textAlign: 'center', cursor: 'pointer', textDecoration: 'underline', fontWeight: 500 }} onClick={() => navigate('/signup')}>
            Individual Signup
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
