import prismadb from "@/lib/prismadb"
import { OrderForm } from "./components/order-form";

const OrderPage = async ({ params }: { params: { orderId: string } }) => {

    // order.id === params
    const order = await prismadb.order.findUnique({
        where: {
            id: params.orderId
        }
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-8">
                <OrderForm initialData={order} />
            </div>
        </div>
    )
}

export default OrderPage