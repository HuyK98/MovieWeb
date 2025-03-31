import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import AddMovies from "./admin/movies/AddMovies";
import MovieList from "./admin/movies/MovieList";
import AdminDashboard from './admin/AdminDashboard';
import ScheduleList from './admin/ScheduleList';
import UserList from './admin/UserList';
import Revenue from './admin//Revenue';
import Login from "./login/Login";
import MovieDetail from './pages/MovieDetail';
import PaymentInfo from './pages/PaymentInfo';
import ListMovie from "./pages/ListMovie";
import PriceList from "./pages/PriceList";
import NewsAndOffers from "./pages/NewsAndOffers";
import CinemaIntro from "./pages/CinemaIntro";
import Showtimes from "./pages/Showtime";
import Chat from "./admin/Chat";
import ChatButton from "./components/ChatButton";
import Chatbot from "./components/Chatbot";
import ManageGenres from "./admin/ManageGenres";
import FilmDetail from "./pages/FilmDetail";
import BookingDetail from "./pages/BookingDetail";
import BillsManage from "./admin/BillsManage";

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
        <Route path="/admin/revenue" element={<Revenue />} />
        <Route path="/movie-detail" element={<MovieDetail />} />
        <Route path="/payment" element={<PaymentInfo />} />
        <Route path="/movielist" element={<ListMovie />} />
        <Route path="/place" element={<CinemaIntro />} />
        <Route path="/about" element={<PriceList />} />
        <Route path="/news" element={<NewsAndOffers />} />
        <Route path="/showtimes" element={<Showtimes />} />
        <Route path="/admin/chat" element={<Chat />} />
        <Route path="/chat" element={<ChatButton />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/admin/genres" element={<ManageGenres />} />
        <Route path="/movie/:movieId" element={<FilmDetail />} />
        <Route path="/booking/:bookingId" element={<BookingDetail />} />
        <Route path="/admin/bills" element={<BillsManage />} />
      </Routes>
    </>
  );
};

export default App;