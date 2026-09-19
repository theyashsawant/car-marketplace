import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/api/cars/')
      .then(res => {
        setCars(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Cars</h1>
      {cars.map(car => (
        <div key={car.id}>
          <h3>{car.year} {car.make} {car.model}</h3>
          <p>{car.type} — ₹{car.price} — {car.city}</p>
        </div>
      ))}
    </div>
  );
}

export default App;