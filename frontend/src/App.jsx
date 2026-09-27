import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          {/* Dashboard routes will go here once built */}
        </Routes>
      </BrowserRouter>
  );
}

export default App;