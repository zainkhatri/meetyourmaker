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
        backgroundColor: 'action.hover',
        p: 3,
        my: 4,
        position: 'relative',
        borderLeft: '3px solid',
        borderLeftColor: 'divider',
      }}
    >
      <FormatQuoteIcon
        sx={{
          position: 'absolute',
          top: -20,
          left: -20,
          fontSize: '3rem',
          color: 'divider',
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
            color: 'text.secondary',
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
