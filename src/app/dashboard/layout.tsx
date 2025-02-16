import RequiresAuth from "../components/requiresAuth";
import DashboardClientLayout from "./clientLayout";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequiresAuth>
      <DashboardClientLayout>{children}</DashboardClientLayout>
    </RequiresAuth>
  );
}
