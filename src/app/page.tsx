import { Button } from "@mantine/core";
import Link from "next/link";

export default function Home() {
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
        <h1 style={{ textAlign: "center", fontSize: "4rem" }}>HibaVonal</h1>
        <Button component={Link} href="/auth/login">
          Login
        </Button>
      </div>
    </div>
  );
}
