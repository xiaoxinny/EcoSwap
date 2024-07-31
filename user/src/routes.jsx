import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Listings from './pages/Listings';
import Events from './pages/Events';
import Support from './pages/Support/Support';
import Base from './pages/Base';
import Chat from './pages/Support/Chat';

const UserRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Base />}>
                <Route index path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/listings" element={<Listings />} />
                <Route path="/events" element={<Events />} />
                <Route path="/support" element={<Support />} />
                <Route path="/support/livechat" element={<Chat />} />
                <Route path={"/tutorials"} element={<Tutorials />} />
                <Route path={"/addtutorial"} element={<AddTutorial />} />
                <Route path={"/edittutorial/:id"} element={<EditTutorial />} />
                <Route path={"/form"} element={<MyForm />} />
                <Route path={"/ecopoints"} element={<Rewards />} />
                <Route path={"/tutorialdetails/:id"} element={<TutorialDetails />} />
            </Route>
        </Routes>
    )
}

export default UserRoutes;