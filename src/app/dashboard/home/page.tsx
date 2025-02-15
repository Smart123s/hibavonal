import { auth } from "@/auth";
import { Text } from "@mantine/core";

export default async function HomePage() {
  const session = await auth();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
        flexDirection: "column",
      }}
    >
      <Text style={{ textAlign: "center", fontSize: "4rem" }}>HibaVonal</Text>
      <Text style={{ textAlign: "center", fontSize: "2rem" }}>
        {session?.user?.name}
        {" is logged in"}
      </Text>
    </div>
  );
}
