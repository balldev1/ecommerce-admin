import { authMiddleware } from "@clerk/nextjs";

// ต้อง login ก่อน ถ้าไม่ login ให้ไปหน้า login
// จำกัดการเข้าถึงให้ผู้ใช้ที่ล็อกอินเท่านั้น.
export default authMiddleware({
    publicRoutes: ["/api/:path*"], // api
});

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
