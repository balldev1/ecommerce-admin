import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// สร้างฐานข้อมูลที่ได้จาก from => label imageUrl =>  size
export async function POST(req: Request, { params }: { params: { storeId: string } }) {
    try {
        // clerk userId
        const { userId } = auth();
        // รับ json จากform 
        const body = await req.json()

        //  รับ name จากform 
        const { name, value } = body;

        // !== 401
        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        }

        if (!name) {
            return new NextResponse('Name is required', { status: 400 })
        }

        if (!value) {
            return new NextResponse('Value URL is required', { status: 400 })
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

        // size
        // เอาข้อมูลจาก ฟอร์ม สร้างฐานข้อมูล  size
        const size = await prismadb.size.create({
            data: {
                name,
                value,
                storeId: params.storeId // => storeId === params.storeId
            }
        });

        return NextResponse.json(size)


    } catch (error) {
        console.log('[SIZES_POST]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}

// รับข้อมูล Get
export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {
        if (!params.storeId) {
            return new NextResponse('Store id is required', { status: 400 })
        }

        // sizes => id === params.storeId , UserId
        // ตรวจสอบว่า ข้อมูล params ที่รับเข้ามาตรง store ไหม
        const sizes = await prismadb.size.findMany({
            where: {
                storeId: params.storeId
            }
        });

        return NextResponse.json(sizes);


    } catch (error) {
        console.log('[SIZES_GET]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}