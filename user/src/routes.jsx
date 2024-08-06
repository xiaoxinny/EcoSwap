import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Listings from './pages/Listings';
import Events from './pages/Events';
import Support from './pages/Support/Support';
import Base from './pages/Base';
import Chat from './pages/Support/Chat';
import SetPassword from './pages/Accounts/SetPassword';
import Register from './pages/Accounts/Register';
import Login from './pages/Accounts/Login';
import AccountInfo from './pages/Accounts/AccountInfo';
import UserEdit from './pages/Accounts/UserEdit';
import SetUsername from './pages/Accounts/SetUsername';
import Password from './pages/Accounts/ChangePassword';

const UserRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Base />}>
            {/*Support*/}
                <Route index path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/listings" element={<Listings />} />
                <Route path="/events" element={<Events />} />
                <Route path="/support" element={<Support />} />
                <Route path="/support/livechat" element={<Chat />} />
            
            {/*Accounts*/}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/account" element={<AccountInfo />} />
                <Route path="/user-edit" element={<UserEdit />} />
                <Route path="/set-username" element={<SetUsername />} />
                <Route path="/change-password" element={<Password />} />
                <Route path="/set-password" element={<SetPassword />} />
            </Route>
        </Routes>
    )
}

export default UserRoutes;