"use client";

import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";

export default function DashboardPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setSession(session);
      setLoading(false);
    };
    fetchSession();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Username Test</h1>
      <p>Welcome, {session?.user?.name}</p>
    </div>
  );
}
