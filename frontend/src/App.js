import React, { useState } from 'react';
import Login from './Login';
import Quiz from './Quiz';

function App() {
  const [user, setUser] = useState(null);

  return user ? (
    <div>
      <h2 style={{ textAlign: 'center', marginTop: '20px' }}>
        Welcome to Python Quiz by Akshaya
      </h2>
      <Quiz user={user} onLogout={() => setUser(null)} />
    </div>
  ) : (
    <Login setUser={setUser} />
  );
}

export default App;
