import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import FAQ from './pages/FAQs';
import Base from './pages/Base';
import AddFAQs from './pages/AddFAQ';
import EditFAQs from './pages/EditFAQ';

const UserRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Base />}>
                <Route index path="/" element={<Home />} />
                <Route path="/FAQ" element={<FAQ />} />
                <Route path="/add-faq" element={<AddFAQs />} />
                <Route path="/edit-faq/:id" element={<EditFAQs />} />
            </Route>
        </Routes>
    )
}

export default UserRoutes;