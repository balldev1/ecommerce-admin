import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// GET
export async function GET(req: Request, { params }: { params: { categoryId: string } }) {
    try {
        if (!params.categoryId) {
            return new NextResponse('Category id is required', { status: 400 })
        }

        const category = await prismadb.category.findUnique({
            where: {
                id: params.categoryId,
            },
            include: {
                billboard: true,
            }
        });

        // คืนค่า client.json(store)
        return NextResponse.json(category);

    } catch (error) {
        console.log('[CATEGORY_GET]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}

// update ข้อมูล
// รับ req , params :  storeId , categoryId
export async function PATCH(req: Request, { params }: { params: { storeId: string, categoryId: string } }) {
    try {
        // clerk.userId
        const { userId } = auth();
        // รับค่าจาก form
        const body = await req.json();

        const { name, billboardId } = body;

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        }

        if (!name) {
            return new NextResponse('Name is required', { status: 400 });
        }

        if (!billboardId) {
            return new NextResponse('Billboard id is required', { status: 400 });
        }

        if (!params.categoryId) {
            return new NextResponse('Category id is required', { status: 400 })
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
        const category = await prismadb.category.updateMany({
            where: {
                id: params.categoryId,
            },
            data: {
                name,
                billboardId
            }
        });

        // คืนค่า client.json(store)
        return NextResponse.json(category);

    } catch (error) {
        console.log('[CATEGORY_PATCH]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}

// delete ข้อมูล
// รับ req , params : storeId 
export async function DELETE(req: Request, { params }: { params: { storeId: string, categoryId: string } }) {
    try {
        // clerk.userId
        const { userId } = auth();

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        }

        if (!params.categoryId) {
            return new NextResponse('Category id is required', { status: 400 })
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
        const category = await prismadb.category.deleteMany({
            where: {
                id: params.categoryId,
            }
        });

        // คืนค่า client.json(store)
        return NextResponse.json(category);

    } catch (error) {
        console.log('[CATEGORY_DELETE]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}