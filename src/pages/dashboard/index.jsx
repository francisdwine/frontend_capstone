import DashBoardTemplate from "../containers/dashboard_template";

import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Grid,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  FormControl,
  MenuItem,
  InputLabel,
  Autocomplete,
  IconButton,
  Container,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { useState, useRef, useEffect, useNavigate } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Modal from "@mui/material/Modal";
import Select from "@mui/material/Select";
import axios from "axios";
import * as React from "react";

import {
  selectedStyle,
  unselectedStyle,
  modalHeaderStyle,
  modalStyle,
  ButtonStyle1,
  ButtonStyle2,
  StyledTableCell,
  StyledTableRow,
} from "./styles";


//temp deets
const ContainerDetails = [
    {
      title: 'ONGOING',
      contents: ['Co-Working Space', 'Conference A', 'Conference B', 'Joined Conference'],
    },
    {
      title: 'EXPECTED',
      contents: ['Co-Working Space', 'Conference A', 'Conference B', 'Joined Conference'],
    },
    {
      title: 'WAITING',
      contents: ['Co-Working Space', 'Conference A', 'Conference B', 'Joined Conference'],
    },
    {
      title: 'OVERSTAYING',
      contents: ['Co-Working Space', 'Conference A', 'Conference B', 'Joined Conference'],
    },
    
  ];

export default function Dashboard(props) {
  return (
    <DashBoardTemplate title="Dashboard">
      <Container sx={{ minWidth: 100, display: "flex", justifyContent: 'center' }}>
      {ContainerDetails.map((card, index) => (
        <Card
          key={index}
          variant="outlined"
          sx={{ width: 243, height: 260, backgroundColor: "#FFFF8F",marginRight: "50px" }}
        >
          <CardContent>
            <Typography sx={{ fontSize: 20, fontWeight: "bold" , }} color="text.primary" gutterBottom>
              {card.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="left" marginBottom="25px" gutterBottom>
              {card.contents}
            </Typography>
          </CardContent>
        </Card>
      ))}
      </Container>
      <Typography sx={{fontWeight: "bold",fontSize: "35px", fontFamily: "Roboto", textAlign: "canter"}} gutterBottom>
        Currently logged-in users
      </Typography>

      <Container sx={{marginBottom: 10}}gutterBottom>
        <TableContainer sx={{ minWidth: 50, display: "flex", justifyContent: 'center'}} gutterBottom>
          <Table
            style={{
              width: 1000,
              textAlign: "center",
              fontFamily: "Oswald",
            }}
          >
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Booking ID</StyledTableCell>
                <StyledTableCell align="center">Name</StyledTableCell>
                <StyledTableCell align="center">UserType</StyledTableCell>
                <StyledTableCell align="center">Venue</StyledTableCell>
                <StyledTableCell align="center">Time Signed in</StyledTableCell>
              </TableRow>
            </TableHead>
            {/* // Table Body */}
          </Table>
        </TableContainer>
      </Container>
      
      <Container sx={{display: "flex", justifyContent: "center"}}>
      <Container sx={{justifyContent: "right", }}>
        {/* Customer Satisfaction */}
        <Card variant= "outlined" sx={{ width: 400, height: 300, justifyContent: "right", backgroundColor: "F2F3F4"}}>
          <Typography>
            CUSTOMER SATISFACTION
          </Typography>
        </Card>
      </Container>

      <Container sx={{justifyContent: "right"}} gu>
        {/* Comments */}
        <Card variant= "outlined" sx={{ width: 400, height: 300, justifyContent: "right", backgroundColor: "red"}}></Card>
      </Container>
      </Container>

    </DashBoardTemplate>
  );
}
