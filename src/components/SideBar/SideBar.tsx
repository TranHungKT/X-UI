import { Box, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import React, { useState } from 'react';

import { Link, To } from 'react-router-dom';
import './SideBar.css';

import { SideBarItems } from './SideBarItems';
import { barStyle, itemIconStyle, itemStyle, itemTextStyle } from './style';

export default function SideBar() {
  const [selectedItem, setSelectedItem] = useState<To>('home');

  return (
    <Box component="nav" sx={barStyle}>
      <List>
        {SideBarItems.map((item, index) => (
          <Link tabIndex={index} to={item.to} className="link_side_bar" key={index}>
            <ListItemButton
              selected={item.to === selectedItem}
              onClick={() => {
                setSelectedItem(item.to);
              }}
              sx={itemStyle}
            >
              <ListItemIcon sx={itemIconStyle(item.to === selectedItem)}>{item.icon}</ListItemIcon>
              <ListItemText sx={itemTextStyle(item.to === selectedItem)} primary={item.title} />
            </ListItemButton>
          </Link>
        ))}
      </List>
    </Box>
  );
}
