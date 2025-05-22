import React from 'react';
import { Link } from 'react-router-dom';

const SimplePage = () => {
  console.log('SimplePage component rendering');
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Books4Cash.io</h1>
      <p className="mb-6">Your app is now running in Client-Side Rendering mode!</p>
      
      <div className="space-y-4">
        <p>This is a simple diagnostic page to verify that the React application is rendering correctly.</p>
        <div className="flex gap-4 justify-center">
          <Link 
            to="/"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Home
          </Link>
          <Link 
            to="/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            New Book
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SimplePage;