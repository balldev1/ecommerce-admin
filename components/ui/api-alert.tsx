import { Copy, Server } from "lucide-react";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";


interface ApiAlertProps {
    title: string;
    description: string;
    variant: 'public' | 'admin',// เช็คว่า variant ที่รับเข้ามาคืออะไร ให้แสดงค่า Record ที่บันทึกไว้ ของ public / admin

};

// บันทึกค่า variant string ระหว่าง public , admin
const textMap: Record<ApiAlertProps["variant"], string> = {
    public: 'Public',
    admin: 'Admin'
};

// บันทึกค่า variant string ของ public,admin ระหว่าง secondary , destructive
const variantMap: Record<ApiAlertProps['variant'], BadgeProps['variant']> = {
    public: 'secondary',
    admin: 'destructive'
}

export const ApiAlert: React.FC<ApiAlertProps> = ({ title, description, variant = "public" }) => {


    const onCopy = (description: string) => {
        // คัดลอกข้อความ
        navigator.clipboard.writeText(description);
        toast.success('API Route copied to the clipboard');
    }

    return (
        <Alert>
            {/* {icon lucide} */}
            <Server className="h-4 w-4" />
            <AlertTitle className="flex items-center gap-x-2">
                {title}
                <Badge variant={variantMap[variant]}>
                    {textMap[variant]}
                </Badge>
            </AlertTitle>
            <AlertDescription className="mt-4 flex items-center justify-between">
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono  text-sm font-semibold">
                    {/* {onCopy} */}
                    {description}
                </code>
                <Button variant='outline' size='icon' onClick={() => onCopy(description)}>
                    {/* {icon lucide} */}
                    <Copy className="h-4 w-4" />
                </Button>
            </AlertDescription>
        </Alert>
    )
}