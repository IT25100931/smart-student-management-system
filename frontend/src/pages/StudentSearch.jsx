import { useState } from 'react';

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

    return (
        <div className="student-search">
            <h1>Search Student Records</h1>

            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter student name..."
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {error && <p className="error">{error}</p>}

            {searched && !loading && !error && students.length === 0 && (
                <p className="empty">No students found.</p>
            )}

            {students.length > 0 && (
                <table>
                    <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Contact No</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {students.map((s) => (
                        <tr key={s.studentId}>
                            <td>{s.firstName}</td>
                            <td>{s.lastName}</td>
                            <td>{s.email}</td>
                            <td>{s.contactNo}</td>
                            <td>{s.status}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default StudentSearch;
