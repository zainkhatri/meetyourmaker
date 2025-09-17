import { Box, Typography } from '@mui/material';

interface PhotoStoryProps {
  images: {
    src: string;
    caption: string;
    width?: 'half' | 'full';
  }[];
}

const PhotoStory = ({ images }: PhotoStoryProps) => {
  return (
    <Box sx={{ 
      my: 4,
      p: 2,
      border: '1px solid rgba(255,255,255,0.1)',
      backgroundColor: 'rgba(26,26,26,0.5)',
    }}>
      <Typography
        sx={{
          fontFamily: 'Georgia, serif',
          fontSize: '0.9rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          mb: 2,
          pb: 1,
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        photo story
      </Typography>
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 2
      }}>
        {images.map((image, index) => (
          <Box 
            key={index}
            sx={{ 
              gridColumn: image.width === 'full' ? 'span 2' : 'span 1',
              position: 'relative'
            }}
          >
            <Box
              component="img"
              src={image.src}
              alt=""
              sx={{
                width: '100%',
                height: 'auto',
                filter: 'grayscale(0.3) contrast(1.1)',
                border: '1px solid rgba(255,255,255,0.1)',
                mb: 1
              }}
            />
            <Typography
              sx={{
                fontFamily: 'Georgia, serif',
                fontSize: '0.8rem',
                fontStyle: 'italic',
                color: 'rgba(255,255,255,0.7)',
                borderBottom: '1px dotted rgba(255,255,255,0.1)',
                pb: 1
              }}
            >
              {image.caption}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PhotoStory;
