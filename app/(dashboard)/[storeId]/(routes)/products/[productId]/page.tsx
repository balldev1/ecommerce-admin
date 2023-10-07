import prismadb from "@/lib/prismadb"
import { ProductForm } from "./components/product-form";

const ProductPage = async ({ params }: { params: { storeId: string, productId: string } }) => {

    // product.id === params
    const product = await prismadb.product.findUnique({
        where: {
            id: params.productId,
        },
        include: {
            images: true,
        }
    });

    // { รับข้อมูล category,size,color } 
    const categories = await prismadb.category.findMany({
        where: {
            storeId: params.storeId
        }
    })

    const sizes = await prismadb.size.findMany({
        where: {
            storeId: params.storeId
        }
    })

    const colors = await prismadb.color.findMany({
        where: {
            storeId: params.storeId
        }
    })

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-8">
                <ProductForm
                    categories={categories}
                    colors={colors}
                    sizes={sizes}
                    initialData={product}
                />
            </div>
        </div>
    )
}

export default ProductPage