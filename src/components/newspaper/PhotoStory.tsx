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
      my: 3,
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 3
    }}>
      {/* Grid Items */}
      {[
        {
          src: '/1.JPG',
          caption: 'graduation day at ucsd, studying cognitive science and machine learning',
          ratio: '100%'
        },
        {
          src: '/2.JPG',
          caption: 'zain khatri (second from left) with colleagues at muslim tech collaborative, a club he founded',
          ratio: '100%'
        },
        {
          src: '/3.JPG',
          caption: 'nasa ames research center, where zain works on ai',
          ratio: '100%'
        },
        {
          src: '/4.JPG',
          caption: 'sunset in evergreen, the hometown where it started',
          ratio: '100%'
        }
      ].map((image, index) => (
        <Box 
          key={index}
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              '&::after': {
                content: '""',
                display: 'block',
                paddingBottom: image.ratio,
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
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
          <Typography
            sx={{
              fontFamily: 'Georgia, serif',
              fontSize: '0.8rem',
              fontStyle: 'italic',
              color: 'rgba(255,255,255,0.7)',
              textAlign: 'left',
            }}
          >
            {image.caption}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default PhotoStory;