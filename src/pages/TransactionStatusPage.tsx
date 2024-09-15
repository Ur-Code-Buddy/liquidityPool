const TransactionStatusPage = () => {
    return (
        <div className="transaction-status-page flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-900 to-black text-white">
            <div className="max-w-xl text-center">
                <h2 className="text-4xl font-bold mb-4">Transaction Status</h2>
                <p className="text-lg mb-8">
                    This feature is currently under development. Soon, you’ll be able to check the status of your transactions with ease.
                </p>
                <p className="text-md text-gray-400">
                    Stay tuned for updates, or explore other features while we work on delivering a seamless experience.
                </p>
                <div className="mt-10">
                    <button
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-105"
                        onClick={() => window.history.back()}
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionStatusPage;
