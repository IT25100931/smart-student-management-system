import { useState } from 'react';
import './StudentSearch.css';

function getInitials(student) {
    const first = (student.firstName || '').trim().charAt(0);
    const last = (student.lastName || '').trim().charAt(0);

    return (first + last).toUpperCase() || '?';
}

function getStatusClass(status) {
    const value = String(status || '').toLowerCase();

    if (value === 'active') return 'status-active';
    if (value) return 'status-other';

    return 'status-unknown';
}

function StudentSearch() {
    const [query, setQuery] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSearched(true);

        try {
            const response = await fetch(
                `http://localhost:8081/api/students/search?name=${encodeURIComponent(query)}`
            );

            if (!response.ok) {
                setError('Search failed. Please try again.');
                setStudents([]);
                return;
            }

            const data = await response.json();
            setStudents(data);
        } catch {
            setError('Could not reach the server. Is the backend running?');
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setQuery('');
        setStudents([]);
        setError(null);
        setSearched(false);
    };

    return (
        <div className="student-search-page">
            <header className="student-search-header">
                <p className="student-search-eyebrow">ACADEMIC STAFF SERVICES</p>
                <h1>Search Student Records</h1>
                <p>Look up students by name to view their contact details and status.</p>
            </header>

            <section className="student-search-panel">
                <form onSubmit={handleSearch} className="student-search-form">
                    <div className="student-search-input">
                        <span aria-hidden="true">⌕</span>

                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Enter student name..."
                            aria-label="Student name"
                        />
                    </div>

                    <button
                        type="submit"
                        className="student-search-submit"
                        disabled={loading}
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>

                    {(query || searched) && (
                        <button
                            type="button"
                            className="student-search-clear"
                            onClick={handleClear}
                        >
                            Clear
                        </button>
                    )}
                </form>
            </section>

            {error && (
                <div className="student-search-message is-error" role="alert">
                    {error}
                </div>
            )}

            {searched && !loading && !error && students.length === 0 && (
                <div className="student-search-empty">
                    <span aria-hidden="true">⌕</span>
                    <strong>No students found</strong>
                    <p>Try a different name or check the spelling.</p>
                </div>
            )}

            {students.length > 0 && (
                <section className="student-search-results">
                    <div className="student-search-results-heading">
                        <div>
                            <h2>Results</h2>
                            <p>Students matching your search.</p>
                        </div>

                        <span className="student-search-count">
                            {students.length} {students.length === 1 ? 'student' : 'students'}
                        </span>
                    </div>

                    <div className="student-search-table-wrapper">
                        <table className="student-search-table">
                            <thead>
                            <tr>
                                <th>Student</th>
                                <th>Email</th>
                                <th>Contact No</th>
                                <th>Status</th>
                            </tr>
                            </thead>

                            <tbody>
                            {students.map((s) => (
                                <tr key={s.studentId}>
                                    <td>
                                        <div className="student-search-person">
                                            <span className="student-search-avatar">
                                                {getInitials(s)}
                                            </span>

                                            <div>
                                                <strong>
                                                    {s.firstName} {s.lastName}
                                                </strong>
                                                <small>ID: {s.studentId}</small>
                                            </div>
                                        </div>
                                    </td>

                                    <td>{s.email || '—'}</td>
                                    <td>{s.contactNo || '—'}</td>

                                    <td>
                                        <span
                                            className={`student-search-status ${getStatusClass(s.status)}`}
                                        >
                                            <span />
                                            {s.status || 'Unknown'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </div>
    );
}

export default StudentSearch;
