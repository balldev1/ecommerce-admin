'use client';

import { useState } from "react";
import { CategoryColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { AlertModal } from "@/components/modals/alert-modal";

interface CellActionProps {
    data: CategoryColumn;
};

export const CellAction: React.FC<CellActionProps> = ({ data }) => {

    const router = useRouter();
    const params = useParams();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    console.log(open)

    const onCopy = (id: string) => {
        // คัดลอกข้อความ
        navigator.clipboard.writeText(id);
        toast.success('Category Id copied to the clipboard');
    }

    const onConfirm = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/categories/${data.id}`);
            router.refresh();
            toast.success('Category deleted.');
        } catch (error) {
            toast.error('Make sure you removed all products using this category first.');
        } finally {
            setOpen(false);
            setLoading(false);
        }
    };

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onConfirm}
                loading={loading}

            />
            <DropdownMenu>
                {/* {asChild ไม่ wrap child components ด้วยองค์ประกอบอื่น.ไม่คลุม Button} */}
                <DropdownMenuTrigger asChild>
                    <Button variant='ghost' className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        {/* {icon} */}
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onCopy(data.id)}>
                        {/* {icon} */}
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Id
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/categories/${data.id}`)}>
                        {/* {icon} */}
                        <Edit className="mr-2 h-4 w-4" />
                        Update
                    </DropdownMenuItem>
                </DropdownMenuContent>
                <Button className="ml-2"
                    disabled={loading}
                    variant='destructive'
                    size='icon'
                    onClick={() => setOpen(true)}
                >
                    {/* {lucide icon} */}
                    <Trash className='h-4 w-4' />
                </Button>
            </DropdownMenu>
        </>
    )
}