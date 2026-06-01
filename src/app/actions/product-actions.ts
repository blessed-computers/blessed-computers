"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getProducts() {
  try {
    return await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export async function addProduct(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const price = parseInt(formData.get("price") as string, 10);
    const type = formData.get("type") as string;
    const company = formData.get("company") as string;
    const description = formData.get("description") as string || undefined;
    const imageUrl = formData.get("imageUrl") as string || undefined;

    if (!name || isNaN(price) || !type || !company) {
      throw new Error("Missing required fields");
    }

    await prisma.product.create({
      data: {
        name,
        price,
        type,
        company,
        description,
        imageUrl,
      }
    });

    // Revalidate pages that display products
    revalidatePath("/");
    revalidatePath("/catalog");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Failed to add product:", error);
    return { success: false, error: "Failed to add product" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id }
    });

    revalidatePath("/");
    revalidatePath("/catalog");
    revalidatePath("/admin");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}
