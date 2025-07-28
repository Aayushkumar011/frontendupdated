import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const RateStartup = ({ user }) => {
  const { startupId } = useParams();
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/ratings`, {
        startupId,
        rating,
        comment
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessage('Rating submitted successfully!');
    } catch (err) {
      console.error(err);
      setMessage('Failed to submit rating.');
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Rate Startup</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-xl space-y-4">
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          placeholder="Rating (1-5)"
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Optional comment"
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Submit Rating
        </button>
        {message && <p className="mt-4 text-blue-600">{message}</p>}
      </form>
    </div>
  );
};

export default RateStartup;
