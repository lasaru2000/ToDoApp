import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom';
import './App.css';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';

function App() {

  const [auth,SetAuth] = useState("");
  useEffect(() => {
    const message = localStorage.getItem('message');
    if (message) {
      SetAuth(message);
    }
  },[])
  return (
    <Router>
      <Routes>
      <Route path='/' element={<Login/>}/>
      {auth ? (
          <Route path='/home' element={<Home />} />
        ) : (
          <Route path='/home' element={<Navigate to='/' />} />
        )}
      </Routes>
    </Router>
  );
}


export default App;
