import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IndexPage from './pages/IndexPage';
import HomePage from './pages/Homepage';
import CreatePoolPage from './pages/CreatePoolPage';
import TransactionStatusPage from './pages/TransactionStatusPage';

const AppRoutes = () => (
    <Router>
        <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/create-pool" element={<CreatePoolPage />} />
            <Route path="/transaction-status" element={<TransactionStatusPage />} />
        </Routes>
    </Router>
);

export default AppRoutes;
