import prismadb from "@/lib/prismadb";

export const getStockCount = async (storeId: string) => {

    // db.order.count
    // หาจำนวน order ที่ isPaid: true,
    const stockCount = await prismadb.product.count({
        where: {
            storeId,
            isArchived: false,
        },
    });

    return stockCount;
}