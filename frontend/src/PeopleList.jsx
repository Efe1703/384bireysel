import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PeopleList() {
  const [people, setPeople] = useState([]);

  const fetchPeople = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/people');
      setPeople(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  const handleDelete = async (id) => {
    // Silmeden önce onay penceresi (Confirmation dialog) [cite: 45]
    if (window.confirm('Bu kişiyi silmek istediğinize emin misiniz?')) {
      await axios.delete(`http://localhost:5000/api/people/${id}`);
      fetchPeople(); // Listeyi güncelle
    }
  };

  const handleEdit = async (person) => {
    // Basit bir modal mantığı (Tarayıcı penceresi ile) [cite: 43]
    const newName = window.prompt('Yeni Ad Soyad:', person.full_name);
    const newEmail = window.prompt('Yeni E-posta:', person.email);

    if (newName && newEmail) {
      try {
        await axios.put(`http://localhost:5000/api/people/${person.id}`, {
          full_name: newName,
          email: newEmail
        });
        fetchPeople();
      } catch (err) {
        alert('Güncelleme başarısız: E-posta formatı hatalı veya kullanımda olabilir.');
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Kayıtlı Kişiler</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ad Soyad</th>
            <th>E-posta</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {people.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.full_name}</td>
              <td>{p.email}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Düzenle</button> {/* [cite: 40] */}
                <button onClick={() => handleDelete(p.id)} style={{ marginLeft: '10px' }}>Sil</button> {/* [cite: 41] */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}