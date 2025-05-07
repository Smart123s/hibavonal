'use client'; 

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const RoomDeletePage = () => {
  const searchParams = useSearchParams();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setRoomId(id);
    } else {
      setErrorMessage("Room ID is missing.");
    }
  }, [searchParams]);

  const handleDelete = async () => {
    setErrorMessage(null);
    if (!roomId) {
      setErrorMessage("Room ID is invalid or missing.");
      return;
    }

    try {
      const response = await fetch('/api/rooms/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: roomId }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.error || "Failed to delete room.");
        return;
      }

      router.push('/dashboard/roommanagement');
    } catch (error) {
      console.error('Error occurred:', error);
      setErrorMessage("An unexpected error occurred.");
    }
  };

  if (roomId === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Delete Room</h1>

      {errorMessage && (
        <div className="text-red-500 mb-4">{errorMessage}</div>
      )}

      <button
        onClick={handleDelete}
        disabled={!roomId}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Delete Room
      </button>
    </div>
  );
};

export default RoomDeletePage;
