import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getCurrentCustomer } from "@/lib/customer-auth";

export const metadata: Metadata = { title: "ثبت سفارش" };

export default async function CheckoutPage() {
  const customer = await getCurrentCustomer();
  return (
    <>
      <Header />
      <main>
        <CheckoutForm
          customer={
            customer
              ? {
                  firstName: customer.firstName,
                  lastName: customer.lastName,
                  mobile: customer.mobile,
                }
              : null
          }
        />
      </main>
      <Footer />
    </>
  );
}
