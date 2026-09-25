import type { PaymentProvider, PaymentRequest, PaymentResult } from "@/features/payments/payment-provider";

export class MockPaymentProvider implements PaymentProvider {
  async process(request: PaymentRequest): Promise<PaymentResult> {
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    return {
      status: request.outcome,
      reference: `MOCK-${request.orderNumber.slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`,
    };
  }
}

export const mockPaymentProvider = new MockPaymentProvider();
