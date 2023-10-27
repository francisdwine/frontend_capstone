import './App.css';
import {
  BrowserRouter, Routes,
  Route, Redirect, Link,
} from 'react-router-dom';

import Tracker from './pages/dashboard';
import Calendar from './pages/calendar_page';
import MyReservations from './pages/my_reservations';
import AttendanceLogs from './pages/attendance_logs';
import Attendance from './pages/attendance';
import Home from './pages/home';

function App() {
  return (
    <div className="App">
      <BrowserRouter> 
      <Routes> 
        <Route exact path="/" element={<Home />}/> 
        <Route exact path="/tracker" element={<Tracker/>}/>
        <Route exact path="/calendar" element={<Calendar/>}/>
        <Route exact path="/logs" element={<AttendanceLogs/>}/>
        <Route exact path="/bookings" element={<MyReservations/>}/>  
        <Route exact path="/attendance" element={<Attendance/>}/>
      </Routes> 
      </BrowserRouter> 
    </div>
  );
}

export default App;
