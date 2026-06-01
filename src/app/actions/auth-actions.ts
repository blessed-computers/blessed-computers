"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function verifyAdminPassword(password: string) {
  const correctPassword = process.env.ADMIN_PASSWORD || "blessed";

  if (password === correctPassword) {
    // Set a secure, HTTP-only cookie that expires in 1 day
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });
    
    revalidatePath("/admin");
    return { success: true };
  }

  return { success: false, error: "Incorrect password" };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  revalidatePath("/admin");
  return { success: true };
}
