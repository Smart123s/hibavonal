import { auth } from "@/auth";
import { Button } from "@mantine/core";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <h3 style={{ textAlign: "center", fontSize: "2rem" }}>
          {session?.user?.name}
          {session ? " is logged in" : " is not logged in"}
        </h3>
        <h1 style={{ textAlign: "center", fontSize: "4rem" }}>HibaVonal</h1>
        <Button component={Link} href="/auth/login">
          Login
        </Button>
        <br />
        <Button component={Link} href="/usernameTest">
          Username Test
        </Button>
      </div>
    </div>
  );
}
