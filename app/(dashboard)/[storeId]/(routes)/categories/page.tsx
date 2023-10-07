import { format } from 'date-fns';
import prismadb from '@/lib/prismadb'
import { CategoryClient } from './components/client'
import { CategoryColumn } from "./components/columns"

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {

    // category ข้อมูลทุกอัน เรียงจากล่าสุดไปหลังสุด
    const categories = await prismadb.category.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            billboard: true // => รวมข้อมูล billboard
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    // รูปแบบ column billboards
    const formattedCategories: CategoryColumn[] = categories.map((item) => ({
        id: item.id,
        name: item.name, // => categories.name
        billboardLabel: item.billboard.label, // => billboard.label
        createdAt: format(item.createdAt, 'MMMM do, yyyy'),
    }));

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <CategoryClient data={formattedCategories} />
            </div>
        </div>
    )
}

export default CategoriesPage;