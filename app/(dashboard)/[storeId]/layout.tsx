import Navbar from "@/components/Navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from 'next/navigation';

// ใช้เพือหา ข้อมูล store 
//children , params === [ storeId ]
export default async function DashboardLayout({ children, params }:
    { children: React.ReactNode; params: { storeId: string } }) {
    //clerk
    const { userId } = auth();

    //!userId => sign-in
    if (!userId) {
        redirect('/sign-in')
    }

    // store.id === params.storeId ที่รับเข้ามา
    // userId ใช้เพือหา store.userid === auth.userId
    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId
        }
    });

    // !== store => '/'
    if (!store) {
        redirect('/')
    }

    return (
        <>
            <Navbar />
            {children}
        </>
    )
}