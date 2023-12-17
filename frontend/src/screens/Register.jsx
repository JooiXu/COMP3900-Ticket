import React, { useContext } from "react";

import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { useUser } from "../context/UserContext";
import NavBar from "../components/NavBar";
import './Register.css'

function Register() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    
    const { setUser } = useUser();

    const history = useHistory()
    const signUp =  async () => {
        
        const response = await fetch('/api/user/signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password})
        })

        const resp = await response.json()

        if (response.status === 200) {
            localStorage.setItem('user', JSON.stringify(resp))
            setUser(JSON.stringify(resp))
            history.push('/home')
        } else {
            alert(resp.error)
        }
    }
    
    return (
       <>
       <div style={{ background:"#F5F6F6", height: '100vh'}}>
       <NavBar/>
        <Container maxWidth="xs" className="login_form">
            <div style={{ margin: 'auto', width: '70%', height: '30vw', position: 'absolute', top: '50%', left:'15%',  
            transform: 'translate(0, -50%)', border: '1px solid #000000', borderRadius:'10px', padding: '1%', display:'flex',
            flexDirection:'column', fontFamily:'Poppins'}}>
            <Typography variant="h3" style={{ fontFamily:'Poppins'}}>Register</Typography>
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                type="text"
                placeholder= "Enter Email address"
                onChange={(e) => setEmail(e.target.value)}
                value={email} >
            </TextField><br></br>
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="password"
                type="password"
                placeholder= "Enter Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password} >
            </TextField><br></br>
            <Button
             style={{ fontFamily:'Poppins', fontWeight:'bold', color:'white', background:"#3481EF" }}
            variant="contained"
            color="primary"
            onClick={signUp}>Register
            </Button>

            <a style={{ marginTop:'2%', fontWeight:'bold' }} href = "/login"> Click here to login</a>

            </div>
            {/* <pre hidden> { JSON.stringify(user, null, 2) } </pre> */}
        </Container>
        </div>
       </>
    );
}

export default Register;