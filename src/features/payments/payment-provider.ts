export type PaymentStatus = "pending" | "successful" | "failed" | "cancelled";
export type MockPaymentOutcome = Exclude<PaymentStatus, "pending">;

export type PaymentRequest = {
  amountRials: number;
  orderNumber: string;
  outcome: MockPaymentOutcome;
};

export type PaymentResult = {
  status: Exclude<PaymentStatus, "pending">;
  reference: string;
};

export interface PaymentProvider {
  process(request: PaymentRequest): Promise<PaymentResult>;
}
