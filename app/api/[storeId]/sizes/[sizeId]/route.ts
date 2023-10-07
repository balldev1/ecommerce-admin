import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// GET
export async function GET(req: Request, { params }: { params: { sizeId: string } }) {
    try {
        if (!params.sizeId) {
            return new NextResponse('Size id is required', { status: 400 })
        }

        const size = await prismadb.size.findUnique({
            where: {
                id: params.sizeId,
            }
        });

        // คืนค่า client.json(store)
        return NextResponse.json(size);

    } catch (error) {
        console.log('[SIZE_GET]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}

// update ข้อมูล
// รับ req , params :  storeId , sizeId
export async function PATCH(req: Request, { params }: { params: { storeId: string, sizeId: string } }) {
    try {
        // clerk.userId
        const { userId } = auth();
        // รับค่าจาก form
        const body = await req.json();

        const { name, value } = body;

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        }

        if (!name) {
            return new NextResponse('Label is required', { status: 400 });
        }

        if (!value) {
            return new NextResponse('Image URL is required', { status: 400 });
        }

        if (!params.sizeId) {
            return new NextResponse('Size id is required', { status: 400 })
        }


        // store => id === params.storeId , UserId
        // ตรวจสอบว่า ข้อมูล params ที่รับเข้ามาตรง store ไหม
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        // !==
        if (!storeByUserId) {
            return new NextResponse('Unauthorized', { status: 403 });
        }

        // update.billboard
        // billboard.id === params 
        // update data => name
        const size = await prismadb.size.updateMany({
            where: {
                id: params.sizeId,
            },
            data: {
                name,
                value
            }
        });

        // คืนค่า client.json(store)
        return NextResponse.json(size);

    } catch (error) {
        console.log('[SIZE_PATCH]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}

// delete ข้อมูล
// รับ req , params : storeId 
export async function DELETE(req: Request, { params }: { params: { storeId: string, sizeId: string } }) {
    try {
        // clerk.userId
        const { userId } = auth();

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        }

        if (!params.sizeId) {
            return new NextResponse('Size id is required', { status: 400 })
        }

        // store => id === params.storeId , UserId
        // ตรวจสอบว่า ข้อมูล params ที่รับเข้ามาตรง store ไหม
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        // !==
        if (!storeByUserId) {
            return new NextResponse('Unauthorized', { status: 403 });
        }

        // deleteMany.store
        // store.id === params / userId 
        const size = await prismadb.size.deleteMany({
            where: {
                id: params.sizeId,
            }
        });

        // คืนค่า client.json(store)
        return NextResponse.json(size);

    } catch (error) {
        console.log('[SIZE_DELETE]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}