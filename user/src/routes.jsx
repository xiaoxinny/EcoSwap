import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Listings from './pages/Listings';
import Events from './pages/Events';
import Support from './pages/Support';
import Base from './pages/Base';

const UserRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Base />}>
                <Route index path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/listings" element={<Listings />} />
                <Route path="/events" element={<Events />} />
                <Route path="/support" element={<Support />} />
            </Route>
        </Routes>
    )
}

export default UserRoutes;