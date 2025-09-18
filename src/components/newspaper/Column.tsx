import { Box } from '@mui/material';
import { type ReactNode } from 'react';

interface ColumnProps {
  children: ReactNode;
  width?: 1 | 2 | 3 | 4;
  withDivider?: boolean;
}

const Column = ({ children, width = 1, withDivider = true }: ColumnProps) => {
  return (
    <Box
      sx={{
        width: { 
          xs: '100%', 
          md: width === 3 ? '60%' : '40%' // Changed to 60/40 split
        },
        px: 3,
        position: 'relative',
        '&::after': withDivider ? {
          content: '""',
          position: 'absolute',
          right: 0,
          top: '5%',
          height: '90%',
          width: '1px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          display: { xs: 'none', md: 'block' }
        } : {},
      }}
    >
      {children}
    </Box>
  );
};

export default Column;