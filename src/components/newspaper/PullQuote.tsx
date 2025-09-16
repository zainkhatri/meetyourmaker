import { Typography, Box } from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

interface PullQuoteProps {
  quote: string;
  attribution?: string;
}

const PullQuote = ({ quote, attribution }: PullQuoteProps) => {
  return (
    <Box
      sx={{
        backgroundColor: 'rgba(255,255,255,0.05)',
        p: 3,
        my: 4,
        position: 'relative',
        borderLeft: '3px solid rgba(255,255,255,0.2)',
      }}
    >
      <FormatQuoteIcon
        sx={{
          position: 'absolute',
          top: -20,
          left: -20,
          fontSize: '3rem',
          color: 'rgba(255,255,255,0.2)',
          transform: 'rotate(180deg)',
        }}
      />
      <Typography
        sx={{
          fontFamily: 'Georgia, serif',
          fontSize: '1.4rem',
          fontStyle: 'italic',
          lineHeight: 1.4,
          mb: attribution ? 2 : 0,
        }}
      >
        {quote}
      </Typography>
      {attribution && (
        <Typography
          sx={{
            fontFamily: 'Arial, sans-serif',
            fontSize: '0.9rem',
            color: 'rgba(255,255,255,0.7)',
            textAlign: 'right',
          }}
        >
          — {attribution}
        </Typography>
      )}
    </Box>
  );
};

export default PullQuote;
