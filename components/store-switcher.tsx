'use client'
import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from 'lucide-react'; // libary icon
import { useState } from "react";
import { Store } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

import { PopoverTrigger, Popover, PopoverContent } from "@/components/ui/popover"; // ui.shadcn popover
import { useStoreModal } from "@/hooks/use-store-modal";
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';


// กำหนดชนิดข้อมูลเป็น typeof PopoverTrigger ui.shadcn popover
type PopoverTriggerProps = React.ComponentPropsWithRef<typeof PopoverTrigger>

// SwitcherProps => props จะมีทุกค่าของ => PopoverTriggerProps
//  สืบทอด  คุณสมบัติ PopoverTrigger =>ui.shadcn popover
interface StoreSwitcherProps extends PopoverTriggerProps {
    items: Store[]; //=> จากฐานข้อมูล store
}

// items ค่าที่ได้จาก interface : store[];
export default function StoreSwitcher({ className, items = [] }: StoreSwitcherProps) {

    // zustand เปิดปิด modal
    const storeModal = useStoreModal();
    const params = useParams();
    const router = useRouter();

    // รับค่า item ค่าจาก store[]
    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id
    }));

    // หา value ที่เท่ากับ params.storeId ปัจจุบัน แล้วเก็บไว้ที่  currenStore
    const currenStore = formattedItems.find((item) => item.value === params.storeId)

    // เปิดปิด popover
    const [open, setOpen] = useState(false);

    // เมือเลือกแล้วให้ไปเส้นทาง 
    const onStoreSelect = (store: { value: string, label: string }) => {
        setOpen(false);
        router.push(`/${store.value}`);
    }

    return (
        //ui popover
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    size='sm'
                    role='combobox'
                    aria-expanded={open}
                    aria-label='Select a store'
                    className={cn('w-[200px] justify-between', className)}
                >
                    <StoreIcon className='mr-2 h-4 w-4' />
                    {currenStore?.label}
                    <ChevronsUpDown className='ml-auto h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            {/* {กล่อง select ที่เก็บ command} */}
            <PopoverContent className='w-[200px] p-0'>
                {/* {ui command} */}
                <Command>
                    {/* {1} */}
                    <CommandList>
                        {/* {input search} */}
                        <CommandInput placeholder='Search store...' />
                        {/* {ถ้าไม่มีค่า} */}
                        <CommandEmpty>
                            No store found.
                        </CommandEmpty>
                        {/* {heading stores} */}
                        <CommandGroup heading='Stores'>
                            {/* {store.item} */}
                            {
                                formattedItems.map((store) => (
                                    <CommandItem
                                        key={store.value} // => id store
                                        onSelect={() => onStoreSelect(store)}
                                        className='text-sm'
                                    >
                                        <StoreIcon className='mr-2 h-4 w-4' />
                                        {store.label}
                                        <Check className={cn('ml-auto h-4 w-4',
                                            currenStore?.value === store.value // ค่าปัจจุบัน === ค่าที่รับเข้ามา ?
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                        )} />
                                    </CommandItem>
                                ))
                            }
                        </CommandGroup>
                    </CommandList>
                    {/* {2 storeModal.onOpen} */}
                    <CommandList>
                        <CommandGroup>
                            <CommandItem
                                onSelect={() => {
                                    setOpen(false);
                                    storeModal.onOpen();
                                }}
                            >
                                <PlusCircle className='mr-2 h-5 w-5' />
                                Create Store
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};