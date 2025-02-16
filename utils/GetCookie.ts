"use server";
import { cookies } from "next/headers";

export const getCookie = async (name: string) => {
  const cookieStore = await cookies();
  const userId: string | undefined = cookieStore.get(name)?.value.trim();
  return userId;
};
