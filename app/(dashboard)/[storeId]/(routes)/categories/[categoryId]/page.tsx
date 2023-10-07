import prismadb from "@/lib/prismadb"
import { CategoryFrom } from "./components/category-form";

const CategoryPage = async ({ params }: { params: { categoryId: string, storeId: string } }) => {

    // billboard.id === params
    const category = await prismadb.category.findUnique({
        where: {
            id: params.categoryId
        }
    });

    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId: params.storeId // => หาข้อมูลของ billboard ที่มี storeId
        }
    })

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-8">
                <CategoryFrom billboards={billboards} initialData={category} />
            </div>
        </div>
    )
}

export default CategoryPage