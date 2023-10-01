import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Button, Icon } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BookIcon from '@mui/icons-material/Book';
import ListIcon from '@mui/icons-material/List';
const drawerWidth = 200;

// interface Props {
//   /**
//    * Injected by the documentation to work in an iframe.
//    * You won't need it on your project.
//    */
//   window?: () => Window;
// }

export default function DashBoardTemplate(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  //const [role, setRole] = React.useState('admin');

  const testUserType = "user";
  //admin sidenav
  const adminNavItems = [
    { name: "Home", icon:HomeIcon},
    { name: "Dashboard", icon:DashboardIcon },
    { name: "Calendar", icon: CalendarMonthIcon },
    { name: "Logs", icon: BookIcon },
    { name: "Bookings", icon: ListIcon},
  ];
  //user sidenav
  const userNavItems = [
    { name: "Home", icon: HomeIcon},
    { name: "Calendar", icon: CalendarMonthIcon },
    { name: "Bookings", icon: ListIcon},
  ];
  const NavItems = testUserType === "admin" ? adminNavItems : userNavItems;
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const selectedStyle={
    backgroundColor:"#fecc00",
    
    borderRadius:'0px',
    color:'black'
   
  }
  const unselectedStyle={
    backgroundColor:"#black",
    transition: "background 0.7s, color 0.7s",
    ":hover": {
      bgcolor: "#9c7b16",
      color: "white",
    },   
  
  }

  const drawer = (
    // sidenav sidenavbar
    <div>
      <Toolbar sx={{ backgroundColor: "#fecc00" }}>
        <img src = "./images/image.png" alt="logo"/>
      </Toolbar>
      {/* <Divider sx={{ backgroundColor: "white" }} /> */}
      {/* sidenav color */}
      <List sx={{ backgroundColor: "black" }}>
        {NavItems.map((item, index) => (
          <ListItem sx={props.title===item.name?selectedStyle:unselectedStyle} key={index} disablePadding>
            <ListItemButton>
              <ListItemIcon sx={{ color: "white" }}>
                {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                <Icon component={item.icon}></Icon>
              </ListItemIcon> 
              <ListItemText
                sx={{ color: "white", fontWeight:'bold'}}
                fontWeight='bold'
                primary={item.name}               
              />
            </ListItemButton>
          </ListItem>
        ))}
        <br />

        <ListItem
          disablePadding
          sx={{ display: "flex", justifyContent: "center" }}
        >          
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#fecc00",
              borderColor: "#fecc00",
              width: "80%",
              color: "black",
              ":hover": {
                bgcolor: "#9c7b16",
                color: "white",
              },
              borderRadius: "10px",
            }}
          >
            <Typography fontFamily="Oswald" fontWeight="bold">
              Logout
            </Typography>
          </Button>
        </ListItem>
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    // main nav
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar sx={{ backgroundColor: "#fecc00" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          {/* Roboto Slab */}
          <Typography variant="h4" noWrap component="div" fontFamily="Oswald" color='black' fontWeight='bold' >
            {props.title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
          backgroundColor: "black",          
        }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          PaperProps={{
            sx: {
              backgroundColor: "black",
              
            },
          }}
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            }, 
            border:"none"
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              border:"none",
              // sidenav color
              backgroundColor: "black",
            },
          }}
          PaperProps={{
            sx: {
              backgroundColor: "#white",
              
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Typography paragraph>{/* eraseable */}</Typography>
        {props.children}
      </Box>
    </Box>
  );
}
