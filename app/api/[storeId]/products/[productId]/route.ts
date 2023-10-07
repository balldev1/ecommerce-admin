import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// GET
export async function GET(req: Request, { params }: { params: { productId: string } }) {
    try {
        if (!params.productId) {
            return new NextResponse('Product id is required', { status: 400 })
        }

        const product = await prismadb.product.findUnique({
            where: {
                id: params.productId,
            },
            include: {
                images: true,
                category: true,
                size: true,
                color: true
            }
        });

        // คืนค่า client.json(store)
        return NextResponse.json(product);

    } catch (error) {
        console.log('[PRODUCT_GET]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}

// update ข้อมูล
// รับ req , params :  storeId , products
export async function PATCH(req: Request, { params }: { params: { storeId: string, productId: string } }) {
    try {
        // clerk.userId
        const { userId } = auth();
        // รับค่าจาก form
        const body = await req.json();

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

        if (!params.productId) {
            return new NextResponse('Products id is required', { status: 400 })
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

        // update product ที่ id === params.productId
        //  images => deleteMany: {} => ลบข้อมูลใน [] image ทั้งหมด
        await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                name,
                price,
                categoryId,
                colorId,
                sizeId,
                images: {
                    deleteMany: {}
                },
                isFeatured,
                isArchived
            }
        });

        // update product.images ที่ id === params.productId
        // update.product.images => images.map  => images = ...[{url:image1},{url:image2}] 
        const product = await prismadb.product.update({
            where: {
                id: params.productId
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image),
                        ]
                    }
                }
            }
        })

        // คืนค่า client.json(product)
        return NextResponse.json(product);

    } catch (error) {
        console.log('[PRODUCT_PATCH]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}

// delete ข้อมูล
// รับ req , params : storeId 
export async function DELETE(req: Request, { params }: { params: { storeId: string, productId: string } }) {
    try {
        // clerk.userId
        const { userId } = auth();

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        }

        if (!params.productId) {
            return new NextResponse('Product id is required', { status: 400 })
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
        const product = await prismadb.product.deleteMany({
            where: {
                id: params.productId,
            }
        });

        // คืนค่า client.json(store)
        return NextResponse.json(product);

    } catch (error) {
        console.log('[PRODUCT_DELETE]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}