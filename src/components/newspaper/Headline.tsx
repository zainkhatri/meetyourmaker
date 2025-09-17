import { Typography, Box } from '@mui/material';

interface HeadlineProps {
  main: string;
  subheading?: string;
  size?: 'large' | 'medium' | 'small';
}

const Headline = ({ main, subheading, size = 'medium' }: HeadlineProps) => {
  const sizes = {
    large: {
      fontSize: '3.5rem',
      lineHeight: 1.1,
    },
    medium: {
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    small: {
      fontSize: '2rem',
      lineHeight: 1.3,
    },
  };

  return (
    <Box sx={{ 
      borderBottom: subheading ? 'none' : '2px solid rgba(255,255,255,0.1)',
      mb: subheading ? 1 : 3,
      pb: subheading ? 0 : 2
    }}>
      <Typography
        component="h1"
        sx={{
          fontFamily: 'Georgia, serif',
          fontWeight: 700,
          ...sizes[size],
          textTransform: 'lowercase',
          letterSpacing: '0.02em',
          mb: subheading ? 1 : 0,
        }}
      >
        {main}
      </Typography>
      {subheading && (
        <Typography
          sx={{
            fontFamily: 'Georgia, serif',
            fontSize: '1.2rem',
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.7)',
            textTransform: 'lowercase',
          }}
        >
          {subheading}
        </Typography>
      )}
    </Box>
  );
};

export default Headline;