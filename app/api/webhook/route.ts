import Stripe from 'stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { stripe } from '@/lib/stripe';
import prismadb from '@/lib/prismadb';

// route webhook stripe
export async function POST(req: Request) {

    //รับ req text
    const body = await req.text()

    // รับ lib stripe 
    const signature = headers().get("Stripe-Signature") as string

    // ตัวแปร stripe.event
    let event: Stripe.Event

    // ตรวจสอบ event จากเว็บ hook
    // constructEvent คือสร้างเหตุการณ์ webhook
    // => รับ body , signature , stripe secret
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
    }

    // เก็บ session แปลงข้อมูล event ที่เกิดขึ้นในการชำระเงิน stipe
    const session = event.data.object as Stripe.Checkout.Session;

    // แยกเอาข้อมูลจาก session checkout => ข้อมูลที่อยู่ลูกค้่า address 
    const address = session?.customer_details?.address;

    // [] => ข้อมูลต่างๆ ที่ลูกค้ากรอกใน stipe
    const addressComponents = [
        address?.line1,
        address?.line2,
        address?.city,
        address?.state,
        address?.postal_code,
        address?.country
    ];

    //เอาข้อมูล addressComponents มากรองที่ไม่เป็นค่า null => join(',') => เช่น address1 , address2
    const addressString = addressComponents.filter((c) => c !== null).join(', ');

    // if event === 'completed'
    // db.order.update orderid === session.OrderId
    // update data
    // รวม ข้อมูล orderItems ด้วย
    if (event.type === "checkout.session.completed") {
        const order = await prismadb.order.update({
            where: {
                id: session?.metadata?.orderId,
            },
            data: {
                isPaid: true,
                address: addressString,
                phone: session?.customer_details?.phone || '',
            },
            include: {
                orderItems: true,
            }
        });

        // เอาข้อมูล order.[orderItems] มา map หาค่า orderItem.productId
        const productIds = order.orderItems.map((orderItem) => orderItem.productId);

        // db.product.update => product.id ===  ใน productIds ทุกตัวใน [...productIds]
        // อัพเดทค่า isArchived: true
        await prismadb.product.updateMany({
            where: {
                id: {
                    in: [...productIds],
                },
            },
            data: {
                isArchived: true
            }
        });
    }

    return new NextResponse(null, { status: 200 });
};