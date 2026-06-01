import { getProducts } from "@/app/actions/product-actions";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const products = await getProducts();
  return <AdminClient products={products} />;
}
