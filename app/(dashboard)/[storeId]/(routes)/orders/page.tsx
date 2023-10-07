import { format } from 'date-fns';
import prismadb from '@/lib/prismadb'
import { OrderClient } from './components/client'
import { OrderColumn } from "./components/columns"
import { formatter } from '@/lib/utils';

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {

    // order ข้อมูลทุกอัน เรียงจากล่าสุดไปหลังสุด
    const orders = await prismadb.order.findMany({
        where: {
            storeId: params.storeId
        },
        // {รวมข้อมูล orderItems ที่มีข้อมูล product []}
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    // รูปแบบ column orders
    const formattedOrders: OrderColumn[] = orders.map((item) => ({
        id: item.id,
        phone: item.phone,
        address: item.address,
        // => orderItem.map => orderItems.product.name => join (', ') => [product1, product2]
        products: item.orderItems.map((orderItem) => orderItem.product.name).join(', '),
        // reduce + ค่าใน []
        // formatter lib แปลงค่าเงิน ,format จัดรูปแบบ
        //  ( items.product.price ราคาสินค้าทั้งหมด ทุกรอบของการ loopจะเอามารวมกับ total ที่เริ่มจาก 0 เช่น 0 => 10 + 20 => 30 )
        //  reduce => + price.total => result
        totalPrice: formatter.format(item.orderItems.reduce((total, item) => {
            return total + Number(item.product.price)
        }, 0)), // =>ค่าเริ่มต้น
        isPaid: item.isPaid,
        createdAt: format(item.createdAt, 'MMMM do, yyyy'),
    }));

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <OrderClient data={formattedOrders} />
            </div>
        </div>
    )
}

export default OrdersPage