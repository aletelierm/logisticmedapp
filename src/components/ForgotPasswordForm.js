import {Alert,  Button, Container,  TextField, Typography} from "@mui/material";
import React, { useState } from 'react';
import { recovery } from '../firebase/firebaseConfig';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Link } from "react-router-dom";
import Grid from '@mui/material/Grid';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      await recovery(email);
      setEmail("");
      setIsSubmitting(false);
    } catch (error) {
      console.log(error.message);
      setErrorMessage(error.message);
      setIsSubmitting(false);
    }
  };

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
      <form onSubmit={handleSubmit}>
        <Typography variant="h5" component="h1" gutterBottom textAlign="center">
          Restablecer Contraseña
        </Typography>

        {errorMessage && (
          <Alert severity="error" sx={{ my: 2 }}>
            {errorMessage}
          </Alert>
        )}
        <TextField
          label="Email"
          variant="outlined"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          sx={{ mt: 1 }}
          fullWidth
            />
            <p>
            Recuerda ingresar el correo electrónico con el cual fue creado el usuario en la cuenta de tu organización.
            </p>
            <Grid style={{ display: 'flex', alignItems: 'center' }} container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="h8" gutterBottom textAlign="center" >
                  <Link
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}
                    sx={{ mt: 3 }}
                    to="/Login"
                    underline="none"
                  >
                    Regresar al Login
                  </Link>              
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Button
                  variant="contained"
                  type="submit"
                  sx={{ mt: 3 }}
                  disabled={isSubmitting}
                >
                  Restablecer
                </Button>
              </Grid>
            </Grid>
        {isSubmitting ? "Enviando correo electrónico..." : ""}
      </form>
      </CardContent>
      </Card>
    </Container>
  );
};

export default ForgotPasswordForm;
