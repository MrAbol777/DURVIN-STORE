import { cookies } from "next/headers";
import { CUSTOMER_SESSION_COOKIE, verifyCustomerSession } from "@/lib/customer-auth";

export async function getCustomerSession() {
  const cookieStore = await cookies();
  return verifyCustomerSession(cookieStore.get(CUSTOMER_SESSION_COOKIE)?.value);
}
