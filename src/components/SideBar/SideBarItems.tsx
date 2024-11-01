import { ReactNode } from 'react';
import {
  BookmarkBorder,
  ListAlt,
  MailOutline,
  MoreOutlined,
  PersonOutline,
  Grid3x3,
  NotificationsNone,
  HomeOutlined,
} from '@mui/icons-material';
import { To } from 'react-router-dom';
export const SideBarItems: {
  title: String;
  icon: ReactNode;
  to: To;
}[] = [
  {
    title: 'Home',
    icon: <HomeOutlined />,
    to: 'home',
  },
  {
    title: 'Explore',
    icon: <Grid3x3 />,
    to: 'explore',
  },
  {
    title: 'Notifications',
    icon: <NotificationsNone />,
    to: 'notifications',
  },
  {
    title: 'Messages',
    icon: <MailOutline />,
    to: 'messages',
  },
  {
    title: 'Bookmark',
    icon: <BookmarkBorder />,
    to: 'bookmarks',
  },
  {
    title: 'Lists',
    icon: <ListAlt />,
    to: 'lists',
  },
  {
    title: 'Profile',
    icon: <PersonOutline />,
    to: 'profile',
  },
  {
    title: 'More',
    icon: <MoreOutlined />,
    to: 'more',
  },
];
