import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LanguageProvider } from './pages/LanguageContext'; 
import Home from "./pages/Home";
import AddMovies from "./admin/movies/AddMovies";
import MovieList from "./admin/movies/MovieList";
import AdminDashboard from './admin/AdminDashboard';
import ScheduleList from './admin/ScheduleList';
import UserList from './admin/UserList';
import Revenue from './admin/Revenue';
import Login from "./login/Login";
import Account from "./pages/Account";
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
import Points from "./pages/Points"
import Vouchers from "./pages/Vouchers";
import MemberCard from "./pages/MemberCard"; // Import trang thẻ thành viên

import MovieJourney from "./pages/MovieJourney";

const App = () => {
  return (
    <LanguageProvider>
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
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
          <Route path="/points" element={<Points />} />
          <Route path="/vouchers" element={<Vouchers />} />
          <Route path="/movie-journey" element={<MovieJourney />} />
          <Route path="/member-card" element={<MemberCard />} /> {/* Thêm route này */}
          

        </Routes>
      
    </LanguageProvider>
  );
};

export default App;
