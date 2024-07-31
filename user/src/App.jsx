import { BrowserRouter as Router, Link } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import Routes from "./routes";


function App() {
  return (
    <Router>
      <CssBaseline />
      <Routes />
    </Router>
    
  );
}
export default App;
