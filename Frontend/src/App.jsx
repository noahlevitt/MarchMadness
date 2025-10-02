import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import MyBets from './Pages/MyBets/MyBets';
import PlaceBet from './Pages/PlaceBet/PlaceBet';
import Profile from './Pages/Profile/Profile';
import UserSessionProvider from './contexts/UserSessionContext';
import { GamesProvider } from './contexts/GetGamesContext';
import { TeamsProvider } from './contexts/GetTeamsContext';
import Navbar from './components/Navbar/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <TeamsProvider>
      <GamesProvider>
        <UserSessionProvider>
          <Router> {/* Provides routing context */}

            <Navbar />
            
            <div style={{ marginTop: '8vh' }}>
              <Routes> {/* Container that matches routes */}

                {/* Default path directs user to home page */}
                <Route path="/" element={<Home />} />

                {/* Login Page */}
                <Route path="/login" element={<Login/>} />
                {/* TODO: Profile page */}
                <Route path="/profile" element={<Profile/>} />
                {/* MyBets Page */}
                <Route path="/myBets" element={<MyBets/>} />
                {/* PlaceBet Page */}
                <Route path="/placeBet" element={<PlaceBet />} />

                {/* Any undefined paths redirect to Home */}
                <Route path="*" element={<Home/>} />
              </Routes>
            </div>

          </Router>
        </UserSessionProvider>
      </GamesProvider>
    </TeamsProvider>
  );
};

export default App;
