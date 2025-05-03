"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchAllStudents, fetchRoomData } from "./action";
import { Select, TextInput, Text, Button } from "@mantine/core";

export default function RoomEditPage() {
  const searchParams = useSearchParams();
  const [roomData, setRoomData] = useState<any>(null);
  const [studentDropdowns, setStudentDropdowns] = useState<string[]>([""]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get("id");
    if (!id) return;

    fetchRoomData(id).then((data) => {
      if (data) {
        setRoomData(data);
        const initialStudents = data.users.map((u: any) => u.id) || [];
        setStudentDropdowns(initialStudents.length ? initialStudents : [""]);
      }
    });

    fetchAllStudents().then((data) => {
      if (data) {
        setAllStudents(data || []);
      }
    });
  }, [searchParams]);

  const handleStudentChange = (index: number, value: string) => {
    const newDropdowns = [...studentDropdowns];
    newDropdowns[index] = value;

    if (index === studentDropdowns.length - 1 && studentDropdowns.length < 4) {
      newDropdowns.push("");
    }

    setStudentDropdowns(newDropdowns);
  };

  const handleSave = async () => {
    setErrorMessage(null); // Clear previous error message
    try {
      const updatedRoom = {
        id: roomData.id,
        name: roomData.name,
        level: roomData.level,
        roomType: roomData.roomType,
        assignedStudents: studentDropdowns.filter((id) => id),
      };

      const response = await fetch("/api/rooms/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedRoom),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.error || "Failed to update room.");
        return;
      }

      alert("Room updated successfully!");
    } catch (error) {
      console.error("Error updating room:", error);
      setErrorMessage("Something went wrong while saving.");
    }
  };

  if (!roomData) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Edit Room</h1>

      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

      <label className="block mb-4">
        <Text>Name</Text>
        <TextInput
          value={roomData.name}
          onChange={(e) => setRoomData({ ...roomData, name: e.target.value })}
          className="block w-full"
        />
      </label>

      <label className="block mb-4">
        <Text>Level</Text>
        <TextInput
          type="number"
          value={roomData.level}
          onChange={(e) =>
            setRoomData({ ...roomData, level: parseInt(e.target.value) })
          }
          className="block w-full"
        />
      </label>

      <label className="block mb-4">
        <Text>Room Type</Text>
        <Select
          value={roomData.roomType}
          onChange={(value) => setRoomData({ ...roomData, roomType: value })}
          data={[
            { value: "Public", label: "Public" },
            { value: "Private", label: "Private" },
          ]}
        />
      </label>

      <div className="mb-4">
        <Text className="font-semibold mb-2">Assigned Students:</Text>
        {studentDropdowns.map((selected, index) => (
          <Select
            key={index}
            value={selected}
            onChange={(value) => handleStudentChange(index, value || "")}
            data={[
              { value: "", label: "Select a student" },
              ...allStudents.map((student: any) => ({
                value: student.id,
                label: `${student.name} - ${student.email}`,
              })),
            ]}
            className="mb-2"
          />
        ))}
      </div>

      <Button onClick={handleSave} className="mt-4">
        Save
      </Button>
    </div>
  );
}
