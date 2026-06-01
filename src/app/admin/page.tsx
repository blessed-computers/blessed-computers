import { cookies } from "next/headers";
import { getProducts } from "@/app/actions/product-actions";
import AdminClient from "./AdminClient";
import AdminLogin from "./AdminLogin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("admin_session")?.value === "authenticated";

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const products = await getProducts();
  return <AdminClient products={products} />;
}
