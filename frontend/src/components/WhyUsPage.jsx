import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import WhyUsPageVector from '../assets/WhyUsPageVector.png';

const whyUsQA = [
  {
    question: 'What makes BUDGRO different from other expense trackers?',
    answer: 'BUDGRO leverages AI to automate expense management, providing real-time insights, OCR-based receipt scanning, and seamless policy compliance. Our platform is designed for both individuals and organizations, ensuring accuracy, speed, and a user-friendly experience.'
  },
  {
    question: 'How does BUDGRO use AI to improve expense tracking?',
    answer: 'Our AI engine automates data extraction from receipts, categorizes expenses, and flags policy violations instantly. This reduces manual entry, minimizes errors, and accelerates the approval process.'
  },
  {
    question: 'Is BUDGRO suitable for teams and organizations?',
    answer: 'Yes, BUDGRO supports multi-user workflows, customizable approval policies, and real-time notifications. It is built to scale from individuals to large enterprises, with robust controls and analytics.'
  },
  {
    question: 'What are the benefits of using BUDGRO for employees?',
    answer: 'Employees enjoy a fast, mobile-friendly interface, instant reimbursements, and minimal paperwork. The intuitive design ensures quick onboarding and high adoption rates.'
  },
  {
    question: 'How does BUDGRO ensure data security and compliance?',
    answer: 'We implement industry-standard encryption, secure cloud storage, and regular compliance audits. User data is protected at every step, meeting global privacy and security standards.'
  },
  {
    question: 'Can BUDGRO integrate with other business tools?',
    answer: 'BUDGRO offers API integrations with popular accounting, HR, and ERP systems, enabling seamless data flow and reducing administrative overhead.'
  }
];

const WhyUsPage = () => {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="flex-start" justifyContent="flex-start">
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 4, flexDirection: { xs: 'column', md: 'row' } }}>
              <Box sx={{ flex: 1, pr: { md: 4 }, mb: { xs: 3, md: 0 } }}>
                <Typography variant="h1" sx={{ fontWeight: 700, fontFamily: 'Cormorant Garamond, serif', color: 'primary.main', mb: 2, fontSize: { xs: '2rem', md: '2.5rem' } }}>
                  Why Choose BUDGRO?
                </Typography>
              </Box>
              <Box sx={{ flexShrink: 0, width: { xs: '100%', md: 260 }, ml: { md: 2 }, display: 'flex', justifyContent: 'flex-end' }}>
                <img src={WhyUsPageVector} alt="Why Us page vector" style={{ width: '100%', maxWidth: 260, height: 'auto', borderRadius: 0, boxShadow: 'none', display: 'block' }} />
              </Box>
            </Box>
            <Box>
              {whyUsQA.map((item, idx) => (
                <Box key={idx} sx={{ mb: 4 }}>
                  <Typography variant="h2" sx={{ fontWeight: 600, color: 'primary.main', mb: 1, fontFamily: 'Inter, Arial, sans-serif', fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
                    Q{idx + 1}. {item.question}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.primary', fontFamily: 'Inter, Arial, sans-serif', fontWeight: 400, fontSize: { xs: '1rem', md: '1.08rem' } }}>
                    {item.answer}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default WhyUsPage;
