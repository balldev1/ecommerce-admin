import React from 'react'
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';
import { SettingsForm } from './components/settings-form';


interface SettingsPagesProps {
    params: { storeId: string }
}

// รับ parmas.storeId
const SettingsPages: React.FC<SettingsPagesProps> = async ({ params }) => {

    const { userId } = auth();

    if (!userId) {
        redirect('/sign-in');
    }

    // => prismadb.store === params.storeId,clerk.userId
    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId
        }
    });

    // !== store => '/'
    if (!store) {
        redirect('/');
    }



    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                {/* {ส่งข้อมูล store} */}
                <SettingsForm initialData={store} />
            </div>
        </div>
    )
}

export default SettingsPages