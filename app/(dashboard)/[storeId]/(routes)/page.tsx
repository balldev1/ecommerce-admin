import React from 'react'
import prismadb from '@/lib/prismadb'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { formatter } from '@/lib/utils';
import { CreditCard, DollarSign, Package } from 'lucide-react';
import { getTotalRevenue } from '@/action/get-total-revenue';
import { getSalesCount } from '@/action/get-sales-count';
import { getStockCount } from '@/action/get-stock-count';
import Overview from '@/components/overview';
import { getGraphRevenue } from '@/action/get-graph-revenue';

interface DashboardPageProps {
    params: { storeId: string }
}

// รับ params [storeId]
const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {

    const totalRevenue = await getTotalRevenue(params.storeId);
    const salesCount = await getSalesCount(params.storeId);
    const stockCount = await getStockCount(params.storeId);
    const graphRevenue = await getGraphRevenue(params.storeId);

    // console.log(graphRevenue);

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <Heading title='Dashboard' description='Overview of your store' />
                <Separator />
                <div className='grid gap-4 grid-cols-3'>
                    {/* {CARD 1} */}
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>
                                Total Revenue
                            </CardTitle>
                            <DollarSign className='h-4 w-4 text-muted-foreground' />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>
                                {formatter.format(totalRevenue)}
                            </div>
                        </CardContent>
                    </Card>
                    {/* {CARD 2} */}
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>
                                Sales
                            </CardTitle>
                            <CreditCard className='h-4 w-4 text-muted-foreground' />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>
                                +{salesCount}
                            </div>
                        </CardContent>
                    </Card>
                    {/* {CARD 3} */}
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>
                                Product In Stock
                            </CardTitle>
                            <Package className='h-4 w-4 text-muted-foreground' />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>
                                {stockCount}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Card className='col-span-4'>
                    <CardHeader>
                        <CardTitle>
                            Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Overview data={graphRevenue} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default DashboardPage