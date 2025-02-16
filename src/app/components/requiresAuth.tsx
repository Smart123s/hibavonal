import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function RequiresAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  return <>{children}</>;
}
