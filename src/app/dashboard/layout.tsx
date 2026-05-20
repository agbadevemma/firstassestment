import DashboardLayout from "@/components/dashboard-layout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full ">
      <DashboardLayout>{children} </DashboardLayout>
    </div>
  );
}
