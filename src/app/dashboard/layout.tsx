import { DashboardLayout } from "@/components/dashboard-layout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full flex flex-col">
      <DashboardLayout>{children} </DashboardLayout>
    </div>
  );
}
