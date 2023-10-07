import prismadb from "@/lib/prismadb";

export const getSalesCount = async (storeId: string) => {

    // db.order.count
    // หาจำนวน order ที่ isPaid: true,
    const saleCount = await prismadb.order.count({
        where: {
            storeId,
            isPaid: true,
        },
    });

    return saleCount;
}