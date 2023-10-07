import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// GET
export async function GET(req: Request, { params }: { params: { billboardId: string } }) {
    try {
        if (!params.billboardId) {
            return new NextResponse('Billboard id is required', { status: 400 })
        }

        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: params.billboardId,
            }
        });

        // คืนค่า client.json(store)
        return NextResponse.json(billboard);

    } catch (error) {
        console.log('[BILLBOARD_GET]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}

// update ข้อมูล
// รับ req , params :  storeId , billboards
export async function PATCH(req: Request, { params }: { params: { storeId: string, billboardId: string } }) {
    try {
        // clerk.userId
        const { userId } = auth();
        // รับค่าจาก form
        const body = await req.json();

        const { label, imageUrl } = body;

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        }

        if (!label) {
            return new NextResponse('Label is required', { status: 400 });
        }

        if (!imageUrl) {
            return new NextResponse('Image URL is required', { status: 400 });
        }

        if (!params.billboardId) {
            return new NextResponse('Billboards id is required', { status: 400 })
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
        const billboard = await prismadb.billboard.updateMany({
            where: {
                id: params.billboardId,
            },
            data: {
                label,
                imageUrl
            }
        });

        // คืนค่า client.json(store)
        return NextResponse.json(billboard);

    } catch (error) {
        console.log('[BILLBOARD_PATCH]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}

// delete ข้อมูล
// รับ req , params : storeId 
export async function DELETE(req: Request, { params }: { params: { storeId: string, billboardId: string } }) {
    try {
        // clerk.userId
        const { userId } = auth();

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        }

        if (!params.billboardId) {
            return new NextResponse('Billboard id is required', { status: 400 })
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
        const billboard = await prismadb.billboard.deleteMany({
            where: {
                id: params.billboardId,
            }
        });

        // คืนค่า client.json(store)
        return NextResponse.json(billboard);

    } catch (error) {
        console.log('[BILLBOARD_DELETE]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}