import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import UserList from './components/UserList.jsx';
import UserDetails from './components/UserDetails.jsx';
import AddUser from './components/AddUser.jsx';
import { useDispatch } from 'react-redux';
import { setUsers } from './store.js';

export default function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((r) => {
        if (!r.ok) throw new Error('Network response was not ok');
        return r.json();
      })
      .then((data) => {
        const now = Date.now();
        const mapped = data.map((u, i) => ({
          ...u,
          email: (u.email || "").toLowerCase(),
          addedAt: now - (data.length - i)
        }));
        dispatch(setUsers(mapped));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || String(err));
        setLoading(false);
      });
  }, [dispatch]);

  return (
    <div className="app">
      <main>
        {loading && <p>Loading users...</p>}
        {error && <p className="error">Error: {error}</p>}

        {!loading && !error && (
          <Routes>
            <Route path="/" element={<UserList />} />
            <Route path="/users/:id" element={<UserDetails />} />
            <Route path="/add" element={<AddUser />} />
          </Routes>
        )}
      </main>
    </div>
  );
}
