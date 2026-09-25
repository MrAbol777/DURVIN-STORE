import { getCurrentCustomer } from "@/lib/customer-auth";
import { HeaderClient } from "@/components/layout/header-client";

export async function Header() {
  const customer = await getCurrentCustomer();
  return <HeaderClient customer={customer ? { fullName: `${customer.firstName} ${customer.lastName}` } : null} />;
}
