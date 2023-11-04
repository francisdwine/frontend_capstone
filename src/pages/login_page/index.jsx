import React from "react";
import DashboardContainer from "../containers/dashboard_container";
import TextField from "@mui/material/TextField";
import { Button, Box, Typography, Card, CardMedia,Snackbar,Alert } from "@mui/material";
import { ButtonStyle1, loginstyle, fields, logo } from "./styles";
import { useState, useRef } from "react";
import Wild from "../../images/wild.png";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [open, setOpen] = React.useState(false);
  let {loginUser,loginError,setLoginError,user} = useContext(AuthContext);


  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      
      setLoginError(null)
      // return;
    }

    // setOpen(false);
  };
  const navigate=useNavigate()
  const [accounts, setAccount] = useState([]);
  const [accountlogin, setAccountlogin] = useState({
    email: "",
    password: "",
  });

  const { email, password } = accountlogin;
  const onInputChange = (e) => {
    setAccountlogin({ ...accountlogin, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    if(loginError===null){
      setOpen(false)
    }
    else{
      setOpen(true)
    }
  }, [loginError]);
  if(user!==null){
    navigate("/calendar")
  }
  else{
  return (
    <div>
      <img src={Wild} alt="logo" width={200} height={50} style={logo} />
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{horizontal:'center',vertical:'bottom'}}>
  <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
    {loginError}
  </Alert>
</Snackbar>

      <Box
        style={loginstyle}
        sx={{ p: 5, width: 300, height: 300, align: "center" }}
      >
        <Typography
          sx={{ fontWeight: "bold" }}
          id="modal-modal-title"
          variant="h4"
          component="h2"
          fontFamily="Poppins"
          color="black"
        >
          {" "}
          Log In
        </Typography>
        <br /> <br />
        <TextField
          label={"Email"}
          id="email"
          name="email"
          onChange={(e) => onInputChange(e)}
          style={fields}
        />{" "}
        <br />
        <br />
        <TextField
          label={"Password"}
          id="pw"
          name="password"
          type="password"
          onChange={(e) => onInputChange(e)}
          style={fields}
        />
        <br />
        <br />
        <Button variant="contained" color="primary" style={ButtonStyle1} onClick={()=>{
          loginUser(accountlogin.email,accountlogin.password)
        }}>
          Login
        </Button>
        <br />
      </Box>
    </div>
  );
      }
};

export default Login;
