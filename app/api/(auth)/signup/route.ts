import { SignUpFormSchema } from "@/zod";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// export const SignUpFormSchema = z.object({
//   firstname: z
//     .string()
//     .min(3, "must not be lesser than 3 characters")
//     .max(25, "must not be greater than 25 characters")
//     .regex(
//       /^[a-zA-Z0-9_]+$/,
//       "must contain only letters, numbers and underscore (_)"
//     ),
//   lastname: z
//     .string()
//     .min(3, "must not be lesser than 3 characters")
//     .max(25, "must not be greater than 25 characters")
//     .regex(
//       /^[a-zA-Z0-9_]+$/,
//       "must contain only letters, numbers and underscore (_)"
//     ),
//   email: z.string().email("Email must be a valid email address"),
//   password: z
//     .string()
//     .min(8, "must not be lesser than 8 characters")
//     .max(12, "must not be greater than 12 characters")
//     .regex(
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,12}$/,
//       "must be 8-12 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character"
//     ),
// });
type SignUpFormSchemaType = z.infer<typeof SignUpFormSchema>;

export async function POST(request: NextRequest) {
  try {
    const payload: SignUpFormSchemaType = await request.json();
    const validatedData = SignUpFormSchema.safeParse(payload);
    if (!validatedData.success) {
      return NextResponse.json({ error: validatedData.error.errors[0]}, {
        status:400
      });
    }
    return new Response("hello world");
  } catch (error: unknown) {
    console.log("🚀 ~ POST ~ error:", error);
    return NextResponse.json(
      {
        message: "error happened",
        errors: error ? error : "internal server error",
      },
      { status: 400 }
    );
  }
}
