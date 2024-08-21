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
      <p className='mb-4 text-sm text-stone-600 md:text-base'>👋 Welcome! Please start by telling us your name:</p>

      <input
        type="text" className='w-72 input mb-8'
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
