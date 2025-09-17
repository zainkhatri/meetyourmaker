import { Box, Typography, Divider } from '@mui/material';

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
      my: 3,
      p: 2.5,
      border: '1px solid rgba(255,255,255,0.1)',
      backgroundColor: 'rgba(26,26,26,0.5)',
    }}>
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5
      }}>
        {images.map((image, index) => {
          const isFullWidth = image.width === 'full';
          
          return (
            <Box 
              key={index}
              sx={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                ...(isFullWidth && {
                  width: '65%',
                  mx: 'auto'
                })
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  '&::after': {
                    content: '""',
                    display: 'block',
                    paddingBottom: image.src === '/1.JPG' ? '133%' : 
                                 image.src === '/2.JPG' ? '75%' :
                                 '56.25%',
                  },
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <Box
                  component="img"
                  src={image.src}
                  alt=""
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'grayscale(0.3) contrast(1.1)',
                  }}
                />
              </Box>
              <Typography
                sx={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '0.8rem',
                  fontStyle: 'italic',
                  color: 'rgba(255,255,255,0.7)',
                  textAlign: 'center',
                  maxWidth: '90%',
                  mx: 'auto'
                }}
              >
                {image.caption}
              </Typography>
              {index < images.length - 1 && (
                <Divider 
                  sx={{ 
                    mt: 1.5,
                    borderStyle: 'dashed',
                    borderColor: 'rgba(255,255,255,0.1)' 
                  }} 
                />
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default PhotoStory;