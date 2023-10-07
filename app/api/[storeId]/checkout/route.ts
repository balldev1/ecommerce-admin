import Stripe from 'stripe';
import { NextResponse } from 'next/server';

import { stripe } from '@/lib/stripe';
import prismadb from '@/lib/prismadb';

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization"
}

// ตอบกลับ corsHeaders
export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

// รับ req , params.[storeId]
export async function POST(req: Request, { params }: { params: { storeId: string } }) {
    // req 
    const { productIds } = await req.json();

    // ! == 0 => 400
    if (!productIds || productIds.length === 0) {
        return new NextResponse('Product ids are required', { status: 400 })
    }

    // db.product.find
    // หาข้อมูล id ที่ === id ใน productIds
    const products = await prismadb.product.findMany({
        where: {
            id: {
                in: productIds
            }
        }
    });

    //Stripe ที่เก็บ [] รายการสินค้าที่จะส่งไปยัง Stripe Checkout.
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    //Stripe วนลูปหาค่าของ products เพือเก็บข้อมูลใส่  line_items
    products.forEach((product) => {
        line_items.push({ // > push ข้อมูลเก็บไว้ที่ line_items
            quantity: 1, // => จำนวนสินค้า
            price_data: {
                currency: 'USD', //=> สกุลเงิน
                product_data: {
                    name: product.name, //=>ชื่อสินค้า
                },
                unit_amount: product.price.toNumber() * 100 // => ราคาของสินค้าต่อหน่วยในหน่วยเงินที่เลือก (ในที่นี้คือ product.price ที่เปลี่ยนเป็น cent โดยการคูณด้วย 100
            }
        });
    });

    // db.order.create
    const order = await prismadb.order.create({
        data: {
            storeId: params.storeId, // => id ของร้าน มาจาก paramsstoreId
            isPaid: false,
            orderItems: { // ใช้ map เพื่อแปลง productIdsที่รับเข้ามา idของสินค้าที่รับเข้ามา เป็นอาร์เรย์ของอ็อบเจกต์ที่จะสร้าง. orderItems[productId]
                create: productIds.map((productId: string) => ({
                    product: {  //เอา id product จาก db มา
                        connect: { // => ใช้ connect เพื่อเชื่อมต่อ orderItem กับสินค้าที่มี ID เท่ากับ productId.
                            id: productId // id.product === productId ที่รับเข้ามา
                        }
                    }
                }))
            }
        }
    });


    //Stripe create session 
    const session = await stripe.checkout.sessions.create({
        line_items, // => รายการสินค้า
        mode: 'payment', // => ชำระเงิน
        billing_address_collection: 'required', // =>เก็บที่อยู่ลูกค้า 
        phone_number_collection: {
            enabled: true // =>เก็บเบอร์โทร 
        },
        success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`, // => searchParams = success
        cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`, // => searchParams = canceled
        metadata: { // ข้อมูลการชำระเงิน
            orderId: order.id // orderIdคือ Stripe idของ  order.id มาจาก db.order.id
        }
    });

    // { คืนค่าหน้า Checkout  session.url Stripe }
    return NextResponse.json({ url: session.url }, {
        headers: corsHeaders
    });
}