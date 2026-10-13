import { useNavigate } from 'react-router-dom';

function ServicesHome() {
    const navigate = useNavigate();

    return (
        <div className="home-page">
            <h1>Smart Student Management System</h1>
            <p>Select a service to continue</p>

            <div className="home-buttons">
                <button
                    className="feature-button"
                    onClick={() => navigate('/student-management')}
                >
                    Student Management
                </button>

                <button
                    className="feature-button"
                    onClick={() => navigate('/payments')}
                >
                    Payment Management
                </button>

                <button
                    className="feature-button"
                    onClick={() => navigate('/leave-management')}
                >
                    Leave Management
                </button>

                <button
                    className="feature-button"
                    onClick={() => navigate('/staff')}
                >
                    Staff Management
                </button>
            </div>
        </div>
    );
}

export default ServicesHome;