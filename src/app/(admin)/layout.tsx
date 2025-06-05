import NavBar from "../ui/admin/home/nav-bar";
import AuthGuard from '@/app/components/AuthGuard'; 

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
            <NavBar links={links} />
            <AuthGuard>
                <div>{children}</div>
            </AuthGuard>
        </>
    );
}
