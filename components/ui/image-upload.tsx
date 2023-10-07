'use client'

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from 'next-cloudinary'

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string[]; // => value === url รูปภาพที่เป็น string
}

// upload image bill board
const ImageUpload: React.FC<ImageUploadProps> = ({ disabled, onChange, onRemove, value }) => {

    // ให้  โหลดเสร็จก่อน ถึงจะแสดง components
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    if (!isMounted) {
        return null;
    }

    // => เมืออัพโหลดภาพเข้า cloud ดึง string url รูปภาพเก็บไว้ที่ฐานข้อมูล
    const onUpload = (result: any) => {
        onChange(result.info.secure_url);
    }

    return (
        <div>
            <div className="mb-4 flex items-center gap-4">
                {value.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md  overflow-hidden">
                        <div className="z-10 absolute  top-2 right-2">
                            <Button type='button' onClick={() => onRemove(url)} variant='destructive' size='icon'>
                                {/* {icon} */}
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                        <Image
                            fill
                            className="object-cover"
                            alt='Image'
                            src={url}
                        />
                    </div>
                ))}
            </div>
            <CldUploadWidget onUpload={onUpload} uploadPreset='dpr5cris'>
                {({ open }) => {
                    const onClick = () => {
                        open();
                    }

                    return (
                        <Button
                            type='button'
                            disabled={disabled}
                            variant='secondary'
                            onClick={onClick}
                        >
                            {/* {icon} */}
                            <ImagePlus className="h-4 w-4 mr-2" />
                            Upload an Image
                        </Button>
                    )
                }}
            </CldUploadWidget>
        </div>
    )
}

export default ImageUpload;