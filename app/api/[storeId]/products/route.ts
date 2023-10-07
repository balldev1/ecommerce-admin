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

        //  รับ body จากform 
        const {
            name,
            price,
            categoryId,
            colorId,
            sizeId,
            images,
            isFeatured,
            isArchived
        } = body;

        // !== 401
        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        }

        if (!name) {
            return new NextResponse('Name is required', { status: 400 })
        }

        if (!price) {
            return new NextResponse('Price is required', { status: 400 })
        }

        if (!categoryId) {
            return new NextResponse('Category id is required', { status: 400 })
        }

        if (!colorId) {
            return new NextResponse('Color id is required', { status: 400 })
        }

        if (!sizeId) {
            return new NextResponse('Size id is required', { status: 400 })
        }

        // {ตรวจสอบ images มีค่า หรือ มีค่าเป็น array ไหม [images]}
        if (!images || !images.length) {
            return new NextResponse('Images are required', { status: 400 })
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
        const product = await prismadb.product.create({
            data: {
                name,
                price,
                isFeatured,
                isArchived,
                categoryId,
                colorId,
                sizeId,
                storeId: params.storeId, // => storeId === params.storeId
                //  สร้าง images หลายรายการของข้อมูล.
                // จะเก็บข้อมูล image เป็น array []
                // map วนลูปimages สร้าง array ใหม่ที่มีโครงสร้างเดียวกับ images โดยนำข้อมูล url ออกมาเป็นส่วนของ array ใหม่นี้.
                // เช่นส่งมา 2 รูป มี 2 url จะเป็นแบบนี้
                // [{ url: 'image1.jpg' }, { url: 'image2.jpg' }]
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image)
                        ]
                    }
                }
            }
        });

        return NextResponse.json(product)


    } catch (error) {
        console.log('[PRODUCTS_POST]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}

// รับข้อมูล Get
export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {
        // { ดึงค่า url ใหม่ เช่น localhost:3000/categoryId=value1 }
        // { ใช้searchParams.get(categoryId)  }
        // { ดึงค่าจะได้ categoryId = value 1 }
        // || และถ้าไม่มีค่าจะได้ค่า undefined
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get('categoryId') || undefined; // =>query parameters 
        const colorId = searchParams.get('colorId') || undefined;
        const sizeId = searchParams.get('sizeId') || undefined;
        const isFeatured = searchParams.get('isFeatured')

        if (!params.storeId) {
            return new NextResponse('Store id is required', { status: 400 })
        }

        // store => id === params.storeId , UserId
        // ตรวจสอบว่า ข้อมูล params ที่รับเข้ามาตรง store ไหม
        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                // categoryId, colorId, sizeId ต้องเป็นค่าที่รับมาจากตัวแปรที่ประกาศไว้ searchParams value ตรงกับฐานข้อมูล product
                categoryId, // => ถ้า มีค่าให้แสดงข้อมูล categoryId ถ้าไม่มีค่าก็แสดง undefined
                colorId,
                sizeId,
                isFeatured: isFeatured ? true : undefined, //ต้องเป็นค่า true ถ้าเป็น false ให้ใส่ undefined เพือให้ทำงานต่อได้
                isArchived: false // => ต้องมีค่าเป็น false เท่านั้น
            }, // รวมข้อมูลนี้ด้วย
            include: {
                images: true,
                category: true,
                color: true,
                size: true
            }, // เรียงจากมากไปน้อย
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(products);


    } catch (error) {
        console.log('[PRODUCTS_GET]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}