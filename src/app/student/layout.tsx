
import AppLayout from "../(app)/layout";
import AuthGuard from "@/components/auth-guard";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard><AppLayout>{children}</AppLayout></AuthGuard>;
}
