import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// สร้างฐานข้อมูลที่ได้จาก from => name , clerk => userId ไปใส่ไว้ที่ฐานข้อมูล store
export async function POST(req: Request) {
    try {
        // clerk userId
        const { userId } = auth();
        // รับ json จากform 
        const body = await req.json()

        //  รับ name จากform 
        const { name } = body;

        // !== 401
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!name) {
            return new NextResponse('Name is required', { status: 400 })
        }

        // เอาข้อมูลจาก ฟอร์ม เก็บไว้ที่ฐานข้อมูล store
        const store = await prismadb.store.create({
            data: {
                name, // form => name
                userId //crek
            }
        });

        return NextResponse.json(store)


    } catch (error) {
        console.log('[STORES_POST]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}