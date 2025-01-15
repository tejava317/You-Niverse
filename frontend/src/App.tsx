//App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { extendTheme,ChakraProvider } from '@chakra-ui/react';
import Home from './pages/MainPage';
import '@fontsource/krona-one';
import Login from './pages/LoginPage';
import CreateAccount from './pages/CreateAccountPage';
import PlanetProject from './pages/PlanetProjectPage';
import AddPlanet from './pages/AddPlanetPage';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ErrorBoundary from './components/ErrorBoundary';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
//console.log("Client ID is:", clientId); // Check if this prints in console

if (!clientId) {
  console.error("No client ID found!");
}


const theme = extendTheme({
  styles: {
    global: {
      body: {
        margin: 0,
        padding: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'black', // Matches your design
      },
      html: {
        width: '100%',
        height: '100%',
      },
    },
  },
  fonts: {
    heading: `'Krona One', sans-serif`, // Font for headings
    body: `'Krona One', sans-serif`,   // Font for body text
  },
});



function App() {
  return (
    <ErrorBoundary>
    <GoogleOAuthProvider clientId={clientId}>
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/MainPage" element={<Home />} />
          <Route path="/CreateAccountPage" element={<CreateAccount />} />
          <Route path="/LoginPage" element={<Login />} />
          <Route path="/PlanetProjectPage" element={< PlanetProject/>} />
          <Route path="/AddPlanetPage" element={<AddPlanet />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </ChakraProvider>
    </GoogleOAuthProvider>
    </ErrorBoundary>
  );
}
//console.log("Google Client ID:", clientId);

export default App;