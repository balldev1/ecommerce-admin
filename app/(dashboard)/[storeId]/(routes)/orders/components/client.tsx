'use client'


import { useParams, useRouter } from "next/navigation"
import { OrderColumn, columns } from "./columns"

import { DataTable } from "@/components/ui/data-table"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"

interface OrderClientProps {
    data: OrderColumn[]
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {

    const router = useRouter();
    const params = useParams();

    return (
        <>
            {/* {ui/heading} */}
            <Heading
                title={`Orders (${data.length})`}
                description="Manage orders for your store"
            />
            <Separator />
            <DataTable searchKey='products' columns={columns} data={data} />
            <Separator />
        </>
    )
}