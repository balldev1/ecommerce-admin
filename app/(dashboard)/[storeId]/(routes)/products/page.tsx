import { format } from 'date-fns';
import prismadb from '@/lib/prismadb'
import { formatter } from '@/lib/utils';

import { ProductClient } from './components/client'
import { ProductColumn } from "./components/columns" // type

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {

    // product ข้อมูลทุกอัน เรียงจากล่าสุดไปหลังสุด
    // product เอาข้อมูล category,size,color
    const products = await prismadb.product.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            category: true,
            size: true,
            color: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    // รูปแบบ column Product
    const formattedProducts: ProductColumn[] = products.map((item) => ({
        id: item.id,
        name: item.name,
        isFeatured: item.isFeatured,
        isArchived: item.isArchived,
        price: formatter.format(item.price.toNumber()), // =>lib/utils/formatter
        // {include category,size,color => name,value}
        category: item.category.name,
        size: item.size.name,
        color: item.color.value,
        createdAt: format(item.createdAt, 'MMMM do, yyyy'),
    }));

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <ProductClient data={formattedProducts} />
            </div>
        </div>
    )
}

export default ProductsPage