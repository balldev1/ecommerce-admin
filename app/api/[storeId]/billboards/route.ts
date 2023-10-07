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

        //  รับ name จากform 
        const { label, imageUrl } = body;

        // !== 401
        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        }

        if (!label) {
            return new NextResponse('Label is required', { status: 400 })
        }

        if (!imageUrl) {
            return new NextResponse('Image URL is required', { status: 400 })
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
        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId // => storeId === params.storeId
            }
        });

        return NextResponse.json(billboard)


    } catch (error) {
        console.log('[BILLBOARDS_POST]', error);
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
        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId: params.storeId
            }
        });

        return NextResponse.json(billboards);


    } catch (error) {
        console.log('[BILLBOARDS_GET]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}