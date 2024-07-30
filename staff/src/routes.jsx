import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Support/Dashboard';
import FAQ from './pages/Support/FAQ/FAQs';
import Base from './pages/Base';
import AddFAQ from './pages/Support/FAQ/AddFAQ';
import EditFAQ from './pages/Support/FAQ/EditFAQ';
import Violations from './pages/Support/Violations/Violations';
import Appeals from './pages/Support/Appeals/Appeals';
import Chats from './pages/Support/LiveChat/Chats';
import Accounts from './pages/Support/Accounts/Accounts';

const StaffRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Base />}>
                <Route index path="/dashboard" element={<Dashboard />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/add-faq" element={<AddFAQ />} />
                <Route path="/edit-faq/:id" element={<EditFAQ />} />
                <Route path="/violations" element={<Violations />} />
                <Route path="/appeals" element={<Appeals />} />
                <Route path="/live-support" element={<Chats />} />
                <Route path="/accounts" element={<Accounts />} />
            </Route>
        </Routes>
    )
}

export default StaffRoutes;