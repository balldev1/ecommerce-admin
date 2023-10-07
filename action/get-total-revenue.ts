import prismadb from "@/lib/prismadb";

// รับข้อมูล รายได้ทั้งหมด จาก order 
// รับ StoreId เข้ามาในการหาออเดอร์ที่ ispaid true , storeId
export const getTotalRevenue = async (storeId: string) => {

    // db.order.findMany => storeId,isPaid === true
    // include orderItems => include product
    const paidOrders = await prismadb.order.findMany({
        where: {
            storeId,
            isPaid: true,
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        }
    });

    // reduce แยกค่าแต่ละค่าก่อน
    //  รวมรายได้ของ total,order นอกก่อน ที่มี orderItems
    //  เอา oreder.orederItemsที่มี product.price => product.price มาบวกกัน จะได้ orderTotal
    //  เอาผลรวมทั้งหมดของ orderTotal มารวมกัน จะได้ totalRevenue
    //  db.order => paidorder => order.orderItems => orderItems.product
    //  => product.price [...++] => orderTotal => totall + ordertotal = totalRevenue
    const totalRevenue = paidOrders.reduce((total, order) => {
        const orderTotal = order.orderItems.reduce((orderSum, item) => {
            return orderSum + item.product.price.toNumber();
        }, 0);

        return total + orderTotal;
    }, 0);

    return totalRevenue;
}