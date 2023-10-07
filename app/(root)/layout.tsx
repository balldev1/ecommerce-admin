import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

//children
export default async function SetupLayout({ children }: { children: React.ReactNode }) {
    //clerk
    const { userId } = auth()

    // !==userId => /sign-in
    if (!userId) {
        redirect('/sign-in')
    }

    const billboard = await prismadb.billboard

    // clerk.userid === store.userId
    // params userId => store.id
    const store = await prismadb.store.findFirst({
        where: {
            userId
        }
    });

    // if clerk.userid === store.userId
    // เอา id ของ store.userId มาใช้
    // => /${store.id}
    // ค่า params store.id มาจาก userId
    if (store) {
        redirect(`/${store.id}`)
    }

    return (
        <>
            {children}
        </>
    );
}