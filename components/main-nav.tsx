'use client';

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

// สามารถรับค่า classname,props เข้ามา htmlattributes 
// เช่น <div id=> <a href=> <div class='HTMLElement'>
//  <MainNav className='mx-6' /> รับ ค่า mx-6 มาใช้
export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {

    //รับค่า pathname,params มาใช้
    const pathname = usePathname();
    const params = useParams();


    const routes = [
        {
            href: `/${params.storeId}`,
            label: 'Overview',
            // pathname === URL ที่กำหนด จะมีค่าเป็น true  !=== false
            active: pathname === `/${params.storeId}`
        },
        {
            href: `/${params.storeId}/billboards`,
            label: 'Billboards',
            // pathname === URL ที่กำหนด จะมีค่าเป็น true  !=== false
            active: pathname === `/${params.storeId}/billboards`
        },
        {
            href: `/${params.storeId}/categories`,
            label: 'Categories',
            // pathname === URL ที่กำหนด จะมีค่าเป็น true  !=== false
            active: pathname === `/${params.storeId}/categories`
        },
        {
            href: `/${params.storeId}/sizes`,
            label: 'Size',
            // pathname === URL ที่กำหนด จะมีค่าเป็น true  !=== false
            active: pathname === `/${params.storeId}/sizes`
        },
        {
            href: `/${params.storeId}/colors`,
            label: 'Colors',
            // pathname === URL ที่กำหนด จะมีค่าเป็น true  !=== false
            active: pathname === `/${params.storeId}/colors`
        },
        {
            href: `/${params.storeId}/products`,
            label: 'Products',
            // pathname === URL ที่กำหนด จะมีค่าเป็น true  !=== false
            active: pathname === `/${params.storeId}/products`
        },
        {
            href: `/${params.storeId}/orders`,
            label: 'Orders',
            // pathname === URL ที่กำหนด จะมีค่าเป็น true  !=== false
            active: pathname === `/${params.storeId}/orders`
        },
        {
            href: `/${params.storeId}/settings`,
            label: 'Settings',
            // pathname === URL ที่กำหนด จะมีค่าเป็น true  !=== false
            active: pathname === `/${params.storeId}/settings`
        }
    ];

    return (
        <nav
            className={cn('flex items-center space-x-4 lg:space-x-6', className)}
        >
            {routes.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn('text-sm font-medium transition-colors hover:text-primary',
                        route.active ? 'text-black dark:text-white' : 'text-muted-foreground')}
                >
                    {route.label}
                </Link>
            ))}
        </nav>
    )
};