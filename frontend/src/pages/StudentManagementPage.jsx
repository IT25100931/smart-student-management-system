import { useNavigate } from 'react-router-dom';
import { getUser } from '../utils/authFetch';

function StudentManagementPage() {
    const navigate = useNavigate();
    const role = getUser()?.role;

    return (
        <div className="home-page">
            <h1>Student Management</h1>
            <p>Select an option to continue</p>

            <div className="home-buttons">
                {role === 'ADMIN' && (
                    <>
                        <button
                            className="feature-button"
                            onClick={() => navigate('/register-student')}
                        >
                            Student Registration
                        </button>
                        <button
                            className="feature-button"
                            onClick={() => navigate('/edit-student')}
                        >
                            Edit Student Details
                        </button>
                    </>
                )}
                <button
                    className="feature-button"
                    onClick={() => navigate('/search-student')}
                >
                    Search Students
                </button>
            </div>
        </div>
    );
}

export default StudentManagementPage;