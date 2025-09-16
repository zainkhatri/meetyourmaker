import { Typography, Box } from '@mui/material';

interface SectionHeaderProps {
  title: string;
}

const SectionHeader = ({ title }: SectionHeaderProps) => {
  return (
    <Box
      sx={{
        borderTop: '2px solid rgba(255,255,255,0.2)',
        borderBottom: '2px solid rgba(255,255,255,0.2)',
        py: 1,
        my: 4,
        textAlign: 'center',
      }}
    >
      <Typography
        sx={{
          fontFamily: 'Georgia, serif',
          fontSize: '1.2rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

export default SectionHeader;
