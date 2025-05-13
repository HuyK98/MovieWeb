import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import HeaderAdmin from "./admin/admin_layout/HeaderAdmin";
import AddMovies from "./admin/movies/AddMovies";
import MovieList from "./admin/movies/MovieList";
import AdminDashboard from "./admin/AdminDashboard";
import ScheduleList from "./admin/ScheduleList";
import UserList from "./admin/UserList";
import Revenue from "./admin//Revenue";
import BookingDetailAdmin from "./admin/BookingDetailAdmin";
import Login from "./login/Login";
import MovieDetail from "./pages/MovieDetail";
import PaymentInfo from "./pages/PaymentInfo";
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
import { LanguageProvider } from "./pages/LanguageContext";
import Account from "./pages/Account";
import Points from "./pages/Points";
import Vouchers from "./pages/Vouchers";
import MemberCard from "./pages/MemberCard"; // Import trang thẻ thành viên
import MovieJourney from "./pages/MovieJourney";
import { WebSocketProvider } from "./services/WebSocketContext";
import API_URL from "./api/config";
import AdminProvider from "./services/AdminContext"; // Import AdminProvider

const App = () => {
  return (
    <WebSocketProvider>
      <LanguageProvider>
        {/* giao diện cho user */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/movie-detail" element={<MovieDetail />} />
          <Route path="/payment" element={<PaymentInfo />} />
          <Route path="/movielist" element={<ListMovie />} />
          <Route path="/place" element={<CinemaIntro />} />
          <Route path="/about" element={<PriceList />} />
          <Route path="/news" element={<NewsAndOffers />} />
          <Route path="/showtimes" element={<Showtimes />} />
          <Route path="/chat" element={<ChatButton />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/movie/:movieId" element={<FilmDetail />} />
          <Route path="/booking/:bookingId" element={<BookingDetail />} />
          <Route path="/account" element={<Account />} />
          <Route path="/points" element={<Points />} />
          <Route path="/vouchers" element={<Vouchers />} />
          <Route path="/movie-journey" element={<MovieJourney />} />
          <Route path="/member-card" element={<MemberCard />} />{" "}
          {/* Thêm route này */}
        </Routes>

        {/* giao diện cho admin */}
        <AdminProvider API_URL={API_URL}>
          {/* <HeaderAdmin API_URL={API_URL}/> */}
          <Routes>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/movies" element={<MovieList />} />
            <Route path="/admin/add-movie" element={<AddMovies />} />
            <Route path="/admin/schedules" element={<ScheduleList />} />
            <Route path="/admin/users" element={<UserList />} />
            <Route path="/admin/revenue" element={<Revenue />} />
            <Route path="/admin/booking-detail/:bookingId" element={<BookingDetailAdmin />} />
            <Route path="/admin/chat" element={<Chat />} />
            <Route path="/admin/bills" element={<BillsManage />} />
            <Route path="/admin/genres" element={<ManageGenres />} />
          </Routes>
        </AdminProvider>
      </LanguageProvider>
    </WebSocketProvider>
  );
};

export default App;
