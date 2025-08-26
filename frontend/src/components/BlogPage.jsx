import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import BlogPageVector from '../assets/BlogPageVector.png';

// Example stock images (replace with your own or royalty-free URLs)
const stockImages = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80', // Valid Unsplash image
  'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
];

const blogPosts = [
  {
    title: 'AI in Expense Management: Transforming Financial Operations',
    image: stockImages[0],
    content: `Artificial Intelligence is revolutionizing the way businesses manage expenses. By automating data extraction, categorization, and policy compliance, AI-driven platforms like BUDGRO reduce manual work and errors, enabling finance teams to focus on strategic growth. The integration of OCR and real-time analytics ensures every transaction is tracked and optimized.`
  },
  {
    title: 'Building Trust: Security & Compliance in Modern Finance Apps',
    image: stockImages[1],
    content: `With increasing digitalization, data security and compliance are more critical than ever. BUDGRO employs industry-standard encryption, secure cloud storage, and regular audits to protect user data. Compliance with global standards ensures peace of mind for both individuals and organizations.`
  },
  {
    title: 'From Startups to Enterprises: Scaling Expense Solutions',
    image: stockImages[2],
    content: `Expense management needs vary across user segments. Startups require agility and ease of use, while enterprises demand robust controls and integrations. BUDGRO’s flexible architecture and API integrations make it suitable for businesses of all sizes, supporting growth at every stage.`
  }
];

export default function BlogPage() {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="flex-start" justifyContent="flex-start">
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 4, flexDirection: { xs: 'column', md: 'row' } }}>
              <Box sx={{ flex: 1, pr: { md: 4 }, mb: { xs: 3, md: 0 } }}>
                <Typography variant="h1" sx={{ fontWeight: 700, fontFamily: 'Cormorant Garamond, serif', color: 'primary.main', mb: 2, fontSize: { xs: '2rem', md: '2.5rem' } }}>
                  Community Blog
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2, fontSize: { xs: '1.1rem', md: '1.15rem' } }}>
                  Insights, tips, and stories from the world of AI-powered finance and expense management.
                </Typography>
              </Box>
              <Box sx={{ flexShrink: 0, width: { xs: '100%', md: 260 }, ml: { md: 2 }, display: 'flex', justifyContent: 'flex-end' }}>
                <img src={BlogPageVector} alt="Blog page vector" style={{ width: '100%', maxWidth: 260, height: 'auto', borderRadius: 0, boxShadow: 'none', display: 'block' }} />
              </Box>
            </Box>
            {blogPosts.map((post) => (
              <Box key={post.title} sx={{ mb: 5, p: 0, borderRadius: 0, bgcolor: 'transparent', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'flex-start' }}>
                <Box sx={{ flexShrink: 0, width: { xs: '100%', md: 180 }, mb: { xs: 2, md: 0 } }}>
                  <img src={post.image} alt={post.title} style={{ width: '100%', maxWidth: 180, height: 'auto', borderRadius: 12, boxShadow: '0 2px 12px rgba(26,77,46,0.08)' }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h2" sx={{ fontWeight: 600, fontFamily: 'Cormorant Garamond, serif', color: 'primary.main', mb: 1, fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
                    {post.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.primary', fontFamily: 'Inter, Arial, sans-serif', fontWeight: 400, fontSize: { xs: '1rem', md: '1.08rem' } }}>
                    {post.content}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
