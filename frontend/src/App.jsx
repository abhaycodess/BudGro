import React, { useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, Box, Button, Container, CssBaseline, Grid, Toolbar, Typography, Avatar, Menu, MenuItem, IconButton, Tooltip, Divider, ListItemIcon } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import budgroLogo from "./assets/budgro-favicon.svg";
import HeroSectionVector from '../../HeroSectionvector.png';
import LandingPage1 from "./assets/LandingPage1.png";
import LandingPage2 from "./assets/LandingPage2.png";
import LandingPage3 from "./assets/LandingPage3.png";
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ProtectedRoute from './components/ProtectedRoute';
import AccountPage from './components/AccountPage';
import DashboardRoute from './routes/DashboardRoute';
import About from './components/AboutPage';
import WhyUsPage from './components/WhyUsPage';
import BlogPage from './components/BlogPage';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const theme = createTheme({
  palette: {
    primary: { main: '#1A4D2E' },
    secondary: { main: '#27AE60' },
    accent: { main: '#F2994A' },
    teal: { main: '#1ABC9C' },
    background: { default: '#F9FAFB', paper: '#FFFFFF' },
    text: {
      primary: '#1C1C1C',
      secondary: '#828282',
    },
    success: { main: '#27AE60' },
    warning: { main: '#F2C94C' },
    error: { main: '#EB5757' },
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontFamily: 'Cormorant Garamond, serif',
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: 'Cormorant Garamond, serif',
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.25,
    },
    h3: {
      fontFamily: 'Cormorant Garamond, serif',
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.3,
    },
    h4: {
      fontFamily: 'Inter, Arial, sans-serif',
      fontWeight: 700,
    },
    h5: {
      fontFamily: 'Inter, Arial, sans-serif',
      fontWeight: 700,
    },
    h6: {
      fontFamily: 'Inter, Arial, sans-serif',
      fontWeight: 700,
    },
    body1: {
      fontFamily: 'Inter, Arial, sans-serif',
      fontWeight: 400,
      fontSize: '1rem',
    },
    body2: {
      fontFamily: 'Inter, Arial, sans-serif',
      fontWeight: 400,
      fontSize: '0.875rem',
    },
    caption: {
      fontFamily: 'Inter, Arial, sans-serif',
      fontWeight: 400,
      fontSize: '0.875rem',
    },
    button: {
      fontFamily: 'Inter, Arial, sans-serif',
      fontWeight: 500,
      fontSize: '1rem',
      textTransform: 'none',
    },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { backgroundColor: '#FFFFFF', borderRadius: 20 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundColor: '#FFFFFF' },
      },
    },
  },
});

function App() {
  const location = useLocation();
  useEffect(() => {
    AOS.init({ duration: 900, once: false });
    AOS.refresh();
  }, [location]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavbarWithLogin />
      <Routes>
        <Route path="/" element={<LandingPageContent />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
  <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardRoute />
          </ProtectedRoute>
        } />
        <Route path="/account" element={
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        } />
  <Route path="/about" element={<About />} />
  <Route path="/why-us" element={<WhyUsPage />} />
  <Route path="/blog" element={<BlogPage />} />
      </Routes>
    </ThemeProvider>
  );
}

function NavbarWithLogin() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  // Get user info from localStorage (for demo, use email as username)
  const isLoggedIn = localStorage.getItem('budgro_logged_in') === 'true';
  // For demo, use dummy user email and name
  const username = 'demo@budgro.com';
  const name = 'Demo User';
  // Use avatar from localStorage if available
  const [profilePic, setProfilePic] = React.useState(() => {
    return localStorage.getItem('budgro_avatar') || `https://avatar.iran.liara.run/public/boy?username=${encodeURIComponent(username)}`;
  });

  React.useEffect(() => {
    const updateAvatar = () => {
      setProfilePic(localStorage.getItem('budgro_avatar') || `https://avatar.iran.liara.run/public/boy?username=${encodeURIComponent(username)}`);
    };
    window.addEventListener('storage', updateAvatar);
    return () => window.removeEventListener('storage', updateAvatar);
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    localStorage.removeItem('budgro_logged_in');
    handleClose();
    navigate('/login');
  };

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ boxShadow: 'none', background: 'transparent', pt: 2 }}>
      <Toolbar sx={{ maxWidth: 1200, mx: 'auto', width: '100%', minHeight: 72, px: { xs: 2, md: 4 } }}>
  <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
    <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', cursor: 'pointer', mr: 4 }}>
      <img src={budgroLogo} alt="BUDGRO logo" style={{ height: 36, marginRight: 12 }} />
      <Typography variant="h5" color="text.primary" sx={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, letterSpacing: -1 }}>
        BUDGRO
      </Typography>
    </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <Button component={Link} to="/about" color="inherit" sx={{ fontFamily: 'Inter, Arial, sans-serif', fontWeight: 500, fontSize: 16, px: 2, minWidth: 0 }}>About</Button>
            <Button component={Link} to="/why-us" color="inherit" sx={{ fontFamily: 'Inter, Arial, sans-serif', fontWeight: 500, fontSize: 16, px: 2, minWidth: 0 }}>Why us</Button>
            <Button component={Link} to="/blog" color="inherit" sx={{ fontFamily: 'Inter, Arial, sans-serif', fontWeight: 500, fontSize: 16, px: 2, minWidth: 0 }}>Blog</Button>
          </Box>
        </Box>
        {/* Profile or Login/Signup */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 2 }}>
          {isLoggedIn ? (
            <>
              <Tooltip title="Account settings">
                <IconButton onClick={handleMenu} size="small" sx={{ ml: 2 }} aria-controls={open ? 'account-menu' : undefined} aria-haspopup="true" aria-expanded={open ? 'true' : undefined}>
                  <Avatar src={profilePic} alt={username} sx={{ width: 40, height: 40, border: '2px solid #1A4D2E' }} />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    mt: 1.5, // less margin to sit just below avatar
                    minWidth: 210,
                    maxWidth: 240,
                    borderRadius: 4,
                    boxShadow: '0 8px 32px 0 rgba(26,77,46,0.14)',
                    p: 0,
                    bgcolor: '#fff',
                    fontFamily: 'Inter, Arial, sans-serif',
                  },
                }}
                transformOrigin={{ horizontal: 'center', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
                MenuListProps={{ sx: { p: 0 } }}
              >
                {/* User Info Section */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 2, pb: 1, px: 2 }}>
                  <Avatar src={profilePic} alt={name} sx={{ width: 48, height: 48, mb: 1, border: '2px solid #1A4D2E' }} />
                  <Typography sx={{ fontWeight: 700, fontFamily: 'Cormorant Garamond, serif', color: '#1A4D2E', fontSize: 18, textAlign: 'center' }}>{name}</Typography>
                  <Typography sx={{ color: '#7a8fa6', fontSize: 14, fontFamily: 'Inter, Arial, sans-serif', fontWeight: 500, textAlign: 'center' }}>{username}</Typography>
                </Box>
                {/* Menu Items - centered, no dividers */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 1 }}>
                  <MenuItem onClick={() => { navigate('/dashboard'); }} sx={{ width: '90%', justifyContent: 'center', py: 1.2, fontWeight: 600, fontSize: 16, color: '#1A4D2E', fontFamily: 'Inter, Arial, sans-serif', gap: 1.5, borderRadius: 2, '&:hover': { bgcolor: '#e6f6f0', color: '#16381F' } }}>
                    <ListItemIcon sx={{ color: '#1A4D2E', minWidth: 30, display: 'flex', justifyContent: 'center' }}><DashboardIcon fontSize="small" /></ListItemIcon>
                    My Dashboard
                  </MenuItem>
                  <MenuItem onClick={() => { navigate('/account'); }} sx={{ width: '90%', justifyContent: 'center', py: 1.2, fontWeight: 600, fontSize: 16, color: '#1A4D2E', fontFamily: 'Inter, Arial, sans-serif', gap: 1.5, borderRadius: 2, '&:hover': { bgcolor: '#e6f6f0', color: '#16381F' } }}>
                    <ListItemIcon sx={{ color: '#1A4D2E', minWidth: 30, display: 'flex', justifyContent: 'center' }}><AccountCircleIcon fontSize="small" /></ListItemIcon>
                    My Account
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ width: '90%', justifyContent: 'center', py: 1.2, fontWeight: 600, fontSize: 16, color: '#1A4D2E', fontFamily: 'Inter, Arial, sans-serif', gap: 1.5, borderRadius: 2, '&:hover': { bgcolor: '#e6f6f0', color: '#16381F' } }}>
                    <ListItemIcon sx={{ color: '#1A4D2E', minWidth: 30, display: 'flex', justifyContent: 'center' }}><LogoutIcon fontSize="small" /></ListItemIcon>
                    Logout
                  </MenuItem>
                </Box>
              </Menu>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                sx={{
                  fontFamily: 'Inter, Arial, sans-serif',
                  fontWeight: 500,
                  fontSize: 16,
                  px: 2,
                  minWidth: 0,
                  borderRadius: 999,
                  textTransform: 'none',
                  boxShadow: 'none',
                }}
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button
                color="inherit"
                sx={{
                  fontFamily: 'Inter, Arial, sans-serif',
                  fontWeight: 500,
                  fontSize: 16,
                  px: 2,
                  minWidth: 0,
                  borderRadius: 999,
                  ml: 2,
                  textTransform: 'none',
                  boxShadow: 'none',
                }}
                onClick={() => navigate('/signup')}
              >
                Sign up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

function LandingPageContent() {
  return (
    <>
      {/* Hero Section */}
      <Box sx={{ bgcolor: 'background.default', py: { xs: 8, md: 12 }, minHeight: '80vh' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center" justifyContent="space-between" direction={{ xs: 'column', md: 'row' }}>
            <Grid item xs={12} md={6} sx={{ zIndex: 1 }}>
              <Typography variant="h1" color="text.primary" sx={{ fontWeight: 600, mb: 2, fontFamily: 'Cormorant Garamond, serif', fontSize: { xs: '2rem', md: '2.5rem' } }}>
                Put <span style={{ textDecoration: 'underline', textDecorationThickness: 4, fontFamily: 'Cormorant Garamond, serif' }}>people</span> first
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontSize: { xs: '1rem', md: '1.1rem' }, maxWidth: 480, fontFamily: 'Inter, Arial, sans-serif' }}>
                Fast, user-friendly and engaging – turn finance into growth and clarity. Streamline your daily expense operations with your own branded app.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <input type="email" placeholder="Enter work email" style={{ padding: '12px 16px', border: '1px solid #E0E0E0', borderRadius: 8, fontSize: 16, fontFamily: 'Inter, Arial, sans-serif', outline: 'none', flex: 1, minWidth: 0 }} />
                <Button variant="contained" color="secondary" sx={{ fontWeight: 600, borderRadius: 2, px: 4, fontSize: 16, whiteSpace: 'nowrap', boxShadow: 'none', textTransform: 'none' }}>
                  Get Started
                </Button>
              </Box>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6} sm={4}>
                  <Typography variant="h6" color="text.primary" sx={{ fontWeight: 700, fontSize: 20 }}>
                    75.2%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Average daily activity
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="h6" color="text.primary" sx={{ fontWeight: 700, fontSize: 20 }}>
                    ~20k
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Average daily users
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                    <span style={{ fontSize: 20, color: '#F2994A' }}>★</span>
                    <Typography variant="body2" color="text.primary" sx={{ fontWeight: 700, ml: 0.5 }}>
                      4.5
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Average user rating
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Box sx={{ width: { xs: '90vw', md: '480px' }, maxWidth: '100%' }}>
                <img src={HeroSectionVector} alt="Hero section vector" style={{ width: '100%', height: 'auto', borderRadius: 0, boxShadow: 'none', display: 'block' }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ bgcolor: "background.default", py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="caption" sx={{ color: "secondary.main", fontWeight: 600, letterSpacing: 1, borderRadius: 8, px: 2, py: 0.5, bgcolor: "#F0F4F2", display: "inline-block", mb: 1 }}>
              Simple. Smart. Financial Control.
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 700, fontSize: { xs: "2rem", md: "2.5rem" }, mb: 1, color: "text.primary" }}>
              Powerful Features to Take Control of Your Finances
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
              Manage your finances with BUDGRO. Monitor expenses, save efficiently, all within a user-friendly app.
            </Typography>
          </Box>
          <Grid container spacing={6} alignItems="flex-start" justifyContent="center">
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <Box component="img" src={LandingPage1} alt="Expense Tracking" sx={{ width: '80%', maxWidth: 180, mb: 2 }} data-aos="fade-up" />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1A4D2E', fontFamily: 'Cormorant Garamond' }} data-aos="fade-up" data-aos-delay="100">Expense Tracking</Typography>
              <Typography variant="body2" sx={{ color: 'text.primary', fontFamily: 'Inter', fontWeight: 500 }} data-aos="fade-up" data-aos-delay="200">
                Easily track your daily, weekly, and monthly expenses to stay in control of where your money goes.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <Box component="img" src={LandingPage2} alt="Budget Planning" sx={{ width: '80%', maxWidth: 180, mb: 2 }} data-aos="fade-up" />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1A4D2E', fontFamily: 'Cormorant Garamond' }} data-aos="fade-up" data-aos-delay="100">Budget Planning</Typography>
              <Typography variant="body2" sx={{ color: 'text.primary', fontFamily: 'Inter', fontWeight: 500 }} data-aos="fade-up" data-aos-delay="200">
                Set clear budgets, monitor your progress, and avoid overspending with smart, intuitive budgeting tools.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <Box component="img" src={LandingPage3} alt="Generate Invoices" sx={{ width: '80%', maxWidth: 180, mb: 2 }} data-aos="fade-up" />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1A4D2E', fontFamily: 'Cormorant Garamond' }} data-aos="fade-up" data-aos-delay="100">Generate Invoices</Typography>
              <Typography variant="body2" sx={{ color: 'text.primary', fontFamily: 'Inter', fontWeight: 500 }} data-aos="fade-up" data-aos-delay="200">
                Create and send professional invoices quickly, helping you manage your business finances with ease.
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ textAlign: "center", mt: 5 }}>
            <Button variant="contained" color="secondary" size="large" sx={{ borderRadius: 3, fontWeight: 700, px: 4, py: 1.5, fontSize: "1.1rem", boxShadow: 0 }}>
              Explore All Features
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'background.default', py: 3 }}>
        <Container maxWidth="md">
          <Typography variant="body2" color="text.secondary" align="center">
            &copy; {new Date().getFullYear()} BUDGRO. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </>
  );
}

function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWithRouter;