import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import AddMovies from "./admin/movies/AddMovies";
import MovieList from "./admin/movies/MovieList";
import AdminDashboard from './admin/AdminDashboard';
import ScheduleList from './admin/ScheduleList';
import Login from "./login/Login";
import MovieDetail from './pages/MovieDetail';
import PaymentInfo from './pages/PaymentInfo';
import UserList from './admin/UserList';



const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/movies" element={<MovieList />} />
        <Route path="/admin/add-movie" element={<AddMovies />} />
        <Route path="/admin/schedules" element={<ScheduleList />} />
        <Route path="/admin/users" element={<UserList />} />
        <Route path="/movie-detail" element={<MovieDetail />} />
        <Route path="/payment" element={<PaymentInfo />} />

      </Routes>
    </>
  );
};

export default App;
