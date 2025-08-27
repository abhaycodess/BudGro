import React from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function LandingPromptModal({ open, onClose, onIndividual, onOrg }) {
  if (!open) return null;
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: open ? 'auto' : 'none',
      }}
    >
      {/* Modal background blur */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          bgcolor: 'rgba(255,255,255,0.5)',
          backdropFilter: 'blur(8px)',
          zIndex: 1,
        }}
        onClick={onClose}
      />
      {/* Modal content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          bgcolor: 'background.paper',
          borderRadius: 1,
          boxShadow: 6,
          p: 4,
          minWidth: 320,
          maxWidth: '90vw',
          textAlign: 'center',
        }}
      >
        <IconButton
          aria-label="Close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 3,
            color: 'grey.700',
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Cormorant Garamond, serif' }}>
          Who are you signing up for?
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            sx={{ borderRadius: 1, px: 3, py: 1, fontWeight: 600, fontSize: 16, minWidth: 140 }}
            onClick={onIndividual}
          >
            Individual / Freelancer
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{ borderRadius: 1, px: 3, py: 1, fontWeight: 600, fontSize: 16, minWidth: 140 }}
            onClick={onOrg}
          >
            Business / Organization
          </Button>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'Inter, Arial, sans-serif' }}>
          Group of two or a microbusiness? <b>We got you covered!</b> <Button variant="text" color="secondary" sx={{ fontWeight: 600, textTransform: 'none', ml: 1 }} onClick={onOrg}>Sign up as Organization</Button>
        </Typography>
      </Box>
    </Box>
  );
}
