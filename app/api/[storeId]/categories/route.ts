import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// สร้างฐานข้อมูลที่ได้จาก from => label imageUrl =>  billboards
export async function POST(req: Request, { params }: { params: { storeId: string } }) {
    try {
        // clerk userId
        const { userId } = auth();
        // รับ json จากform 
        const body = await req.json()

        //  รับ  จากform 
        const { name, billboardId } = body;

        // !== 401
        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        }

        if (!name) {
            return new NextResponse('Name is required', { status: 400 })
        }

        if (!billboardId) {
            return new NextResponse('Billboard id is required', { status: 400 })
        }

        if (!params.storeId) {
            return new NextResponse('Image URL is required', { status: 400 })
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

        // billboard
        // เอาข้อมูลจาก ฟอร์ม สร้างฐานข้อมูล  billboard
        const category = await prismadb.category.create({
            data: {
                name,
                billboardId,
                storeId: params.storeId // => storeId === params.storeId
            }
        });

        return NextResponse.json(category)


    } catch (error) {
        console.log('[CATEGORIES_POST]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}

// รับข้อมูล Get
export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {
        if (!params.storeId) {
            return new NextResponse('Store id is required', { status: 400 })
        }

        // store => id === params.storeId , UserId
        // ตรวจสอบว่า ข้อมูล params ที่รับเข้ามาตรง store ไหม
        const categories = await prismadb.category.findMany({
            where: {
                storeId: params.storeId
            }
        });

        return NextResponse.json(categories);


    } catch (error) {
        console.log('[CATEGORIES_GET]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}