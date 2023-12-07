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
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BookIcon from "@mui/icons-material/Book";
import ListIcon from "@mui/icons-material/List";
import Wild from "../../images/wild.png";
import { useNavigate, useLocation, Link} from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { useContext, useState } from "react";
import { BASE_URL } from "../../links";

const drawerWidth = 268;

// interface Props {
//   /**
//    * Injected by the documentation to work in an iframe.
//    * You won't need it on your project.
//    */
//   window?: () => Window;
// }

export default function DashBoardTemplate(props) {
  const{user}=useContext(AuthContext)
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const {logoutUser}=React.useContext(AuthContext)
  const [role, setRole] = useState("admin"); //default role
  const navigate = useNavigate();

  // admin appbar navigate to other apps
  const mainNavItems = [
    { name: "Home", path: "/wallet"},
    { name: "Facility" , path: "/facility/facility"}, 
    { name: "Booking", path: "/booking/calendar"},
    { name: "Wallet", path: "/wallet/dashboard/"},
    { name: "Crowd Control", path: "/wiladmin/wiladmin/admindashboard"},
  ]

  //admin sidenav
  const adminNavItems = [
    // { name: "Home", icon: HomeIcon, path: "/" },
    { name: "Tracker", icon: DashboardIcon, path: "/booking/tracker" },
    { name: "Calendar", icon: CalendarMonthIcon, path: "/booking/calendar" },
    { name: "Logs", icon: BookIcon, path: "/booking/logs" },
    { name: "Bookings", icon: ListIcon, path: "/booking/bookings",},
  ];

  //user sidenav
  const userNavItems = [
    // { name: "Home", icon: HomeIcon, path: "/home" },
    { name: "Calendar", icon: CalendarMonthIcon, path: "/booking/calendar" },
    { name: "Bookings", icon: ListIcon, path: "/booking/bookings" },
  ];

  const NavItems = user?.role === "admin" ? adminNavItems : userNavItems;
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const selectedStyle = {
    backgroundColor: "#fecc00",
    borderRadius: "5px",
    color:'white',
    //borderBottom: '1px solid black', 
    // adjust thickness and color of underline
    // paddingBottom: '1px', 
    // adjust space between text and underline
    // fontWeight: 700,
    // fontSize: '1.4rem'
  };
  const unselectedStyle = {
    backgroundColor: 'transparent',
    color:'black',
    transition: "background 0.7s, color 0.7s",
    // fontWeight: 700,
    // fontSize: '1.4rem'
  };

  const location = useLocation();

 // to other apps {facility, booking, wallet, crowd control}
 const Navigation = () => {
  if (user?.role !== "admin") {
    return null;
  }

  return (
    <List
      sx={{
        marginLeft: 'auto',
        display: 'flex',
        fontSize: '1.2rem',
      }}
    >
      {mainNavItems.map((item, index) => (
        <Button
          key={index}
          className="adminapps"
          sx={{
            ...(item.path === location.pathname ? selectedStyle : unselectedStyle),
            '&:hover': {
              bgcolor: 'transparent',
              textDecoration: 'none',
              borderBottom: '1px solid black',
              paddingBottom: '1px',
              color: 'white',
              transition: 'color 0.1s',
              fontWeight: 770,
              fontSize: '1.3rem',
              fontFamily: 'Poppins',
            },
          }}
          href={item.path.startsWith('http') || item.name === 'Booking' ? item.path : `${BASE_URL}${item.path}`}
          target="_blank" //opens in a new tab
        >
          <ListItemButton>
            <ListItemText
              primary={item.name}
              primaryTypographyProps={{
                style: {
                  fontWeight: 770,
                  fontSize: '1.3rem',
                  fontFamily: 'Poppins',
                },
              }}
            />
          </ListItemButton>
        </Button>
      ))}
    </List>
  );
};

  const drawer = (
    // sidenav sidenavbar
    <div>
      <Toolbar sx={{ backgroundColor: "#fecc00", height: "100px", alignItems: "center" }}>
        <img src={Wild} alt="logo" width={300} height={70} />
      </Toolbar>
      {/* <Divider sx={{ backgroundColor: "white" }} /> */}
      {/* sidenav color */}
      <List sx={{ backgroundColor: "black", fontSize: "50px", }}>
        {NavItems.map((item, index) => (
          <ListItem
            sx={item.path === location.pathname ? selectedStyle : unselectedStyle}
            key={index}
            disablePadding
          >
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon sx={{ color: "white",  }}>
                <Icon component={item.icon}></Icon>
              </ListItemIcon>
              <ListItemText
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontFamily: "Poppins",
                  alignItems: "center",
                }}
                fontWeight="bold"
                primary={item.name}
              />
            </ListItemButton>
          </ListItem>
        ))}
        <br />

        <ListItem
          disablePadding
          sx={{ display: "flex", justifyContent: "center", paddingTop: 55 }}
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
            onClick={()=>{
              logoutUser()
            }}
          >
            <Typography fontFamily="Poppins" fontWeight="bold">
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
        <Toolbar sx={{ backgroundColor: "#fecc00", height: "100px"}}>

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
          <Typography
            variant="h4"
            noWrap
            component="div"
            fontFamily="Poppins"
            color="black"
            fontWeight="bold"
          >
            {props.title}
          </Typography>
          <Navigation/>

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
            border: "none",
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
              border: "none",
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
