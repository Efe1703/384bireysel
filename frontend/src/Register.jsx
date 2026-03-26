import { useState } from 'react';
import axios from 'axios';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Frontend Doğrulamaları (Validation)
    if (!fullName) return setMessage('Ad soyad boş birakilamaz!');
    if (!email) return setMessage('E-posta boş birakilamaz!');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return setMessage('Geçerli bir e-posta girin!');

    try {
      // Backend'e POST isteği atma
      await axios.post('http://localhost:5000/api/people', { full_name: fullName, email });
      setMessage('Kayit başarili!');
      setFullName(''); // Başarılı olunca formu temizle
      setEmail('');
    } catch (error) {
      if (error.response?.status === 409) {
        setMessage('Hata: Bu e-posta zaten kullanimda!');
      } else {
        setMessage('Sunucu hatasi oluştu.');
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Yeni Kişi Ekle</h2>
      {message && <p><b>{message}</b></p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Ad Soyad: </label>
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <br />
        <div>
          <label>E-posta: </label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <br />
        <button type="submit">Kaydet</button>
      </form>
    </div>
  );
}