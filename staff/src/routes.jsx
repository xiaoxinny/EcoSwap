import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Support/Dashboard';
import FAQ from './pages/Support/FAQ/FAQs';
import Base from './pages/Base';
import AddFAQ from './pages/Support/FAQ/AddFAQ';
import EditFAQ from './pages/Support/FAQ/EditFAQ';

const UserRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Base />}>
                <Route index path="/" element={<Dashboard />} />
                <Route path="/FAQ" element={<FAQ />} />
                <Route path="/add-faq" element={<AddFAQ />} />
                <Route path="/edit-faq/:id" element={<EditFAQ />} />
            </Route>
        </Routes>
    )
}

export default UserRoutes;