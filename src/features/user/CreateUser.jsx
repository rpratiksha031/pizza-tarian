import { useState } from 'react';
import Button from '../../ui/Button';
import { useDispatch } from 'react-redux';
import { updateName } from './userSlice';
import { useNavigate } from 'react-router-dom';

function CreateUser() {
  const [username, setUsername] = useState('');

   const dispatch= useDispatch();
    const Navigate= useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    if(!username)return null;

    dispatch(updateName(username));
    Navigate('/menu');
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="mb-4 text-base md:text-lg text-black font-semibold">
  👋 Welcome! Please start by telling us your name:
</p>


<input
  type="text"
  className="w-72 px-4 py-2 border border-gray-300 rounded-xl shadow-sm 
             text-gray-800 placeholder-gray-400 transition duration-200 mb-8
             focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
             hover:border-red-500 hover:ring-1 hover:ring-red-500"
  placeholder="Your full name"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
/>




      {username !== '' && (
        <div>
          <Button type="primary">Start ordering</Button>
        </div>
      )}
    </form>
  );
}

export default CreateUser;
