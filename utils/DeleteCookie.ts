"use server";
import { cookies } from "next/headers";

export const deleteCookie = async (name: string) => {
  const cookieStore = await cookies();

  if (name === "all") {
    const allCookies = cookieStore.getAll();
    allCookies.forEach((cookie) => cookieStore.delete(cookie.name));
  } else {
    cookieStore.delete(name);
  }

  return;
};
