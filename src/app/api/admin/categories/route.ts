import { Prisma } from "@prisma/client";
import { categorySchema } from "@/features/admin/admin-schemas";
import { hasAdminSession, apiError } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { getAdminCategories } from "@/features/admin/admin-catalog-repository";
import { toJsonSafe } from "@/lib/json";
export async function GET() { if (!await hasAdminSession()) return apiError("دسترسی غیرمجاز است.",401,"UNAUTHORIZED"); return Response.json({ok:true,data:toJsonSafe(await getAdminCategories())}); }
export async function POST(request: Request) { if (!await hasAdminSession()) return apiError("دسترسی غیرمجاز است.",401,"UNAUTHORIZED"); const parsed=categorySchema.safeParse(await request.json().catch(()=>null)); if(!parsed.success)return apiError(parsed.error.issues[0]?.message??"اطلاعات دسته‌بندی معتبر نیست.",400,"VALIDATION_ERROR"); try { const d=parsed.data; const category=await prisma.category.create({data:{name:d.name,slug:d.slug,description:d.description,imageUrl:d.image,isActive:d.isActive}}); return Response.json({ok:true,data:{id:category.id}},{status:201}); } catch(error) { return error instanceof Prisma.PrismaClientKnownRequestError&&error.code==="P2002"?apiError("این slug قبلاً استفاده شده است.",409,"DUPLICATE_SLUG"):apiError("ذخیره دسته‌بندی انجام نشد.",500,"DATABASE_ERROR"); } }
