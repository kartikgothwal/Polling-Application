import dbConnect from "@/config/dbConnect";
import { UserModel } from "@/schema/users";
import { JwtGenerator } from "@/utils/JwtGenerator";
import { SignUpFormSchema } from "@/zod";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { IUsersSchema } from "@/types";
import { cookies } from "next/headers";
import { handleError } from "@/utils/ErrorHandler";
type SignUpFormSchemaType = z.infer<typeof SignUpFormSchema>;

export async function POST(request: NextRequest) {
  try {
    const payload: SignUpFormSchemaType = await request.json();
    const validatedData = SignUpFormSchema.safeParse(payload);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.errors[0] },
        {
          status: 400,
        }
      );
    }
    await dbConnect();
    const isExisted = await UserModel.findOne({ email: payload.email });
    if (!!isExisted) {
      return handleError(
        new Error("User with this email already exits"),
        "",
        401
      );
    }

    const hashPassword = bcrypt.hashSync(payload.password, 10);
    const NewUsers: IUsersSchema = new UserModel({
      ...payload,
      password: hashPassword,
    });
    const token: string = JwtGenerator(NewUsers.email);
    NewUsers.password = hashPassword;
    const cookieStore = await cookies();
    cookieStore.set("token", token, { secure: true, httpOnly: true });
    cookieStore.set("userId", NewUsers._id.toString(), {
      secure: true,
      httpOnly: true,
    });
    const user = await NewUsers.save();
    return NextResponse.json(
      { message: "Account Successfully Created", user: user },
      {
        status: 201,
      }
    );
  } catch (error: unknown) {
    return handleError(error, "Internal Server Error", 500);
  }
}
