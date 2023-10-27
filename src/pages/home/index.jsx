import React from "react";
import DashboardContainer from "../containers/dashboard_container";
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";

// Wala pani heheh

const Home = () => {
    return (
            <div>
                <DashboardContainer title="Home">
                <TextField label={'Email'} id="email" /> <br /><br />
                <TextField label={'Password'} id="pw" type="password" />
                <br /><br />
                <Button variant="contained" color="primary" style={{marginLeft: '10px', width: '50px'}}>Login</Button>
                </DashboardContainer>
            </div>
    );
};

export default Home;
