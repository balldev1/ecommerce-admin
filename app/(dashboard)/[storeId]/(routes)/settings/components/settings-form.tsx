'use client'

import React, { useState } from 'react'
import { Store } from '@prisma/client'
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
import { ApiAlert } from '@/components/ui/api-alert';
import { useOrigin } from '@/hooks/use-origin';

interface SettingsFormProps {
    initialData: Store;
}

// กำหนดรูปแบบ name : string 1ตัวอักษรขึ้นไป
const formSchema = z.object({
    name: z.string().min(1),
});

// รูปแบบ type
type SettingsFormValues = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {

    // รับ params /local/#params/setting
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // form รูปแบบ form schema
    // ค่า form === {initialData} ที่รับเข้ามา
    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData // => store.name
    });

    // api patch
    // รับค่า data จาก form เพื่อ api patch อัพเดทข้อมูล
    const onSubmit = async (data: SettingsFormValues) => {
        try {
            setLoading(true);

            await axios.patch(`/api/stores/${params.storeId}`, data); // => data === 'name' => form
            router.refresh(); // => refresh หน้าเว็บ
            toast.success('Store updated.');
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

            await axios.delete(`/api/stores/${params.storeId}`);
            router.refresh();
            router.push('/');
            toast.success('Store deleted.');
        } catch (error) {
            toast.error('Make sure you removed all products and categories first.');
        } finally {
            setLoading(false);
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
                    title='Settings'
                    description='Manage store preferences'
                />
                <Button
                    disabled={loading}
                    variant='destructive'
                    size='icon'
                    onClick={() => setOpen(true)}
                >
                    {/* {lucide icon} */}
                    <Trash className='h-4 w-4' />
                </Button>
            </div>
            {/* {แบ่งหมวดหมู่} */}
            <Separator />
            {/* { ui/form } */}
            {/* {การกระจายค่าทั้งหมดของ ...form} */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField
                            control={form.control}
                            name='name' // => form ค่าที่รับ name 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='Store name' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit'>
                        Save Changes
                    </Button>
                </form>
            </Form>
            <Separator />
            <ApiAlert
                title='NEXT_PUBLIC_API_URL'
                description={`${origin}/api/${params.storeId}`}
                variant='public' />
        </>
    )
}

