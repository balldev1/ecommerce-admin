'use client';

import * as z from 'zod'; //ใช้สำหรับการตรวจสอบประเภทของข้อมูล

import { useStoreModal } from '@/hooks/use-store-modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';


// name type string ความยาวอย่างน้อย1ตัวอักษร
const formSchema = z.object({
    name: z.string().min(1)
});

export const StoreModal = () => {

    // zustand เปิดปิด
    const storeModal = useStoreModal();

    // เมือกดปุ่ม submit loading จะทำงาน disabled
    const [loading, setLoading] = useState(false);

    // ใช้ zodResolver กับ form เพือตรวจสอบค่าที่รับเข้ามา ตรงกับ(fromSchema)ที่กำหนด
    // ค่า form เริ่มต้นที่รับคือ name = ""
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "", // values
        },
    });

    // เมือกดปุ่ม loading จะทำงาน disabled
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);

            // create stored
            const response = await axios.post('/api/stores', values); // values คือที่รับเข้ามาจาก form 

            // => /respose.data.id
            window.location.assign(`${response.data.id}`) //เอาค่าที่ได้จาก api เปลี่ยนเส้นทางไป /res.data.id
        } catch (error) {
            toast.error('Something went wrong.');
        } finally {
            setLoading(false); // สุดท้าย ผ่านหรือ error ให้ setloading false
        }
    }

    return (
        <Modal
            title='Create store'
            description='Add a new store to manage products and categories'
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}
        >
            <div className='space-y-4 py-2 pb-4'>
                <Form  {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='E-Commerce' {...field} />
                                    </FormControl>
                                    {/* แจ้งเตือนเมือไม่ใส่ข้อมูลตามที่กำหนด */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
                            <Button
                                disabled={loading}
                                variant='outline'
                                onClick={storeModal.onClose}>
                                Cancel
                            </Button>
                            <Button
                                disabled={loading}
                                type='submit'
                            >Continue</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </Modal >
    );
};