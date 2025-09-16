import { Box } from '@mui/material';
import { ReactNode } from 'react';

interface ColumnProps {
  children: ReactNode;
  width?: 1 | 2 | 3 | 4;
  withDivider?: boolean;
}

const Column = ({ children, width = 1, withDivider = true }: ColumnProps) => {
  const widthMap = {
    1: '25%',
    2: '50%',
    3: '75%',
    4: '100%',
  };

  return (
    <Box
      sx={{
        width: widthMap[width],
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
        } : {},
      }}
    >
      {children}
    </Box>
  );
};

export default Column;

