import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Register from './Register';
import PeopleList from './PeopleList';

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '20px', backgroundColor: '#f4f4f4', marginBottom: '20px' }}>
        <Link to="/" style={{ marginRight: '20px', fontWeight: 'bold' }}>Kayıt Formu</Link>
        <Link to="/people" style={{ fontWeight: 'bold' }}>Kişiler Listesi</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Register />} /> {/*  */}
        <Route path="/people" element={<PeopleList />} /> {/*  */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;