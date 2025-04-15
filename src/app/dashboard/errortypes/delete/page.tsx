'use client';

import { useSearchParams, useRouter } from 'next/navigation';
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
      alert('Room ID is missing');
    }
  }, [searchParams]);

  const handleDelete = async () => {
    if (!roomId) {
      alert('Room ID is invalid or missing');
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

      const result = await response.json();

      if (!response.ok) {
        const message = result?.error || 'Failed to delete error type';
        throw new Error(message);
      }

      alert('Error type deleted successfully.');
      router.push('/dashboard/errortypes');
    } catch (error: any) {
      console.error('Error occurred:', error);
      alert(error.message || 'Something went wrong during deletion');
    }
  };

  if (roomId === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Delete error type</h1>
      <button onClick={handleDelete} disabled={!roomId}>
        Delete error type
      </button>
    </div>
  );
};

export default RoomDeletePage;
