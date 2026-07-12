import { NavBarV3 } from "@/app/(v1)/components/NavBar";

export default function V3Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBarV3 />
      {children}
    </>
  );
}
