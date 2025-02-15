import SignOutButton from "@/components/signoutButton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <SignOutButton />
      {children}
    </div>
  );
}
