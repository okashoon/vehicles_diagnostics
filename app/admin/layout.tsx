import { NavBarV3 } from "@/app/(v1)/components/NavBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBarV3 />
      {children}
    </>
  );
}
