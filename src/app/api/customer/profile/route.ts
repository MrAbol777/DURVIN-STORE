import { updateCustomerProfileSchema } from "@/features/customers/customer-schemas";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  const customer = await getCurrentCustomer();
  if (!customer) return Response.json({ message: "برای انجام این کار وارد حساب کاربری شوید." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const result = updateCustomerProfileSchema.safeParse(body);
  if (!result.success) return Response.json({ message: result.error.issues[0]?.message ?? "اطلاعات پروفایل معتبر نیست." }, { status: 400 });

  const updatedCustomer = await prisma.customer.update({
    where: { id: customer.id },
    data: result.data,
    select: { firstName: true, lastName: true, mobile: true },
  });
  return Response.json({ ok: true, customer: updatedCustomer });
}
