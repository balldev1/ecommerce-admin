import prismadb from "@/lib/prismadb";

// กำหนดโครงสร้าง
interface GraphData {
    name: string;
    total: number;
}

export const getGraphRevenue = async (storeId: string) => {

    // รับข้อมูล order => include => orderItems , product
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

    // กำหนดให้เป็นอ็อบเจกต์ที่มีคีย์เป็นตัวเลข
    const monthlyRevenue: { [key: number]: number } = {};

    // for 1 วูปหาเดือนที่สร้าง
    // วนลูป paidOrders => เก็บไว้ order
    // เอาเดือนที่สร้าง order => เก็บไว้ที่ month
    // revenueForOrder = 0

    // for 2 หารายได้รวมทั้งหมดของเดือนนั้นแล้วมากบวก
    // ลูป order.orederItem => เก็บไว้ที่ item
    // เอาค่า item.product.price ที่ได้จาก loop มาบวก += กับ revenueForOrder ไปเรื่อยๆ
    // เอา revenueForOrder + กับ monthlyRevenue[month] ของเดือนนั้น ถ้ายังไม่มีรายได้ ให้ค่าเป็น 0 
    // จะได้รายได้ของเดือนนั้น monthlyRevenue[month]
    for (const order of paidOrders) {
        const month = order.createdAt.getMonth();

        let revenueForOrder = 0;

        // += คือบวกต่อกันไปเรื่อยๆ

        for (const item of order.orderItems) {
            revenueForOrder += item.product.price.toNumber();
        }

        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
    };

    // ข้อมูล กราฟ เดือน total
    const graphData: GraphData[] = [
        { name: 'Jan', total: 0 },
        { name: 'Feb', total: 0 },
        { name: 'Mar', total: 0 },
        { name: 'Apr', total: 0 },
        { name: 'May', total: 0 },
        { name: 'Jun', total: 0 },
        { name: 'Jul', total: 0 },
        { name: 'Aug', total: 0 },
        { name: 'Sep', total: 0 },
        { name: 'Oct', total: 0 },
        { name: 'Nov', total: 0 },
        { name: 'Dec', total: 0 },
    ];

    // monthlyRevenue คือค่าแต่ละเดือน => เช่น มกรา 500
    // loop ผ่านทุกเดือนใน monthlyRevenue 
    // ในแต่ละ loop parseIntแปลงเป็น int 
    // ใช้เลขที่ได้จาก parseInt กำหนดค่า total ของเดือนนั้นใน graphData.
    // return ค่าที่ได้ => graphData
    for (const month in monthlyRevenue) {
        graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];

    }
    return graphData
}