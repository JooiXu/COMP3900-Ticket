import './App.css';
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from './screens/Home';
import Register from './screens/Register';
import CreateEvent from './screens/Events';
import Profile from './screens/Profile';
import Login from './screens/Login';
import EventDetails from './screens/EventDetails';
import Booking from './screens/Booking';
import { PaymentDetails } from './screens/PaymentDetails';

import { UserContextProvider } from './context/UserContext';

function App() {

  const user = localStorage.getItem('user');
  
  return (
      <UserContextProvider usr={user}>
        <div className="App">
          <BrowserRouter>
            <Switch>
              <Route exact path="/">
                <Home/>
              </Route>

              <Route path="/home">
                <Home/>
              </Route>

              <Route path="/register">
                <Register/>
              </Route>

              <Route path="/login">
                <Login/>
              </Route>

              <Route exact path="/event">
                <CreateEvent />
              </Route>

              <Route path="/event/:id">
                <EventDetails />
              </Route>

              <Route path="/profile">
               <Profile />
              </Route>

              <Route exact path="/payment">
                <PaymentDetails/>
              </Route>

              <Route path="/booking/:id">
               <Booking />
              </Route>

            </Switch>
          </BrowserRouter>
        </div>
      </UserContextProvider>
  );
}

export default App;
