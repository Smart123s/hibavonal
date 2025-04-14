'use client'; 

import { useSearchParams ,useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const RoomDeletePage = () => {
  const searchParams = useSearchParams();
  const [roomId, setRoomId] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setRoomId(id);
    } else {
      console.error('Room ID is missing');
    }
  }, [searchParams]);

  const handleDelete = async () => {
    //console.log('Room ID before sending request:', roomId);

    if (!roomId) {
      console.error('Room ID is invalid or missing');
      return;
    }
    try {
      const response = await fetch('/api/errortypes/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: roomId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete room');
      }

      const deletedRoom = await response.json();
      //console.log('Deleted Room:', deletedRoom);
      //return<div><h1>{deletedRoom} Room deleted successfully</h1></div>
      router.push('/dashboard/errortypes');
    } catch (error) {
      console.error('Error occurred:', error);
    }
  };

  if (roomId === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Delete error type</h1>
      <button onClick={handleDelete} disabled={!roomId} >
        Delete error type
      </button>
    </div>
  );
};

export default RoomDeletePage;
