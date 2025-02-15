import { auth } from "@/auth";
import { Text } from "@mantine/core";

export default async function HomePage() {
  const session = await auth();

  return <Text style={{ textAlign: "center", fontSize: "4rem" }}>Tickets</Text>;
}
