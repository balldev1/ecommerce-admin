import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// update ข้อมูล
// รับ req , params : storeId
export async function PATCH(req: Request, { params }: { params: { storeId: string } }) {
    try {
        // clerk.userId
        const { userId } = auth();
        // รับค่า name จาก form
        const body = await req.json();

        const { name } = body;

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        }

        if (!name) {
            return new NextResponse('Name is required', { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse('Store id is required', { status: 400 })
        }

        // update.store
        // store.id === params / userId 
        // update data => name
        const store = await prismadb.store.updateMany({
            where: {
                id: params.storeId,
                userId
            },
            data: {
                name
            }
        });

        // คืนค่า client.json(store)
        return NextResponse.json(store);

    } catch (error) {
        console.log('[STORE_PATCH]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}

// delete ข้อมูล
// รับ req , params : storeId 
export async function DELETE(req: Request, { params }: { params: { storeId: string } }) {
    try {
        // clerk.userId
        const { userId } = auth();

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        }

        if (!params.storeId) {
            return new NextResponse('Store id is required', { status: 400 })
        }

        // deleteMany.store
        // store.id === params / userId 
        const store = await prismadb.store.deleteMany({
            where: {
                id: params.storeId,
                userId
            }
        });

        // คืนค่า client.json(store)
        return NextResponse.json(store);

    } catch (error) {
        console.log('[STORE_DELETE]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}