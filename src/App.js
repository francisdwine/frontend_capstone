import './App.css';
import {
  BrowserRouter, Routes,
  Route, Redirect, Link,
} from 'react-router-dom';

import Calendar from './pages/calendar_page';
import Dashboard from './pages/dashboard';
import MyReservations from './pages/my_reservations';
import AttendanceLogs from './pages/attendance_logs';
import DashBoardTemplate from './pages/containers/dashboard_template';

function App() {
  return (
    <div className="App">
      <BrowserRouter> 
      <Routes> 
        {/* <Route exact path="/" element={<Home />}/>  */}
        <Route exact path="/dashboard" element={<Dashboard/>}/>
        <Route exact path="/calendar" element={<Calendar/>}/>
        <Route exact path="/bookings" element={<MyReservations/>}/> 
        <Route exact path="/logs" element={<AttendanceLogs/>}/> 
      </Routes> 
      </BrowserRouter> 
      {/* <Calendar/> */}
      {/* <AttendanceLogs /> */}
      {/* <MyReservations/> */}
    </div>
  );
}

export default App;
