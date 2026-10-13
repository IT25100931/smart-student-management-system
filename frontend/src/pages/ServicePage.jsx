import { useNavigate } from 'react-router-dom';

function ServicePage({ children, backTo = '/services', backLabel = 'Back to Services' }) {
    const navigate = useNavigate();

    return (
        <div className="service-page-wrapper">
            <button
                className="back-button"
                onClick={() => navigate(backTo)}
                style={{ margin: '10px', padding: '8px 16px', cursor: 'pointer' }}
            >
                &larr; {backLabel}
            </button>
            {children}
        </div>
    );
}

export default ServicePage;