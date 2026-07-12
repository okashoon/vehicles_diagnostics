import { NavBar } from "@/app/components/NavBar";

export default function V1Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
