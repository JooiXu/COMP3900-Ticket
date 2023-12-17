import React, { useContext } from "react";

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.css';


import { UserContextProvider, useUser } from "../context/UserContext";
import { useHistory } from 'react-router-dom';

//Navigation bar which will give access to all relevant pages

function NavBar() {
    const { user, setUser } = useUser()

    const history = useHistory()
    
    const logIn = () => {
        history.push('/login');
    }

    const logOut = () => {
        localStorage.removeItem('user')
        setUser(null)
        history.push('/')
    }

    return (
    
        <Navbar>
            <Container style={{ color:'#444279', width:"50%", position:"absolute", marginLeft:"10%", paddingTop:"3%"}}>
                <Navbar.Brand onClick={() => {history.push('/home')}} style= {{ padding: '1%', backgroundColor: '#F7DF1E', cursor:'pointer' }}>LB</Navbar.Brand>
                <div>
                    { user && <Nav.Link onClick={() => {history.push('/profile')}}>Profile</Nav.Link> }
                </div>
                <div>
                    { user && <Nav.Link onClick={() => {history.push('/event')}}>Create an event</Nav.Link> }
                </div>
                <div>
                    { user ?  (<Nav.Link onClick={logOut}>  Logout</Nav.Link>) : (<Nav.Link onClick={logIn}>Login/Register</Nav.Link>)}
                </div>
            </Container>
        </Navbar>
    );
}

export default NavBar;