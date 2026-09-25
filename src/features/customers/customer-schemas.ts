import { z } from "zod";
import { normalizeDigits } from "@/lib/formatters";

const mobile = z.string().transform((value) => normalizeDigits(value).replace(/\D/g, "")).pipe(z.string().regex(/^09\d{9}$/, "شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد."));

export const registerCustomerSchema = z.object({
  firstName: z.string().trim().min(2, "نام باید حداقل ۲ حرف باشد.").max(100),
  lastName: z.string().trim().min(2, "نام خانوادگی باید حداقل ۲ حرف باشد.").max(100),
  mobile,
  password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد.").max(128),
  passwordConfirmation: z.string(),
}).superRefine((values, context) => {
  if (values.password !== values.passwordConfirmation) context.addIssue({ code: "custom", path: ["passwordConfirmation"], message: "تکرار رمز عبور با رمز عبور یکسان نیست." });
});

export const loginCustomerSchema = z.object({ mobile, password: z.string().min(1, "رمز عبور را وارد کنید.").max(128) });
export const updateCustomerProfileSchema = z.object({
  firstName: z.string().trim().min(2, "نام باید حداقل ۲ حرف باشد.").max(100),
  lastName: z.string().trim().min(2, "نام خانوادگی باید حداقل ۲ حرف باشد.").max(100),
});
