import "./index.css";
import Routes from "./components/Routes";
import {BrowserRouter} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

function App() {
 return ( 
  <BrowserRouter>  
  <ToastContainer />
  <Routes />
  </BrowserRouter>

 )
}

export default App;
