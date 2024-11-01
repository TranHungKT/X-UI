import { SxProps } from '@mui/material';
import { Theme } from '@emotion/react';
const SIDEBAR_WIDTH = 275;

export const barStyle: SxProps<Theme> = {
  minWidth: SIDEBAR_WIDTH,
  flexShrink: {
    sm: 0,
  },
  backgroundColor: 'white',
  position: 'sticky',
  height: '100vh',
};

export const itemStyle: SxProps<Theme> = {
  height: '60px',
};

export const itemIconStyle = (selected: boolean): SxProps<Theme> => {
  return {
    color: selected ? '#1DA1F2' : 'black',
  };
};

export const itemTextStyle = (selected: boolean): SxProps<Theme> => {
  return {
    ...itemIconStyle(selected),
    '& .MuiListItemText-primary': {
      fontWeight: 700,
      fontSize: 19,
    },
  };
};
