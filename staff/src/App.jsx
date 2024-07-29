import { BrowserRouter as Router, Link } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import Routes from "./routes";


function App() {
  return (
    <Router>
      <CssBaseline />
      <Routes />
      <script src="https://cdn.jsdelivr.net/npm/react/umd/react.production.min.js" crossOrigin></script>
    </Router>
    
  );
}
export default App;
