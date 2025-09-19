import { Typography, Box } from '@mui/material';

interface ArticleProps {
  content: string;
  byline?: string;
  date?: string;
}

const Article = ({ content, byline, date }: ArticleProps) => {
  // Get first letter for drop cap
  const firstLetter = content.charAt(0);
  const restContent = content.slice(1);

  return (
    <Box sx={{ mb: 4 }}>
      {(byline || date) && (
        <Box sx={{ 
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 1
        }}>
          {byline && (
            <Typography
              sx={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: '0.9rem',
                color: 'text.secondary',
                fontStyle: 'italic',
                textTransform: 'lowercase'
              }}
            >
              {byline}
            </Typography>
          )}
          {date && (
            <Typography
              sx={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: '0.9rem',
                color: 'text.secondary',
                fontStyle: 'italic'
              }}
            >
              {date}
            </Typography>
          )}
        </Box>
      )}
      <Typography
        component="article"
        sx={{
          fontFamily: 'Playfair Display, Georgia, serif',
          fontSize: '1.1rem',
          lineHeight: 1.6,
          '& > span:first-of-type': {
            float: 'left',
            fontSize: '4rem',
            lineHeight: 0.8,
            paddingRight: '8px',
            fontFamily: 'Playfair Display, Georgia, serif',
            fontWeight: 700,
          },
        }}
      >
        <span>{firstLetter}</span>
        {restContent}
      </Typography>
    </Box>
  );
};

export default Article;