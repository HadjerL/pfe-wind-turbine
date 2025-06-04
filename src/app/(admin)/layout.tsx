import NavBar from "../ui/admin/home/nav-bar";


const links = [
    { name: 'Classification', href: '/managing/classification' },
    { name: 'Forecasting', href: '/managing/forecasting' },
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
