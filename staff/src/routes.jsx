import { Routes, Route } from 'react-router-dom';

// Support imports
import Dashboard from './pages/Support/Dashboard';
import FAQ from './pages/Support/FAQ/FAQs';
import Base from './pages/Base';
import AddFAQ from './pages/Support/FAQ/AddFAQ';
import EditFAQ from './pages/Support/FAQ/EditFAQ';
import Violations from './pages/Support/Violations/Violations';
import Appeals from './pages/Support/Appeals/Appeals';
import Chats from './pages/Support/LiveChat/Chats';
import Accounts from './pages/Support/Accounts/Accounts';
import IndvChat from './pages/Support/LiveChat/IndvChat';

// Accounts imports
import EditUser from './pages/Accounts/EditUser';
import StaffEdit from './pages/Accounts/StaffEdit';
import Staff from './pages/Accounts/Staff';
import Users from './pages/Accounts/Users';
import StaffInfo from './pages/Accounts/StaffProfile'; 
import StaffLogin from './pages/Accounts/StaffLogin';

const StaffRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Base />}>
            {/* Support */}
                <Route index path="/dashboard" element={<Dashboard />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/add-faq" element={<AddFAQ />} />
                <Route path="/edit-faq/:id" element={<EditFAQ />} />
                <Route path="/violations" element={<Violations />} />
                <Route path="/appeals" element={<Appeals />} />
                <Route path="/live-support" element={<Chats />} />
                <Route path="/live-support/:room" element={<IndvChat />} />
                <Route path="/accounts" element={<Accounts />} />

            {/* Accounts */}
                <Route path="/edit-user/:id" element={<EditUser />} />
                <Route path="/staff" element={<Staff />} />
                <Route path="/users" element={<Users />} />
                <Route path="/staff-login" element={<StaffLogin />} />
                <Route path="/staff-info" element={<StaffInfo />} />
                <Route path="/staff-edit" element={<StaffEdit />} />
            </Route>
        </Routes>
    )
}

export default StaffRoutes;