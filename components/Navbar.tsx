
import React from 'react'
import { UserButton, auth } from '@clerk/nextjs';
import StoreSwitcher from '@/components/store-switcher';
import { MainNav } from '@/components/main-nav';
import { redirect } from 'next/navigation';
import prismadb from '@/lib/prismadb';
import { ThemeToggle } from './theme-toggle';

const Navbar = async () => {

    const { userId } = auth(); //clerk

    if (!userId) {
        redirect('/sign-in')
    }

    // store => findMany => userId ส่งข้อมูลไป components <StoreSwitcher/>
    const stores = await prismadb.store.findMany({
        where: {
            userId
        }
    })

    return (
        <div className='border-b'>
            <div className='flex h-16 items-center px-4'>
                <StoreSwitcher items={stores} />
                <MainNav className='mx-6' />
                <div className='ml-auto flex items-center space-x-4'>
                    <ThemeToggle />
                    {/* {clerk => sign out => '/'} */}
                    <UserButton afterSignOutUrl='/' />
                </div>
            </div>
        </div>
    )
}

export default Navbar;