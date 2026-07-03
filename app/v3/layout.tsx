import { NavBarV3 } from "@/app/v3/components/NavBar";

export default function V3Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBarV3 />
      {children}
    </>
  );
}
