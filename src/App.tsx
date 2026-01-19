import './App.css';
import { RouterProvider } from 'react-router';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import router from './routes';
import { CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';

const theme = createTheme({});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
