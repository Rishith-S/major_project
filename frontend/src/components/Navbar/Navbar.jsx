import React from 'react';
import { useSelector } from 'react-redux';
import { AppBar, Button, IconButton, Toolbar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useLogout from '../../hooks/useLogout';

function Navbar() {
  const navigate = useNavigate();
  const logout = useLogout();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <AppBar position="fixed" style={{backgroundColor:"black"}}>
        <Toolbar>
          {/* <IconButton style={{color:"white"}} onClick={()=>{navigate(-1)}}>
            <ArrowBackIcon />
          </IconButton> */}
          <Button color="inherit" component={Link} to={'/home'}>
              Home
            </Button>
          <Button color="inherit" component={Link} to={'/home'}>
              History
            </Button>
          <Button color="inherit" style={{ marginLeft: 'auto' }} onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  )
}

export default Navbar;