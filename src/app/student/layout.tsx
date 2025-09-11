
import AppLayout from "../(app)/layout";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
