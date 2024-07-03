import { BrowserRouter as Router, Link } from "react-router-dom";
import Routes from "./routes";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Routes />
      <script src="https://cdn.jsdelivr.net/npm/react/umd/react.production.min.js" crossOrigin></script>

      <script
        src="https://cdn.jsdelivr.net/npm/react-dom/umd/react-dom.production.min.js"
        crossOrigin>
      </script>

      <script
        src="https://cdn.jsdelivr.net/npm/react-bootstrap@next/dist/react-bootstrap.min.js"
        crossOrigin>
      </script>

      <script>var Alert = ReactBootstrap.Alert;</script>
    </Router>
    
  );
}
export default App;
