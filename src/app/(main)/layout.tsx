import NavBar from "@/app/ui/home/nav-bar";


const links = [
    { name: 'Home', href: '/' },
    { name: 'How It Works', href: '/#education' }, 
    { name: 'Insights', href: '/#showcase' },
    { name: 'Get Started', href: '/#cta' },
    // { name: 'Dashboard', href: '/dashboard' },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <NavBar links={links}/>
        <div >{children}</div>
    </>
  );
}
