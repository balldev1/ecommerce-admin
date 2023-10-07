'use client';

import { StoreModal } from '@/components/modals/store-modal';
import { useEffect, useState } from 'react';

//จัดการกับการ render ของคอมโพเนนต์ 
// เมือ true => StoreModal จะถูกแสดงผลไม่ให้ StoreModal แสดงผลก่อน
export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <StoreModal />
        </>
    )
}