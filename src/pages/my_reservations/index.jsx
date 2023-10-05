import DashBoardTemplate from "../containers/dashboard_template";
import Calendar from "../calendar_page/index";

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
} from "@mui/material";
import { useState, useRef } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Modal from "@mui/material/Modal";
import Select from "@mui/material/Select";
import axios from 'axios';
import ClearIcon from "@mui/icons-material/Clear";
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

// const events = [
//   {
//     title: "Meeting",
//     date: "05/20/2023",
//     start: "7:00",
//     end: "10:00",
//     venue: "Coworking Space",
//     reference: "12",
//     computers: "2",
//   },
//   {
//     title: "Meeting",
//     date: "05/20/2023",
//     start: "8:00",
//     end: "11:00",
//     venue: "Conference A",
//     reference: "12",
//     computers: "2",
//   },
// ];
  const maxComputers = 10;
export default function MyReservations(props) {
  const [bookingsRefresher, setBookingsRefresher] = useState(true);
  const [fakeUserDb, setFakeUserDb] = useState([]);
  const [eventData,setEventData]=useState([]);
  const [refresh, setRefresh] = useState(true);
  const [attendeeName, setAttendeeName] = useState("");
  const [tempId, setTempId] = useState(0);
  const [viewModal, setViewModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [role, setRole] = useState('user'); //default role
  const [viewDetails, setViewDetails] = useState({});
  const [attendeesModal, setAttendeesModal] = useState(false);
  const found = (element) => element.name === attendeeName;
  const deleteUser = (index) => {
    setAttendeeList([
      ...attendeeList.slice(0, index),
      ...attendeeList.slice(index + 1),
    ]);
  };

  const [user, setUser] = useState({
    id: 1,
    username: "joe",
  });

  const handleView = (title) => {
    setViewModal(true);
    let a = events.find((item) => {
      return item.title === title;
    });
    setViewDetails(a);
    console.log(a);
  };

  const handleEdit = (title) => {
    setEditModal(true);
    let b = events.find((item) => {
      return item.title === title;
    });
    setViewDetails(b);
    console.log(b);
  };
    //init page
    React.useEffect(() => {
      axios.get("http://127.0.0.1:8000/api/users/").then((res) => {
        setFakeUserDb(res?.data);
      });
    }, []);

  //display bookings
  const [events, setEvents] = useState([]);
  React.useEffect(() => {
    axios
      .get("http://localhost:8000/api/currentBookings/")
      .then((res) => {
        setEventData(res.data)
        setEvents(
          res?.data.map((item) => {
            return {
              id: item?.id,
              title: item?.description,
              date: item?.date,
              start: item?.startTime,
              end: item?.endTime,
              venue: item?.venue,
            };
          })
        );
      })
      ;
  }, [bookingsRefresher]);

  const cancelledBooking = () => {
    axios.get(`http://localhost:8000/api/getAllCancelledBookings/`)
    .then(() => {
      // put here joann hehe
    })
  }

  const cancelBooking = () => {
    axios.get(`http://localhost:8000/api/cancelBooking/${tempId}`)
      .then(() => {
        setBookingsRefresher(!bookingsRefresher); // Refresh the list of bookings
        setCancelModal(false);
        alert('Booking cancelled successfully');
      })
      .catch((error) => {
        console.error('Error cancelling booking:', error);
      });
  };

 
  

  // const fakeUserDb = [
  //   { name: "127-2242-290", id: 2 },
  //   { name: "225-5224-280", id: 3 },
  //   { name: "Celine", id: 4 },
  // ];

  const [venueSelected, setVenueSelected] = useState("Coworking Space");
  const [venueId, setVenueId] = useState(1);
  const [statusSelected, setStatusSelected] = useState("Upcoming");
  const [attendeeList, setAttendeeList] = useState([
    { name: "127-2242-290", id: 2 },
    { name: "225-5224-280", id: 3 },
    { name: "Celine", id: 4 },
  ]);

  const editAttendee = () => {
    setAttendeeList([
      ...attendeeList,
      { user_id: user.id, name: user.username },
    ]);
    axios.post(`http://localhost:8000/api/addAttendee/${tempId}`, {
      user: user.username,
      officeName: booking.current.officeName,
      user_id: user.id,
      attendees: [...attendeeList, { user_id: user.id, name: user.username }],
    }).then(()=>{
      setBookingsRefresher(!bookingsRefresher);
      alert("booking saved")
      });
     
  };

  const booking = useRef({
    purpose: "",
    title: "",
    description: "",
    startTime: "",
    venue: "",
    endTime: "",
    date: "",
    computers: 0,
    participants: 0,
    coins: 0,
    points: 0,
    user: 0,
  });

  return (
    <div>
        {role === 'user' ? (
            <DashBoardTemplate title="My Reservations">
            <div style={{ display: "flex",flexDirection:'column',alignItems:'start', fontFamily: 'Poppins' }}
            ></div>
            <br></br>
            <Box
              backgroundColor="white"
              display="flex"
              alignItems="center"
              flexDirection="column"
            >
              <Box
                sx={{
                  p: "0px 0px 0px 0px",
                }}
                maxWidth="90%"
              >
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <ButtonGroup>
                    <Button
                      sx={
                        statusSelected === "Upcoming"
                          ? selectedStyle
                          : unselectedStyle
                      }
                      onClick={() => setStatusSelected("Upcoming")}
                    >
                      Upcoming
                    </Button>
                    <Button
                      sx={
                        statusSelected === "History"
                          ? selectedStyle
                          : unselectedStyle
                      }
                      onClick={() => setStatusSelected("History")}
                    >
                      History
                    </Button>
                  </ButtonGroup>
                </div>
                <TableContainer>
                <Table style={{ width: 1000, textAlign: "center", fontFamily: "Oswald"}}>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="center">Title</StyledTableCell>
                        <StyledTableCell align="center">Date</StyledTableCell>
                        <StyledTableCell align="center">Start</StyledTableCell>
                        <StyledTableCell align="center">End</StyledTableCell>
                        <StyledTableCell align="center">Venue</StyledTableCell>
                        <StyledTableCell align="center"></StyledTableCell>
                        <StyledTableCell align="left"></StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {events.map((event) => (
                        <StyledTableRow>
                          <StyledTableCell component="th" scope="row">
                            {event.title}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {event.date}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {event.start}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {event.end}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {event.venue}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            <Button
                              sx={ButtonStyle1}
                              onClick={() => {
                                handleView(event.title);
                              }}
                            >
                              View
                            </Button>
                          </StyledTableCell>
    
                          {statusSelected === "Upcoming" ? (
                            <StyledTableCell align="right">
                              <Button
                                sx={ButtonStyle2}
                                onClick={() => {
                                  handleEdit(event.title);
                                }}
                              >
                                Edit
                              </Button>
                            </StyledTableCell>
                          ) : (
                            <StyledTableCell align="right">
                              <Button sx={ButtonStyle2}>Review</Button>
                            </StyledTableCell>
                          )}
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          </DashBoardTemplate>
        ): (
            <DashBoardTemplate title="Manage Reservations"> 
          <div style={{ display: "flex",flexDirection:'column',alignItems:'start', fontFamily: 'Poppins' }}>     
          </div>
          <br></br>
          <Box backgroundColor="white" display='flex' alignItems='center' flexDirection='column'>
          
            <Box
              sx={{
                p: "0px 0px 0px 0px",
              }}
              maxWidth='90%'
              
            >
              <div style={{ display: "flex", marginBottom: "20px" }}>
              <ButtonGroup>
              <Button
                sx={
                    statusSelected === "Cancelled"
                      ? selectedStyle
                      : unselectedStyle
                  }
                  onClick={() => setStatusSelected("Cancelled")}
                  >CANCELLED</Button>
                <Button
                sx={
                  statusSelected === "No Show"
                    ? selectedStyle
                    : unselectedStyle
                }
                onClick={() => setStatusSelected("No Show")}>
                NO SHOW</Button>
                <Button
                sx={
                  statusSelected === "All"
                    ? selectedStyle
                    : unselectedStyle
                }
                onClick={() => setStatusSelected("All")}>
                ALL</Button>
              </ButtonGroup>
            </div>
              
               <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <ButtonGroup>
                
              <Button
                  sx={
                    venueSelected === "Coworking Space"
                      ? selectedStyle
                      : unselectedStyle
                  }
                  onClick={() => {
                    setVenueSelected("Coworking Space");
                    setVenueId(1);
                  }}
                >
                  CO-WORKING SPACE
                </Button>
                <Button
                  sx={
                    venueSelected === "Conference Room A"
                      ? selectedStyle
                      : unselectedStyle
                  }
                  onClick={() => {
                    setVenueSelected("Conference Room A");
                    setVenueId(2);
                  }}
                >
                  CONFERENCE A
                </Button>
                <Button
                  sx={
                    venueSelected === "Conference Room B"
                      ? selectedStyle
                      : unselectedStyle
                  }
                  onClick={() => {
                    setVenueSelected("Conference Room B");
                    setVenueId(3);
                  }}
                >
                  CONFERENCE B
                </Button>

              </ButtonGroup>
              </div>
             <TableContainer>
             <Table style={{ width: 1000, textAlign: "center", fontFamily: "Oswald"}}>
                <TableHead >
                  <TableRow>
                    <StyledTableCell align="center">Title</StyledTableCell>
                    <StyledTableCell align="center">Date</StyledTableCell>
                    <StyledTableCell align="center">Start</StyledTableCell>
                    <StyledTableCell align="center">End</StyledTableCell>
                    <StyledTableCell align="center">Venue</StyledTableCell>
                    <StyledTableCell align="left"></StyledTableCell>
                    <StyledTableCell align="left"></StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {events.map((event,index) => (
            <StyledTableRow>
              <StyledTableCell align="center" component="th" scope="row" fontFamily="Poppins">
                {event.title}
              </StyledTableCell>
              <StyledTableCell align="center">{event.date}</StyledTableCell>
              <StyledTableCell align="center">{event.start}</StyledTableCell>
              <StyledTableCell align="center">{event.end}</StyledTableCell>
              <StyledTableCell align="center">{event.venue}</StyledTableCell>
              <StyledTableCell align="center"><Button sx={ButtonStyle1} onClick={() => {handleView(event.title)}}>View</Button></StyledTableCell>

              {statusSelected === "Upcoming"
              ? <StyledTableCell align="center"><Button sx={ButtonStyle2} onClick={() => {handleEdit(event.title)}}>Edit</Button></StyledTableCell>
              : (<StyledTableCell align="center"><Button sx={ButtonStyle2}>Review</Button></StyledTableCell>)
              }    
            </StyledTableRow>
          ))}
                </TableBody>
              </Table>
             </TableContainer>  
            </Box>
          </Box>
        </DashBoardTemplate>
        )}

      <Modal
        disableAutoFocus={true}
        open={viewModal}
        onClose={() => setViewModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ width: "100%", overflow: "auto" }}
      >
        <Box sx={modalStyle}>
          <Box sx={modalHeaderStyle}>
            <Typography
              sx={{ fontWeight: "bold" }}
              id="modal-modal-title"
              variant="h5"
              component="h2"
              fontFamily="Oswald"
              color="white"
            >
              Booking Enrollment
            </Typography>
          </Box>

          <Box p={4}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                fontWeight="bold"
                marginBottom="5px"
                fontFamily="Roboto Slab"
              >
                Title:
              </Typography>
              <Typography
                fontWeight="bold"
                marginBottom="5px"
                fontFamily="Roboto Slab"
              >
                {viewDetails.title}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                fontWeight="bold"
                marginBottom="5px"
                fontFamily="Roboto Slab"
              >
                Reference No:
              </Typography>
              <Typography
                fontWeight="bold"
                marginBottom="5px"
                fontFamily="Roboto Slab"
              >
                {viewDetails.reference}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                fontWeight="bold"
                marginBottom="5px"
                fontFamily="Roboto Slab"
              >
                Computers:
              </Typography>
              <Typography
                fontWeight="bold"
                marginBottom="5px"
                fontFamily="Roboto Slab"
              >
                {viewDetails.computers}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                fontWeight="bold"
                marginBottom="5px"
                fontFamily="Roboto Slab"
              >
                Start Time:
              </Typography>
              <Typography
                fontWeight="bold"
                marginBottom="5px"
                fontFamily="Roboto Slab"
              >
                {viewDetails.start}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                fontWeight="bold"
                marginBottom="5px"
                fontFamily="Roboto Slab"
              >
                End Time:
              </Typography>
              <Typography
                fontWeight="bold"
                marginBottom="5px"
                fontFamily="Roboto Slab"
              >
                {viewDetails.end}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                fontWeight="bold"
                marginBottom="5px"
                fontFamily="Roboto Slab"
              >
                Venue:
              </Typography>
              <Typography
                fontWeight="bold"
                marginBottom="5px"
                fontFamily="Roboto Slab"
              >
                {viewDetails.venue}
              </Typography>
            </Box>

            <br></br>
            <Typography
              fontWeight="bold"
              marginTop="0px"
              fontFamily="Oswald"
              backgroundColor="black"
              sx={{ float: "left", transform: "rotate(-5deg)" }}
              p="5px 10px 5px 10px"
              color="white"
            >
              Attendees
            </Typography>
            <List
              className="userList"
              dense={true}
              style={{ maxHeight: "150px", width: "100%", overflow: "auto" }}
            >
              {attendeeList.map((item, i) => (
                <React.Fragment key={i}>
                  <ListItem m={0} key={i}>
                    <ListItemText
                      fontSize="12px"
                      primary={item.name}
                      // secondary={secondary ? 'Secondary text' : null}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
            
          </Box>
          <Box
            sx={{
              margin: "10px 15px 15px 10px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              sx={ButtonStyle1}
              variant="contained"
              onClick={() => {
                setCancelModal(true);
                setViewModal(false);
              }}
            >
              Cancel Booking
            </Button>
          </Box>
        </Box>
      </Modal>
      {/* Are you sure you want to cancel */}
      <Modal
      disableAutoFocus={true}
      open={cancelModal}
      onEn
      onClose={() => setCancelModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      style={{width: "100%", overflow: "auto" }} 
      >
        <Box sx={modalStyle}>
        <Box sx={modalHeaderStyle}>
            <Typography
              sx={{ fontWeight: "bold" }}
              id="modal-modal-title"
              variant="h5"
              component="h2"
              fontFamily="Oswald"
              color="white"
            >
              Are you sure you want to cancel?
            </Typography>
            
          </Box>
          <Box p={4}>
          {role === 'user' ? (
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    fontWeight="bold"
                    marginBottom="5px"
                    fontFamily="Roboto Slab"
                  >
                    Cost of Cancellation: 10
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Button variant="contained">
                    Pay
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setViewModal(false);
                      setCancelModal(false);
                    }}
                  >
                    No
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button variant="contained" onClick={() => cancelBooking(tempId)}>
                  Yes
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setViewModal(false);
                    setCancelModal(false);
                  }}
                >
                  No
                </Button>
                </Box>
                )}
                </Box>
              </Box>
          
      </Modal>

      {/*EDIT Modal */}
      <Modal
        disableAutoFocus={true}
        open={editModal}
        onClose={() => setEditModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ width: "100%", overflow: "auto" }}
      >
        <Box sx={modalStyle}>
          <Box sx={modalHeaderStyle}>
            <Typography
              sx={{ fontWeight: "bold" }}
              id="modal-modal-title"
              variant="h5"
              component="h2"
              fontFamily="Oswald"
              color="white"
            >
              Edit Booking Details
            </Typography>
          </Box>
          <Box p={4}>
            <TextField
              name="description"
              onChange={(e) => props.handleChange(e.target.value)}
              sx={{ width: "100%" }}
              id="outlined-basic"
              label="Title"
              variant="standard"
              inputProps={{ maxLength: 50 }}
            />
            <FormControl variant="standard" sx={{ minWidth: "100%" }}>
              <InputLabel id="demo-simple-select-filled-label">
                Purpose
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Purpose"
                name="purpose"
              >
                {/* <MenuItem value="Purpose">
              <em>None</em>
             </MenuItem> */}
                <MenuItem value={"Studying"}>Studying</MenuItem>
                <MenuItem value={"Playing"}>Playing</MenuItem>
                <MenuItem value={"Meeting"}>Meeting</MenuItem>
                <MenuItem value={"Other"}>Other</MenuItem>
                <MenuItem value={"Other"}>Other</MenuItem>
                <MenuItem value={"Other"}>Other</MenuItem>
                <MenuItem value={"Other"}>Other</MenuItem>
                <MenuItem value={"Other"}>Other</MenuItem>
                <MenuItem value={"Other"}>Other</MenuItem>
              </Select>
            </FormControl>

            {/*<TextField
              name="officeName"
              sx={{ width: "100%" }}
              id="outlined-basic"
              label="Office Name"
              variant="standard"
              inputProps={{ maxLength: 20 }}
            />*/}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <TextField
                name="computers"
                type="number"
                sx={{ width: "40%" }}
                InputProps={{
                  inputProps: {
                    min: 0,
                    max: maxComputers,
                  },
                }}
                id="outlined-basic"
                label="Computers"
                variant="standard"
                autoFocus={false}
              />
              
            </Box>
            <Button variant="contained" onClick={() => {
                  setViewModal(false);
                  setCancelModal(false);
                  setAttendeesModal(true);
                }}
            sx={{ ...ButtonStyle1, marginLeft: '260px', marginTop: '20px'}}>Next</Button>
          </Box>
        </Box>
      </Modal>
    {/*Attendees Edit*/}
      <Modal
        disableAutoFocus={true}
        //open={editAttendee}
        onEn
        onClose={() => setEditModal(true)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ width: "100%", overflow: "auto" }}
      >
        <Box sx={modalStyle}>
          <Box sx={modalHeaderStyle}>
            <Typography
              sx={{ fontWeight: "bold" }}
              id="modal-modal-title"
              variant="h5"
              component="h2"
              fontFamily="Oswald"
              color="white"
            >
              Attendees
            </Typography>
          </Box>
          <TextField
              name="attendee"
              sx={{ width: "100%" }}
              id="outlined-basic"
              label="Attendee Name"
              variant="standard"
              inputProps={{ maxLength: 20 }}
            />
          <List
              className="userList"
              dense={true}
              style={{ maxHeight: "150px", width: "100%", overflow: "auto" }}
            >
              <React.Fragment>
                <ListItem m={0}>
                  <ListItemText
                    fontSize="12px"
                    primary={user.username}
                    // secondary={secondary ? 'Secondary text' : null}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
              {attendeeList.map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem m={0} key={index}>
                    <ListItemText
                      fontSize="12px"
                      primary={item.name}
                      // secondary={secondary ? 'Secondary text' : null}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
        </Box>
      </Modal>



       {/* add or remove attendees */}
       <Modal
      disableAutoFocus={true}
      open={attendeesModal}
      onClose={() => setAttendeesModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      style={{ width: "100%", overflow: "auto" }}
    >

        <Box sx={modalStyle}>
          <Box sx={modalHeaderStyle}>
            <Typography
              fontWeight="bold"
              variant="h6"
              fontFamily="Oswald"
              color="white"
              p="5px 10px 5px 10px"
              sx={{ display: "inline-block" }}
            >
              Attendees:
            </Typography>
          </Box>
            <Box p={4}>
            <Box sx={{ display: "flex", marginTop: "20px" }}>
              {/* <TextField
                sx={{ width: "100%", marginRight: "20px" }}
                id="outlined-basic"
                placeholder="Enter Name or Id"
                variant="standard"
                onChange={(e) => {
                  setAttendeeName(e.target.value);
                }}
              /> */}
              <Autocomplete
                freeSolo
                defaultValue=""
                autoSelect={false}
                id="combo-box-demo"
                options={fakeUserDb.map((item) => {
                  return {
                    label: item.name,
                    id: item.id,
                  };
                })}
                inputValue={attendeeName}
                onInputChange={(event, newInputValue) => {
                  setAttendeeName(newInputValue);
                }}
                sx={{ width: 300, marginRight: 5 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Enter Name or Id"
                    variant="standard"
                  />
                )}
              />
              <Button
                onClick={(e) => {
                  if (attendeeName === "") {
                    alert("Please Enter Attendee name");
                    return;
                  }
                  if (
                    attendeeList.some(found) ||
                    attendeeName === user.username
                  ) {
                  } else {
                    let isExisting = false;
                    let id = null;
                    let userFound = null;
                    //finds username in database
                    userFound = fakeUserDb.find((x) => x.name === attendeeName);

                    if (userFound !== undefined) {
                      isExisting = true;
                      id = userFound?.id;
                    }
                    const newUser = {
                      name: attendeeName,
                      existing: isExisting,
                      id: id,
                    };
                    setAttendeeList([...attendeeList, newUser]);
                    // setRefresh(!refresh)
                  }
                }}
                sx={{
                  color: "white",
                  backgroundColor: "#555555",
                  ":hover": { color: "#white", backgroundColor: "#555555" },
                }}
              >
                Add
              </Button>
              
              </Box>
              <Box m="5px 15px 0px 0px">
            <List
              style={{ maxHeight: "200px", width: "100%", overflow: "auto" }}
              className="userList"
              dense={true}
            >
              <ListItem sx={{ p: "0px 0px 0px 5px" }}>
                <ListItemText
                  primary={user.username}
                  secondary={
                    <Typography fontSize={14} color="green">
                      Owner
                    </Typography>
                  }
                />
              </ListItem>
              {attendeeList.map((item, index) => (
                <ListItem
                  key={index}
                  sx={{ p: "0px 0px 0px 20x" }}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => {
                        deleteUser(index);
                      }}
                    >
                      <ClearIcon></ClearIcon>
                    </IconButton>
                  }
                >
                  {/* <ListItemAvatar>
                  <Avatar>
                    <PersonIcon></PersonIcon>
                  </Avatar>
                </ListItemAvatar> */}
                  <ListItemText
                    primary={item.name}
                    secondary={
                      item.existing === true ? (
                        <Typography fontSize={14} color="green">
                          Existing User:Yes{" "}
                        </Typography>
                      ) : (
                        <Typography fontSize={14} color="#555555">
                          Existing User:No{" "}
                        </Typography>
                      )
                    }
                  />
                </ListItem>
              ))}
              </List>
        
                  
              <Box sx={{float:"right", margin: 2, marginRight:-1}}>
          <Button sx={ButtonStyle1} onClick={() => {
                setAttendeesModal(false);
                
              }}>
            Save</Button> </Box>
          
          </Box>
          </Box>
          </Box>
      

      </Modal>
    </div>
  );
}
