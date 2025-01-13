import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { extendTheme,ChakraProvider } from '@chakra-ui/react';
import Home from './pages/MainPage';
import '@fontsource/krona-one';
import Login from './pages/LoginPage';
import CreateAccount from './pages/CreateAccountPage';
import PlanetProject from './pages/PlanetProjectPage';
import AddPlanet from './pages/AddPlanetPage';


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
  );
}

export default App;