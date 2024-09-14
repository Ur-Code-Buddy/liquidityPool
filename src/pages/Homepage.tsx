import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <h2 className="text-4xl font-bold text-blue-600 mb-8">Home</h2>
            <ul className="space-y-4">
                <li>
                    <Link 
                        to="/create-pool" 
                        className="text-lg font-semibold text-blue-500 hover:text-blue-700 transition"
                    >
                        Create Pool
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/transaction-status" 
                        className="text-lg font-semibold text-blue-500 hover:text-blue-700 transition"
                    >
                        Transaction Status
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default HomePage;
