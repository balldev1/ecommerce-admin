'use client'

import React, { useState } from 'react'
import { Billboard } from '@prisma/client'
import { Trash } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { AlertModal } from '@/components/modals/alert-modal';
import ImageUpload from '@/components/ui/image-upload';

// กำหนดรูปแบบ name : string 1ตัวอักษรขึ้นไป
const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1)
});

// รูปแบบ type
type BillboardFormValues = z.infer<typeof formSchema>;

interface BillboardProps {
    initialData: Billboard | null;
}

export const BillboardForm: React.FC<BillboardProps> = ({ initialData }) => {

    // รับ params /local/#params/setting
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Billboard มีค่า ?
    const title = initialData ? "Edit billboard" : "Create billboard";
    const description = initialData ? "Edit a billboard" : "Add a new billboard";
    const toastMessage = initialData ? "Billboard updated." : "Billboard created.";
    const action = initialData ? "Save Changes" : "Create billboard";


    // form รูปแบบ form schema
    // ค่า form === {initialData} ที่รับเข้ามา
    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: '',
            imageUrl: ''
        } // => billboard.db
    });

    // api post
    const onSubmit = async (data: BillboardFormValues) => {
        try {
            setLoading(true);
            // ถ้า form มีค่า แล้วให้อัพเดท 
            // ถ้าไม่มีค่าให้สร้าง api post
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/billboards`, data);
            }

            router.refresh(); // => refresh หน้าเว็บ
            router.push(`/${params.storeId}/billboards`)
            toast.success(toastMessage);
        } catch (error) {
            toast.error('Something went wrong.');
        } finally {
            setLoading(false);
        }
    }

    // api delete
    const onDelete = async () => {
        try {
            setLoading(true);

            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
            router.refresh();
            router.push(`/${params.storeId}/billboards`);
            toast.success('Billboard deleted.');
        } catch (error) {
            toast.error('Make sure you removed all categories using this billboard first.');
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }


    return (
        <>
            {/* {Modal} */}
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className='flex items-center justify-between'>
                <Heading
                    title={title}
                    description={description}
                />
                {
                    initialData && (<Button
                        disabled={loading}
                        variant='destructive'
                        size='icon'
                        onClick={() => setOpen(true)}
                    >
                        {/* {lucide icon} */}
                        <Trash className='h-4 w-4' />
                    </Button>)
                }
            </div>
            {/* {แบ่งหมวดหมู่} */}
            <Separator />
            {/* { ui/form } */}
            {/* {การกระจายค่าทั้งหมดของ ...form} */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
                    {/* {upload image} */}
                    <FormField
                        control={form.control}
                        name='imageUrl' // => form ค่าที่รับ name 
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Background image</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value ? [field.value] : []}
                                        disabled={loading}
                                        onChange={(url) => field.onChange(url)} // url ที่ได้รับ
                                        onRemove={() => field.onChange('')} // ให้เป็นค่าว่าง
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField
                            control={form.control}
                            name='label' // => form ค่าที่รับ name 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='Billboard label' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit'>
                        {action}
                    </Button>
                </form>
            </Form>
            <Separator />
        </>
    )
}

