import { Alert, Box, Button, Container, Link, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signInUser } from "../firebase/firebaseConfig";
import { startSession } from "../components/session";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import Grid from '@mui/material/Grid';


export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    console.log("Logging in...");
    try {
      let loginResponse = await signInUser(email, password);
      startSession(loginResponse.user);
      navigate("/home/misequipos");      
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    }
  }

  return (






    <Container maxWidth="xs" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Card>

      <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} sx={{ mt: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <img
              height={50}
              
              src="logo2.png" alt="imagen" />
          </Grid>
        </Grid>



        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom textAlign="center">
            Login
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
                  <Link
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}
                    sx={{ mt: 3 }}
                    href="/recover"
                    underline="none"
                  >
                    Olvide mi Password!
                  </Link>
              
                </Typography>
              </Grid>

              <Grid item xs={6}>
              <Button variant="contained" type="submit" sx={{ mt: 3 }} fullWidth>Login</Button>
              </Grid>
            </Grid>






            
            
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}
