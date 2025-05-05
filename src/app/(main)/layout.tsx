import NavBar from "@/app/ui/home/nav-bar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <NavBar/>
        <div >{children}</div>
    </>
  );
}
