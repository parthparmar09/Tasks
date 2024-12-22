import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Dashboard as DashboardIcon,
  Assignment as TaskIcon,
  People as UsersIcon,
  History as HistoryIcon,
} from "@mui/icons-material";

const drawerWidth = 240;

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const navLinks = [
    {
      text: "Tasks",
      path: "/",
      icon: <TaskIcon />,
      roles: ["Admin", "Manager", "Employee", "QA"],
    },
    {
      text: "Users",
      path: "/users",
      icon: <UsersIcon />,
      roles: ["Admin"],
    },
    {
      text: "History",
      path: "/history",
      icon: <HistoryIcon />,
      roles: ["Admin"],
    },
  ];

  const filteredLinks = navLinks.filter((link) =>
    link.roles.includes(user.role)
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <List>
        {filteredLinks.map((link) => {
          const isSelected = location.pathname === link.path;

          return (
            <ListItem key={link.text} disablePadding>
              <ListItemButton
                component={Link}
                to={link.path}
                selected={isSelected}
                sx={{
                  backgroundColor: isSelected ? "primary.light" : "inherit",
                  "&.Mui-selected": {
                    backgroundColor: "primary.main",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "primary.dark",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isSelected ? "primary.contrastText" : "inherit",
                  }}
                >
                  {link.icon}
                </ListItemIcon>
                <ListItemText
                  primary={link.text}
                  sx={{
                    fontWeight: isSelected ? "bold" : "normal",
                    color: isSelected ? "primary.contrastText" : "inherit",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
