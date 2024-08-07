import { Alert, Box, Button, Container, TextField, Typography } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { signInUser, db } from "../firebase/firebaseConfig";
import { startSession } from "../components/session";
import { doc, getDoc } from 'firebase/firestore';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Styled from 'styled-components';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUsers, login } = useContext(UserContext);

  const onSubmit = async (event) => {
    event.preventDefault();
    // validate the inputs
    if (!email || !password) {
      setError("Por favor ingresa email y password");
      return;
    }
    // clear the errors
    setError("");
    // TODO: send the login request    
    try {
      let loginResponse = await signInUser(email, password);
      let id = loginResponse.user.uid;
      startSession(loginResponse.user);
      try {
        const docum = await getDoc(doc(db, 'usuarios', id));
        if (docum.exists) {
          setUsers(docum.data())
          login(docum.data())
        }
      } catch (error) {
        console.log('Error de usuario', error)
      }
      const lastPath = localStorage.getItem('lastPath') || '/home'
      navigate(lastPath);
    } catch (error) {
      console.log(error.message)
      if (error.code === 'auth/wrong-password') {
        setError('Usuario o Contraseña incorrecta');
        return;
      } else if (error.code === 'auth/user-not-found') {
        setError('No existe esta cuenta de usuario');
        return;
      }else if(error.code === 'auth/invalid-login-credentials'){
        setError('Usuario o Contraseñas incorrectos');
        return;
      }else if(error.code === 'auth/invalid-email'){
        setError('Tipo de email Incorrecto');
        return;
      }
    }
  }

  return (
    <SuperContainer>
      <Container maxWidth="xs" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Card>
          <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} sx={{ mt: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
            <img
              height={150}         
              src="../../logo.png" alt="imagen" 
              style={{width:'50%',height:'25%',marginLeft:'70px'}}
              />
          </Grid>
          </Grid>
          <CardContent>
            <Typography variant="h5" component="h1" gutterBottom textAlign="center">
            </Typography>
            {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
            <Box component="form" onSubmit={onSubmit}>
              <TextField
                label="Email"
                variant="outlined"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mt: 1 }}
                fullWidth
              />
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mt: 3 }}
                fullWidth
              />
              <Grid style={{ display: 'flex', alignItems: 'center' }} container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h8" gutterBottom textAlign="center" >
                    <Link to='/recover'
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}
                      sx={{ mt: 3 }}
                      underline="none"
                    >
                      Olvide mi Password!
                    </Link>
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Button variant="contained" type="submit" sx={{ mt: 3 }} fullWidth>Inicio</Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </SuperContainer>
  )
}

const SuperContainer = Styled.div`
    background-image: url('./fondoLogin.jpg');
    background-image: no-repeat;
    background-image: fixed;
    background-image: center;
    background-size: cover;
`