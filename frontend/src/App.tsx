import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { extendTheme,ChakraProvider } from '@chakra-ui/react';
import Home from './pages/MainPage';
import '@fontsource/krona-one';


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
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;