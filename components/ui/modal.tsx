'use client';

import {
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogContent,
    DialogDescription
} from "@/components/ui/dialog"; //ui shadcn


interface ModalProps {
    title: string;
    description: string;
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
}

// Modal
export const Modal: React.FC<ModalProps> = ({ title, description, isOpen, onClose, children }) => {
    //ใช้เพื่อตรวจสอบเมื่อ Dialog เปิดหรือปิด
    // เมือค่าที่รับเข้ามา false  ให้ปิด onClose
    const onChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    };

    return (
        // true เปิด false ปิด
        <Dialog open={isOpen} onOpenChange={onChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <div>
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    )
}