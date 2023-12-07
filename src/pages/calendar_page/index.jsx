import * as React from "react";
import DashBoardTemplate from "../containers/dashboard_template";
import { BASE_URL } from "../../links";
import FilledAlerts from "../../alerts";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import ModalOne from "./components/modal1";
import axios from "axios";
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  // FormControl,
  IconButton,
  // InputLabel,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";
import { useState, useRef, useEffect } from "react";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
// import MenuItem from "@mui/material/MenuItem";
// import Select from "@mui/material/Select";
import moment from "moment/moment";
import ClearIcon from "@mui/icons-material/Clear";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {
  ButtonStyle1,
  selectedStyle,
  unselectedStyle,
  modalHeaderStyle,
  modalStyle,
  ButtonStyle2,
} from "./styles";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const today = new Date();
//dynamic max week
const maxWeeks = 2;
const after_2_weeks = new Date();
after_2_weeks.setDate(today.getDate() + maxWeeks * 7);

// [k
//   {
//     title: "Meeting",
//     start: "2023-05-15T19:30:00",
//     end: "2023-05-15T20:00:00",
//     venue: "Coworking Space",
//   },
//   {
//     title: "Meeting",
//     start: "2023-05-16T09:30:00",
//     end: "2023-05-16T11:30:00",
//     venue: "Conference A",
//   },
// ];

export function CustomAlert({ open, onClose, title, message, success }){
  const defaultBackgroundColor = success ? "#5bb450" : "#e74c3c";
  console.log(success);
  const defaultTextColor = "white";

  const dialogStyle = {
    "& .MuiPaper-root": {
      backgroundColor: defaultBackgroundColor,
      maxWidth: "900px",
      width: "480px",
      color: defaultTextColor,
      position: "absolute",
      top: "0",
      left: "50%",
      transform: "translate(-50%, 0)",
      borderRadius: "10px",
      height: "100px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    "& .MuiButton-root": {
      color: defaultTextColor,
    },
  };

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  return (
    <Dialog open={open} onClose={onClose} sx={dialogStyle}>
      <DialogTitle closeButton>{title}</DialogTitle>
      <DialogContent sx={{ justifyContent: "center" }}>{message}</DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
};

export default function Calendar(props) {
  let { user, setUser, authenticated } = useContext(AuthContext);

  const [bookingsRefresher, setBookingsRefresher] = useState(true);
  const [cancelModal, setCancelModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [tempId, setTempId] = useState(0);
  const [role, setRole] = useState("admin"); //default role
  const [info, setInfo] = useState({});
  const [alertSuccess, setAlertSuccess] = useState(true);


  const submitBooking = () => {
    // setAttendeeList(attendeeList=>[
    //   ...attendeeList,
    //   { user_id: 1, name: "wind"}
    // ]);
    if (
      booking.current.officeName === "" ||
      booking.current.officeName === " " ||
      booking.current.officeName === null
    ) {
      booking.current.officeName = "none";
    }

    axios
      .post(`${BASE_URL}/api/createBooking/`, {
        officeName: booking.current.officeName,
        purpose: booking.current.purpose,
        description: booking.current.description,
        venue: venueId,
        date: booking.current.date,
        startTime: booking.current.startTime,
        endTime: booking.current.endTime,
        computers: booking.current.computers,
        coins: booking.current.coins,
        points: booking.current.points,
        user: user.user_id,

        user_id: user.user_id,
        attendees: [
          ...attendeeList,
          { name: user.username, user_id: user.user_id },
        ],
      })
      .then((res) => {
        if (res.data.error) {
          setAlertMessage(res.data.error);
          setAlertOpen(true);
          setAlertSuccess(false);
        } else {
          setBookingsRefresher(!bookingsRefresher);
          setAlertMessage("Booking created successfully!");
          setAlertOpen(true);
          setAlertSuccess(true);
          setAttendeeList([]);
        }
      });
  };
  //data to send
  //new booking
  // const [user, setUser] = useState({
  //   id: 1,
  //   username: "francis",
  // });
  const [bookingAttendees, setBookingAttendees] = useState([]);
  const venueArray = [
    "",
    "Coworking Space",
    "Conference Room A",
    "Conference Room B",
  ];

  const handleView = (id) => {
    setTempId(id);

    axios.get(`${BASE_URL}/api/getAttendees/${id}/`).then((res) => {
      setBookingAttendees(res.data);
    });

    var res = eventData.find((item) => {
      return item?.id === parseInt(id);
    });

    var cancelCost = 0;

    if (res.points === 0 && res.coins > 0) {
      cancelCost = res.coins * 0.3;
    } else if (res.coins === 0 && res.points > 0) {
      cancelCost = res.points * 0.3;
    }
    console.log(cancelCost);
    res = { ...res, cancelCost: cancelCost };
    // console.log("user called ID:", res.user_id);
    setInfo(res);
    setOpenInfoModal(true);
  };

  //init page
  React.useEffect(() => {
    axios.get(`${BASE_URL}/api/getUsers/`).then((res) => {
      setFakeUserDb(res?.data);
      axios.get(`${BASE_URL}/facility/get-facility/`).then((res) => {
        setFacilities(res?.data);
        // stroe lng nakog variable ang index 0 pra di sigeg access
        var indx0 = res?.data[0];
        setVenueSelected(indx0.facility.facility_name);
        setVenueId(indx0?.facility?.facility_id);
        setAttendeLimit(indx0?.main_rules?.num_attendies);
        setMaxComputers(indx0?.main_rules?.num_pc);
      });
    });
  }, []);

  //display bookings
  const [events, setEvents] = useState([]);
  React.useEffect(() => {
    axios.get(`${BASE_URL}/api/currentBookings/`).then((res) => {
      // setEvents(
      //   res?.data.map((item) => {
      //     return {
      //       id: item?.id,
      //       title: item?.description,
      //       start: item?.date + "T" + item?.startTime,
      //       end: item?.date + "T" + item?.endTime,
      //       venue: item?.venue,
      //     };
      //   })
      // );

      var bookings = res?.data.map((item) => {
        return {
          id: item?.id,
          title: item?.description,
          start: item?.date + "T" + item?.startTime,
          end: item?.date + "T" + item?.endTime,
          venue: item?.venue,
          type: "booking",
        };
      });

      axios.get(`${BASE_URL}/api/getEvents/`).then((res) => {
        var calendarEvents;
        calendarEvents = res?.data.map((item) => {
          var dateSplit = item?.date.split("T");
          return {
            id: item?.id,
            title: item?.event_name,
            start: dateSplit[0] + "T" + item?.start,
            end: dateSplit[0] + "T" + item?.end,
            venue: item?.facility,
            type: "rule",
            backgroundColor: "black",
            textColor: "white",
          };
        });
        bookings = bookings.concat(calendarEvents);

        setEvents(bookings);
      });
      setEventData(res.data);
    });
  }, [bookingsRefresher]);
  // cancelled bookings
  const cancelBooking = () => {
    axios
      .get(`${BASE_URL}/api/cancelBooking/${tempId}`)
      .then(() => {
        setBookingsRefresher(!bookingsRefresher); // Refresh the list of bookings
        setCancelModal(false);
        setAlertMessage("Booking cancelled successfully");
        setAlertOpen(true);
        setAlertSuccess(true);
      })
      .catch((error) => {
        console.error("Error cancelling booking:", error);
      });
  };
  // calculation of
  const [cost, setCost] = useState(0);
  const calculateCost = () => {
    // Prepare the data needed for cost calculation
    const costData = {
      numOfComputers: booking.current.computers,
      startTime: booking.current.startTime,
      endTime: booking.current.endTime,
      numOfStudents: attendeeList.length + 1,
    };

    axios
      .post(`http://localhost:8000/api/calculateCost/${venueId}`, costData)
      .then((response) => {
        //contain the calculated cost
        const calculatedCost = response.data.cost; // Adjust this based on your server response
        setBookingsRefresher(!bookingsRefresher);
        setCost(calculatedCost);
      })
      .catch((error) => {
        console.error("Error calculating cost:", error);
      });
  };

  const [eventData, setEventData] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [attendeeList, setAttendeeList] = useState([]);
  const [fakeUserDb, setFakeUserDb] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const handleChange = (e) => {
    var tempBooking = booking.current;
    if (e.target.name === "computers") {
      tempBooking[e.target.name] = parseInt(e.target.value);
    } else {
      tempBooking[e.target.name] = e.target.value;
    }
    booking.current = tempBooking;
    setRefresh(!refresh);
  };

  const booking = useRef({
    purpose: "Studying",
    description: "",
    startTime: "",
    venue: "",
    endTime: "",
    date: "",
    computers: 0,
    coins: 0,
    points: 0,
    user_id: user?.user_id,
    officeName: " ",
    attendees: [],
  });

  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);
  const [openInfoModal, setOpenInfoModal] = useState(false);
  const [attendeeName, setAttendeeName] = useState("");
  const [venueSelected, setVenueSelected] = useState("Coworking Space");
  const [venueId, setVenueId] = useState(1);
  const [attendLimit, setAttendeLimit] = useState(0);
  const [maxComputers, setMaxComputers] = useState(0);
  const [error, setError] = useState(false);
  const found = (element) => element.name === attendeeName;
  const navigate = useNavigate();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [alertInfo, setAlertInfo] = useState({
    visible: false,
    variant: "info",
    message: "",
  });

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const deleteUser = (index) => {
    setAttendeeList([
      ...attendeeList.slice(0, index),
      ...attendeeList.slice(index + 1),
    ]);
  };
  //to handle security
  if (user === null) {
    navigate("/booking/login");
  } else {
    return (
      <div style={{ position: "relative" }}>
        <DashBoardTemplate title="Calendar">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              paddingTop: "40px",
            }}
          >
            <Typography
              sx={{ paddingLeft: 2, color: "darkred" }}
              fontFamily="Poppins"
            >
              *Click and drag on time-slots to start booking
              {/* {name} */}
            </Typography>
          </div>
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
              <div style={{ display: "flex", marginBottom: "20px" }}>
                <ButtonGroup>
                  {facilities.map((item, index) => (
                    <Button
                      sx={
                        venueSelected === item?.facility?.facility_name
                          ? selectedStyle
                          : unselectedStyle
                      }
                      onClick={() => {
                        booking.current = { ...booking.current, computers: 0 };
                        setVenueSelected(item?.facility?.facility_name);
                        setVenueId(item?.facility?.facility_id);
                        setAttendeLimit(item?.main_rules?.num_attendies);
                        // setMaxComputers(item?.main_rules?.num_pc)
                        // alert(item?.main_rules?.status)
                        if (item?.main_rules.status === true) {
                          setMaxComputers(item?.main_rules?.num_pc);
                        } else if (item.main_rules.status === false) {
                          setMaxComputers(0);
                        }
                      }}
                    >
                      {item?.facility?.facility_name}
                    </Button>
                  ))}
                  {/* <Button
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
                    Co-working Space
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
                    Conference Room A
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
                    Conference Room B
                  </Button> */}
                </ButtonGroup>
              </div>
              <FullCalendar
                events={events.filter((item) => {
                  return item.venue === venueId;
                })}
                selectAllow={(select) => {
                  return select.end.getDay() === select.start.getDay();
                }}
                // function para sa pili ug timeslot calendar functions
                select={(info) => {
                  var currentDate = new Date();
                  var selectedStartTime = new Date(info.startStr);

                  // Check if the selected start time is in the past
                  if (selectedStartTime <= currentDate) {
                    setAlertMessage("Please select a future time");
                    setAlertOpen(true);
                    setAlertSuccess(false);
                  } else {
                    var dateSplitted = info.startStr.split("T");
                    var startDate = dateSplitted[0];
                    var startTime = dateSplitted[1].split("+")[0];
                    var dateSplitted2 = info.endStr.split("T");
                    var endTime = dateSplitted2[1].split("+")[0];
                    //kwaon duration sa booking
                    var startTimeSeconds = startTime
                      .split(":")
                      .reduce((acc, time) => 60 * acc + +time);
                    var endTimeSeconds = endTime
                      .split(":")
                      .reduce((acc, time) => 60 * acc + +time);
                    var hoursDuration =
                      (endTimeSeconds - startTimeSeconds) / (60 * 60);
                    var totalDuration = 0;
                    axios
                      .post(`${BASE_URL}/api/getDurations/`, {
                        id: user?.user_id,
                        date: startDate,
                      })
                      .then((response) => {
                        totalDuration = response.data.duration;
                        var limit = 3 - totalDuration;

                        if (user?.role === "user") {
                          if (hoursDuration > limit || limit < 0) {
                            setAlertMessage(
                              "You have exceeded the limit of 3 hours booking per week"
                            );
                            setAlertOpen(true);
                            setAlertSuccess(false);
                            // alert("You have exceeded the limit of 3 hours booking per week")
                            setTimeout(() => {
                              setAlertInfo((prevAlertInfo) => ({
                                ...prevAlertInfo,
                                visible: false,
                              }));
                            }, 3000);
                            return null;
                          }
                        }

                        var tempBooking = booking.current;
                        tempBooking.startTime = startTime;
                        tempBooking.endTime = endTime;
                        tempBooking.date = startDate;
                        tempBooking.venue = venueSelected;
                        booking.current = tempBooking;
                        // console.log(booking.current);
                        setOpenModal1(true);
                      })
                      .catch((error) => {
                        console.error("error getting duration:", error);
                        return null;
                      });
                  }
                }}
                //function para ig click ug usa ka event
                eventClick={(e) => {
                  setSelectedEvent(e.event);
                  // console.log(e);
                  if (e.event._def.extendedProps.type === "rule") {
                    setAlertMessage(
                      "Booking not available at this time due to a scheduled important event."
                    );
                    setAlertOpen(true);
                  } else if (e.event._def.extendedProps.type === "booking") {
                    handleView(e.event.id);
                  }
                }}
                unselect={(jsEvent, view) => {}}
                // dayClick={(date, jsEvent, view) => {}}
                selectOverlap={(event) => {}}
                selectable={true}
                showNonCurrentDates={false}
                slotMinTime="09:00:00"
                slotMaxTime="23:00:00"
                plugins={[
                  dayGridPlugin,
                  timeGridPlugin,
                  interactionPlugin,
                  listPlugin,
                ]}
                // initialView="dayGridMonth"
                views={{
                  dayGridMonth: {
                    selectable: false,
                  },
                  dayGridWeek: {
                    selectable: false,
                  },
                }}
                headerToolbar={{
                  start: "prev,next today",
                  center: "title",
                  end: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                allDaySlot={false}
                initialView="timeGridWeek"
                aspectRatio={25.0}
                //events data

                eventContent={renderEventContent}
                validRange={{
                  start: today,
                  end: after_2_weeks,
                }}
                eventBackgroundColor="#fecc00"
                eventTextColor="black"
                height="100"
                contentHeight="auto"
                weekends={false}
              ></FullCalendar>
              <CustomAlert
                open={alertOpen}
                onClose={handleAlertClose}
                message={alertMessage}
              />
            </Box>
            <Typography></Typography>
          </Box>
        </DashBoardTemplate>
        {/* modal 1 modal1 modal one modalone */}
        <ModalOne
          error={error}
          setError={setError}
          booking={booking}
          openModal1={openModal1}
          setOpenModal2={setOpenModal2}
          setOpenModal1={setOpenModal1}
          handleChange={handleChange}
        />
        <Modal
          open={openModal2}
          onClose={() => setOpenModal2(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          disableAutoFocus={true}
        >
          <Box sx={modalStyle}>
            <Box sx={modalHeaderStyle}>
              <Typography
                sx={{ fontWeight: "bold" }}
                id="modal-modal-title"
                variant="h5"
                component="h2"
                fontFamily="Poppins"
                color="white"
              >
                Booking Enrollment
              </Typography>
              <Button
                onClick={() => {
                  setOpenModal2(false);
                }}
                sx={{ p: 0, m: 0, color: "white" }}
              >
                <CloseIcon></CloseIcon>
              </Button>
            </Box>

            <Box p="30px 30px 0px 30px">
              {maxComputers !== 0 ? (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <TextField
                    name="computers"
                    type="number"
                    sx={{ width: "40%" }}
                    value={booking.current.computers}
                    InputProps={{
                      inputProps: {
                        min: 0,
                        max: maxComputers,
                      },
                    }}
                    id="outlined-basic"
                    label="Computers"
                    variant="standard"
                    onChange={(e) => handleChange(e)}
                    autoFocus={false}
                  />
                </Box>
              ) : (
                <></>
              )}

              <br></br>

              <Typography
                fontWeight="bold"
                variant="h6"
                fontFamily="Poppins"
                backgroundColor="#222222"
                color="white"
                p="5px 10px 5px 10px"
                sx={{ display: "inline-block" }}
              >
                Attendees:
              </Typography>

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
                      label: item.email,
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
                    // console.log(attendLimit);
                    if (attendeeList.length >= attendLimit) {
                      // alert("Limit Exceeded for This Venue");
                      setAlertInfo({
                        visible: true,
                        variant: "info",
                        message: "Limit Exceeded for This Venue.",
                      });
                      return;
                    }
                    if (attendeeName === "") {
                      //alert("Please Enter Attendee name");
                      setAlertInfo({
                        visible: true,
                        variant: "info",
                        message: "Please Enter Attendee name.",
                      });
                      return;
                    }
                    if (
                      attendeeList.some(found) ||
                      attendeeName === user?.username
                    ) {
                    } else {
                      let isExisting = false;
                      let id = null;
                      let userFound = null;
                      //finds username in database
                      userFound = fakeUserDb.find(
                        (x) => x.email === attendeeName
                      );

                      if (userFound !== undefined) {
                        isExisting = true;
                        id = userFound?.id;
                      } else {
                        // alert("User not found");
                        setAlertInfo({
                          visible: true,
                          variant: "info",
                          message: "User not found",
                        });
                        return;
                      }
                      const newUser = {
                        name: attendeeName,
                        existing: isExisting,
                        user_id: id,
                      };
                      setAttendeeList([...attendeeList, newUser]);
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
            </Box>
            <Box m="5px 15px 0px 15px">
              <List
                style={{ maxHeight: "200px", width: "100%", overflow: "auto" }}
                className="userList"
                dense={true}
              >
                <ListItem sx={{ p: "0px 0px 0px 20px" }}>
                  <ListItemText
                    primary={user?.username}
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
                    sx={{ p: "0px 0px 0px 20px" }}
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
                            {/* Existing User:Yes{" "} */}
                          </Typography>
                        ) : (
                          <Typography fontSize={14} color="#555555">
                            {/* Existing User:No{" "} */}
                          </Typography>
                        )
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                m: "15px",
              }}
            >
              <Button
                onClick={() => {
                  setAlertInfo({
                    visible: false,
                    variant: "info",
                    message: "",
                  });
                  setOpenModal1(true);
                  setOpenModal2(false);
                }}
                sx={ButtonStyle2}
              >
                Back
              </Button>
              <ButtonGroup>
                <div>
                  <Button
                    sx={ButtonStyle1}
                    onClick={() => {
                      if (booking.current.computers > attendeeList.length + 1) {
                        // Set the visibility state and message for the "info" alert
                        setAlertInfo({
                          visible: true,
                          variant: "info",
                          message:
                            "You can't borrow computers more than the number of attendees",
                        });
                      } else {
                        // console.log(attendeeList.length);
                        calculateCost();
                        setOpenModal3(true);
                        setOpenModal2(false);
                      }
                    }}
                  >
                    Proceed
                  </Button>
                  {alertInfo.visible && (
                    <FilledAlerts
                      variant={alertInfo.variant}
                      message={alertInfo.message}
                    />
                  )}
                </div>
              </ButtonGroup>
            </Box>
          </Box>
        </Modal>
        {/* modal3 modal 3 */}
        <Modal
          disableAutoFocus={true}
          open={openModal3}
          onClose={() => setOpenModal3(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Box sx={modalHeaderStyle}>
              <Typography
                sx={{ fontWeight: "bold" }}
                id="modal-modal-title"
                variant="h5"
                component="h2"
                fontFamily="Poppins"
                color="white"
              >
                Summary
              </Typography>
              <Button
                onClick={() => {
                  setOpenModal3(false);
                }}
                sx={{ p: 0, m: 0, color: "white" }}
              >
                <CloseIcon></CloseIcon>
              </Button>
            </Box>

            <Box p={5} paddingTop={3} paddingBottom={0}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  fontWeight="bold"
                  fontFamily="Roboto Slab"
                  fontSize={15}
                >
                  Venue:
                </Typography>
                <Typography
                  fontWeight="bold"
                  fontFamily="Roboto Slab"
                  fontSize={15}
                >
                  {booking.current.venue}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  fontWeight="bold"
                  fontSize={15}
                  fontFamily="Roboto Slab"
                >
                  Date:
                </Typography>
                <Typography
                  fontWeight="bold"
                  fontSize={15}
                  fontFamily="Roboto Slab"
                >
                  {moment(booking.current.date).format("MMMM D Y")}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  fontWeight="bold"
                  fontSize={15}
                  fontFamily="Roboto Slab"
                >
                  Start Time:
                </Typography>
                <Typography
                  fontWeight="bold"
                  fontSize={15}
                  fontFamily="Roboto Slab"
                >
                  {booking.current.startTime}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  fontWeight="bold"
                  fontSize={15}
                  fontFamily="Roboto Slab"
                >
                  End Time:
                </Typography>
                <Typography
                  fontWeight="bold"
                  fontSize={15}
                  fontFamily="Roboto Slab"
                >
                  {booking.current.endTime}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  fontWeight="bold"
                  fontSize={15}
                  fontFamily="Roboto Slab"
                >
                  Title:
                </Typography>
                <Typography
                  fontWeight="bold"
                  fontSize={15}
                  fontFamily="Roboto Slab"
                >
                  {booking.current.description}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  fontWeight="bold"
                  fontSize={15}
                  fontFamily="Roboto Slab"
                >
                  Office Name:
                </Typography>
                <Typography
                  fontWeight="bold"
                  fontSize={15}
                  fontFamily="Roboto Slab"
                >
                  {booking.current.officeName}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  fontWeight="bold"
                  fontSize={15}
                  fontFamily="Roboto Slab"
                >
                  Purpose:
                </Typography>
                <Typography
                  fontWeight="bold"
                  fontSize={15}
                  fontFamily="Roboto Slab"
                >
                  {booking.current.purpose}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  fontWeight="bold"
                  marginBottom="0px"
                  fontFamily="Roboto Slab"
                  fontSize={15}
                >
                  No. of Computers:
                </Typography>
                <Typography
                  fontWeight="bold"
                  marginBottom="0px"
                  fontFamily="Roboto Slab"
                  fontSize={15}
                >
                  {booking.current.computers}
                </Typography>
              </Box>
              <br></br>
              <Typography
                fontWeight="bold"
                marginTop="0px"
                fontFamily="Poppins"
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
                <React.Fragment>
                  <ListItem m={0}>
                    <ListItemText
                      fontSize="12px"
                      primary={user?.username}
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
            {user?.role === "user" ? (
              <Typography
                align="right"
                paddingRight="20px"
                sx={{ fontWeight: "bold", fontFamily: "Monospace" }}
              >
                Total Cost: Php {cost}{" "}
              </Typography>
            ) : (
              <div></div>
            )}

            <Box
              sx={{
                margin: "10px 10px 15px 15px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button
                onClick={() => {
                  setAlertInfo({
                    visible: false,
                    message: "",
                  });
                  setOpenModal3(false);
                  setOpenModal2(true);
                }}
                sx={ButtonStyle2}
              >
                Back
              </Button>
              {user?.role === "user" ? (
                <Box>
                  <Button
                    onClick={() => {
                      setOpenModal3(false);
                      booking.current.coins = cost;
                      submitBooking();
                      booking.current.coins = 0;
                      booking.current.points = 0;
                      setCost(0);
                      setAttendeeList([]);
                    }}
                    sx={ButtonStyle1}
                  >
                    coins
                  </Button>
                  <Button
                    onClick={() => {
                      booking.current.points = cost;
                      submitBooking();
                      booking.current.coins = 0;
                      booking.current.points = 0;
                      setCost(0);

                      setOpenModal3(false);
                      setAttendeeList([]);
                    }}
                    variant="contained"
                    margin="0px"
                    sx={{ ...ButtonStyle1, marginLeft: "20px" }}
                  >
                    points
                  </Button>
                </Box>
              ) : (
                <Button
                  onClick={() => {
                    submitBooking();
                    setOpenModal3(false);
                    booking.current = {
                      purpose: "Studying",
                      description: "",
                      startTime: "",
                      venue: "",
                      endTime: "",
                      date: "",
                      computers: 0,
                      coins: 0,
                      points: 0,
                      user_id: user?.user_id,
                      officeName: "",
                      attendees: [],
                    };
                    setAttendeeList([]);
                  }}
                  sx={ButtonStyle1}
                >
                  Book
                </Button>
              )}
            </Box>
          </Box>
        </Modal>
        <Modal
          disableAutoFocus={true}
          open={openInfoModal}
          onEn
          onClose={() => setOpenInfoModal(false)}
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
                fontFamily="Poppins"
                color="white"
              >
                Details
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
                  {info?.description}
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
                  {info?.referenceNo}
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
                  {info?.computers}
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
                  {info?.startTime}
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
                  {info?.endTime}
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
                  {booking.current.venue}
                </Typography>
              </Box>

              <br></br>
              <Typography
                fontWeight="bold"
                marginTop="0px"
                fontFamily="Poppins"
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
                {bookingAttendees.map((item, index) => (
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
              <Typography
                sx={{ paddingLeft: 2, color: "darkred" }}
                fontFamily="Poppins"
              ></Typography>
            </Box>

            {user?.role === "user" && user?.user_id === info.user ? (
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
                    const isEventToday = selectedEvent && new Date(selectedEvent.start).toDateString() === new Date().toDateString();

                    if (isEventToday) {
                      // if event is today
                      console.log("Cannot cancel booking for events happening today");
                    } else {
                      // if event is not today
                      console.log(info.cancelCost);
                      setCancelModal(true);
                      setOpenInfoModal(false);
                    }
                  }}
                  // disable button
                  disabled={selectedEvent && new Date(selectedEvent.start).toDateString() === new Date().toDateString()
                  }
                >
                  Cancel Booking
                </Button>
              </Box>
            ) : user?.role === "admin" ? (
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
                    setOpenInfoModal(false);
                  }}
                >
                  Cancel Booking
                </Button>
              </Box>
            ) : null}
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
          style={{ width: "100%", overflow: "auto" }}
        >
          <Box
            sx={{
              ...modalStyle,
              width: { lg: 500, xs: 350, sm: 500, md: 500, xl: 500 },
            }}
          >
            <Box sx={modalHeaderStyle}>
              <Typography
                sx={{ fontWeight: "bold" }}
                id="modal-modal-title"
                variant="h5"
                component="h2"
                fontFamily="Poppins"
                color="white"
              >
                Cancel Booking
              </Typography>
            </Box>
            <Box p={4}>
              {user?.role === "user" ? (
                <Box>
                  <Box
                    sx={{ display: "column", justifyContent: "space-between" }}
                  >
                    <Typography
                      fontWeight="bold"
                      marginBottom="10px"
                      fontFamily="Poppins"
                      fontSize="25px"
                    >
                      Are you sure you want to cancel?
                    </Typography>

                    <Typography
                      marginBottom="15px"
                      fontFamily="Poppins"
                      textAlign="center"
                    >
                      Cost of Cancellation: {info.cancelCost}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button
                      sx={{
                        ...ButtonStyle1,
                        paddingRight: "30px",
                        paddingLeft: "30px",
                      }}
                      variant="contained"
                      onClick={() => cancelBooking(tempId)}
                    >
                      Pay{" "}
                    </Button>
                    {/* <Button variant="contained">Pay</Button> */}
                    <Button
                      sx={{
                        ...ButtonStyle1,
                        paddingRight: "30px",
                        paddingLeft: "30px",
                      }}
                      variant="contained"
                      onClick={() => {
                        setViewModal(true);
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
                  <Button
                    variant="contained"
                    onClick={() => cancelBooking(tempId)}
                  >
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
      </div>
    );
  }
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <br></br>
      <b>description: </b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}
