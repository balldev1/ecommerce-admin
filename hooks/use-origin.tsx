import { useEffect, useState } from "react"

// components โหลดเสร็จแล้วถึงจะแสดง origin 
// !== ค่าว่าง และ เป็น window.location.origin ? ให้แสดงค่า => ค่าคือ localhost:3000
// ส่งค่า origin
export const useOrigin = () => {
    const [mounted, setMounted] = useState(false);

    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';

    useEffect(() => {
        setMounted(true);
    })

    if (!mounted) {
        return '';
    }

    return origin // ค่า url local host
}