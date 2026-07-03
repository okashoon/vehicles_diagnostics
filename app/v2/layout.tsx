import { NavBarV2 } from "@/app/v2/components/NavBar";

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBarV2 />
      {children}
    </>
  );
}
