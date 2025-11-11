import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Button,
  Tooltip,
  Badge,
  useMediaQuery,
} from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width:768px)");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    setIsLoggedIn(!!token);
    setRole(userRole);
  }, [location.pathname]);

  // ✅ Role-based navigation
  const pages =
    role === "EMPLOYEE"
      ? [
          { name: "Dashboard", path: "/employee-dashboard" },
          { name: "Apply Leave", path: "/leave-request" },
          { name: "Holiday Calendar", path: "/holidays" },
        ]
      : role === "MANAGER"
      ? [
          { name: "Dashboard", path: "/manager-dashboard" },
          { name: "Team Requests", path: "/upcoming-leave" },
        ]
      : role === "HR"
      ? [
          { name: "Dashboard", path: "/hr-dashboard" },
          { name: "User Management", path: "/user-manage" },
          { name: "Holiday Management", path: "/holiday-manage" },
          { name: "Policies", path: "/policy-manage" },
          { name: "Department", path:"/department-manage" },
        ]
      : [];

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleNavigate = (path) => {
    navigate(path);
    setAnchorElNav(null);
  };
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: "linear-gradient(90deg, #1565c0 0%, #00bfa5 50%, #8e24aa 100%)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* ===== Logo / Title ===== */}
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            mr: 2,
            cursor: "pointer",
            fontWeight: "bold",
            letterSpacing: "0.5px",
            background: "linear-gradient(to right, #fff, #c8e6c9)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
          onClick={() => navigate("/")}
        >
          Leave Management
        </Typography>

        
        {isMobile && isLoggedIn && (
          <Box>
            <IconButton
              size="large"
              color="inherit"
              onClick={handleOpenNavMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={() => handleNavigate(page.path)}>
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        )}

     
        {!isMobile && isLoggedIn && (
          <Box sx={{ flexGrow: 1, display: "flex", gap: 2 }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={() => handleNavigate(page.path)}
                sx={{
                  my: 1,
                  color: "white",
                  textTransform: "none",
                  fontWeight: 500,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.2)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>
        )}

  
        {isLoggedIn ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            
            <Tooltip title="Account Settings">
              <IconButton onClick={handleOpenUserMenu} color="inherit">
                <AccountCircle />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        ) : (
      
          <Box sx={{ flexGrow: 1, textAlign: "right" }}>
            <Button
              onClick={() => navigate("/login")}
              sx={{
                color: "white",
                fontWeight: "bold",
                backgroundColor: "rgba(255,255,255,0.15)",
                borderRadius: 2,
                px: 2,
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.3)",
                  transform: "scale(1.05)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Login
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
