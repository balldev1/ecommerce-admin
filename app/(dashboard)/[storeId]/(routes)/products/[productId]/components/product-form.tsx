'use client'

import React, { useState } from 'react'
import { Category, Color, Image, Product, Size } from '@prisma/client'
import { Trash } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { AlertModal } from '@/components/modals/alert-modal';
import ImageUpload from '@/components/ui/image-upload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

// กำหนดรูปแบบ name : string 1ตัวอักษรขึ้นไป
const formSchema = z.object({
    name: z.string().min(1),
    images: z.object({ url: z.string() }).array(), // => ใน [] มี url => [ url ]
    price: z.coerce.number().min(1), //=>number
    categoryId: z.string().min(1),
    colorId: z.string().min(1),
    sizeId: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(), // .optional()  เป็นทางเลือก (optional) ไม่จำเป็นต้องมีในอ็อบเจ็กต์ที่ตรงตาม schema นี้.
    isArchived: z.boolean().default(false).optional(), //=>boolean 
});

// รูปแบบ type
type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
    initialData: Product & {
        images: Image[] // => Product และ images
    } | null;
    categories: Category[];
    colors: Color[];
    sizes: Size[];
};

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, categories, colors, sizes }) => {

    // รับ params /local/#params/setting
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Product มีค่า ?
    const title = initialData ? "Edit product" : "Create product";
    const description = initialData ? "Edit a product" : "Add a new product";
    const toastMessage = initialData ? "Product updated." : "Product created.";
    const action = initialData ? "Save Changes" : "Create product";


    // form รูปแบบ form schema
    // ค่า form === {initialData} ที่รับเข้ามา
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            price: parseFloat(String(initialData?.price)),
        } : {
            name: '',
            images: [],
            price: 0,
            categoryId: '',
            colorId: '',
            sizeId: '',
            isFeatured: false,
            isArchived: false,
        } // => product.db
    });

    // api post
    const onSubmit = async (data: ProductFormValues) => {
        try {
            setLoading(true);
            // ถ้า form มีค่า แล้วให้อัพเดท 
            // ถ้าไม่มีค่าให้สร้าง api post
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/products`, data);
            }

            router.refresh(); // => refresh หน้าเว็บ
            router.push(`/${params.storeId}/products`)
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

            await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
            router.refresh();
            router.push(`/${params.storeId}/products`);
            toast.success('Product deleted.');
        } catch (error) {
            toast.error('Something went wrong.');
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
                        name='images' // => form ค่าที่รับ name 
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Background image</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value.map((image) => image.url)}
                                        disabled={loading}
                                        onChange={(url) => field.onChange([...field.value, { url }])} // url ที่ได้รับ
                                        onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])} // ให้เป็นค่าว่าง
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='grid grid-cols-3 gap-8'>
                        {/* {name} */}
                        <FormField
                            control={form.control}
                            name='name' // => form ค่าที่รับ name 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='Product name' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* {Price} */}
                        <FormField
                            control={form.control}
                            name='price' // => form ค่าที่รับ name 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input type='number' disabled={loading} placeholder='9.99' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* {category} */}
                        <FormField
                            control={form.control}
                            name='categoryId' // => form ค่าที่รับ name 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    {/* { select เมือเกิดเหตุการณ์ ให้เก็บค่า value ไว้นำไปใช้ } */}
                                    {/* { field.value แสดงค่าที่ถูกเลือก } */}
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder='Select a category'
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* {size} */}
                        <FormField
                            control={form.control}
                            name='sizeId' // => form ค่าที่รับ name 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Size</FormLabel>
                                    {/* { select เมือเกิดเหตุการณ์ ให้เก็บค่า value ไว้นำไปใช้ } */}
                                    {/* { field.value แสดงค่าที่ถูกเลือก } */}
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder='Select a size'
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sizes.map((size) => (
                                                <SelectItem
                                                    key={size.id}
                                                    value={size.id}
                                                >
                                                    {size.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* {Color} */}
                        <FormField
                            control={form.control}
                            name='colorId' // => form ค่าที่รับ name 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color</FormLabel>
                                    {/* { select เมือเกิดเหตุการณ์ ให้เก็บค่า value ไว้นำไปใช้ } */}
                                    {/* { field.value แสดงค่าที่ถูกเลือก } */}
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder='Select a color'
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {colors.map((color) => (
                                                <SelectItem
                                                    key={color.id}
                                                    value={color.id}
                                                >
                                                    {color.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* {Price} */}
                        <FormField
                            control={form.control}
                            name='isFeatured' // => form ค่าที่รับ name 
                            render={({ field }) => (
                                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border  p-4'>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value} // ใช้ค่าที่เก็บใน field.value ถ้า true ถูกเลือก false ไม่ถูกเลือก
                                            onCheckedChange={field.onChange} // ติดตามค่าที่เกิดขึ้น
                                        />
                                    </FormControl>
                                    <div className='space-y-1  leading-none'>
                                        <FormLabel>
                                            Featured
                                        </FormLabel>
                                        <FormDescription>
                                            This product will appear on the home page
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='isArchived' // => form ค่าที่รับ name 
                            render={({ field }) => (
                                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border  p-4'>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value} // ใช้ค่าที่เก็บใน field.value ถ้า true ถูกเลือก false ไม่ถูกเลือก
                                            onCheckedChange={field.onChange} // ติดตามค่าที่เกิดขึ้น
                                        />
                                    </FormControl>
                                    <div className='space-y-1  leading-none'>
                                        <FormLabel>
                                            Archived
                                        </FormLabel>
                                        <FormDescription>
                                            This product will appear anywhere in the store.
                                        </FormDescription>
                                    </div>
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

