"use client";

import { useState, useEffect } from "react";
import { parseProductInput } from "@/lib/smart-parser";
import { addProduct, deleteProduct } from "@/app/actions/product-actions";
import { Trash2, Sparkles, Loader2, ImagePlus, ExternalLink } from "lucide-react";

export default function AdminClient({ products }: { products: any[] }) {
  const [rawInput, setRawInput] = useState("");
  const [parsedData, setParsedData] = useState({ name: "", type: "", company: "" });
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSmartParse = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setRawInput(text);
    if (text.trim().length > 2) {
      const parsed = parseProductInput(text);
      setParsedData({
        name: parsed.suggestedName,
        type: parsed.type,
        company: parsed.company
      });
    } else {
      setParsedData({ name: "", type: "", company: "" });
    }
  };

  const uploadImageToCloudinary = async (fileOrUrl: File | string) => {
    const formData = new FormData();
    formData.append("file", fileOrUrl);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "Blessed-Computers");

    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dllu596y4"}/image/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.secure_url;
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let imageUrl = "";
    if (imageFile) {
      try {
        imageUrl = await uploadImageToCloudinary(imageFile);
      } catch (err) {
        console.error("Failed to upload image", err);
        alert("Image upload to Cloudinary failed.");
        setIsSubmitting(false);
        return;
      }
    }

    const formData = new FormData();
    formData.append("name", parsedData.name || rawInput);
    formData.append("type", parsedData.type || "Other");
    formData.append("company", parsedData.company || "Other");
    formData.append("price", price);
    if (imageUrl) formData.append("imageUrl", imageUrl);
    
    await addProduct(formData);
    
    // Reset form
    setRawInput("");
    setParsedData({ name: "", type: "", company: "" });
    setPrice("");
    setImageFile(null);
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-brand-cream)] px-4 py-8 text-[var(--color-brand-black)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-brand-black)]">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm text-[var(--color-brand-muted)]">
            Manage your product catalog. Use the Smart Entry tool to quickly add products.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Product Form */}
          <div className="lg:col-span-1">
            <div className="rounded-[var(--radius-brand)] border border-[var(--color-brand-border)] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-[var(--color-brand-gold)]" />
                <h2 className="text-xl font-bold text-[var(--color-brand-charcoal)]">Smart Entry</h2>
              </div>
              
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-brand-charcoal)] mb-1">
                    Describe Product
                  </label>
                  <input
                    type="text"
                    required
                    value={rawInput}
                    onChange={handleSmartParse}
                    placeholder="e.g. laptop of dell i5"
                    className="w-full rounded-md border border-[var(--color-brand-border)] px-3 py-2 text-sm outline-none focus:border-[var(--color-brand-red)] transition-colors"
                  />
                  <p className="text-xs text-[var(--color-brand-muted)] mt-1">
                    Type naturally. We'll extract the details.
                  </p>
                </div>

                <div className="rounded-md bg-[var(--color-brand-cream)] p-3 space-y-2 border border-[var(--color-brand-border)]">
                  <div>
                    <label className="text-xs font-semibold text-[var(--color-brand-muted)]">Parsed Name</label>
                    <input 
                      type="text"
                      value={parsedData.name}
                      onChange={(e) => setParsedData({...parsedData, name: e.target.value})}
                      className="w-full bg-white rounded px-2 py-1 text-sm border border-[var(--color-brand-border)] outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-xs font-semibold text-[var(--color-brand-muted)]">Category</label>
                      <input 
                        type="text"
                        value={parsedData.type}
                        onChange={(e) => setParsedData({...parsedData, type: e.target.value})}
                        className="w-full bg-white rounded px-2 py-1 text-sm border border-[var(--color-brand-border)] outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-semibold text-[var(--color-brand-muted)]">Company</label>
                      <input 
                        type="text"
                        value={parsedData.company}
                        onChange={(e) => setParsedData({...parsedData, company: e.target.value})}
                        className="w-full bg-white rounded px-2 py-1 text-sm border border-[var(--color-brand-border)] outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--color-brand-charcoal)] mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 45000"
                    className="w-full rounded-md border border-[var(--color-brand-border)] px-3 py-2 text-sm outline-none focus:border-[var(--color-brand-red)] transition-colors"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-[var(--color-brand-charcoal)] flex items-center gap-2">
                      <ImagePlus className="h-4 w-4" /> Product Image
                    </label>
                    {parsedData.name && (
                      <a 
                        href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(parsedData.name)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs flex items-center gap-1 font-semibold text-[var(--color-brand-red)] hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" /> Find Image
                      </a>
                    )}
                  </div>
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="w-full text-sm text-[var(--color-brand-muted)]
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-[var(--radius-brand)] file:border-0
                      file:text-sm file:font-semibold
                      file:bg-[var(--color-brand-cream)] file:text-[var(--color-brand-charcoal)]
                      hover:file:bg-[var(--color-brand-border)] cursor-pointer"
                  />
                  {parsedData.name && (
                    <p className="text-xs text-[var(--color-brand-muted)] mt-2">
                      Click "Find Image" above, save a picture, and upload it here.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !rawInput || !price}
                  className="w-full rounded-[var(--radius-brand)] bg-[var(--color-brand-red)] px-4 py-2 text-sm font-bold text-white hover:bg-[#a01a1a] transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isSubmitting ? "Uploading & Saving..." : "Add Product"}
                </button>
              </form>
            </div>
          </div>

          {/* Product List */}
          <div className="lg:col-span-2">
            <div className="rounded-[var(--radius-brand)] border border-[var(--color-brand-border)] bg-white overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[var(--color-brand-cream)] border-b border-[var(--color-brand-border)]">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-[var(--color-brand-charcoal)]">Image</th>
                      <th className="px-4 py-3 font-semibold text-[var(--color-brand-charcoal)]">Name</th>
                      <th className="px-4 py-3 font-semibold text-[var(--color-brand-charcoal)]">Category</th>
                      <th className="px-4 py-3 font-semibold text-[var(--color-brand-charcoal)]">Price</th>
                      <th className="px-4 py-3 font-semibold text-right text-[var(--color-brand-charcoal)]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-brand-border)]">
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-[var(--color-brand-muted)]">
                          No products in the database.
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product.id} className="hover:bg-[var(--color-brand-cream)] transition-colors">
                          <td className="px-4 py-3">
                            {product.imageUrl ? (
                              <img src={product.imageUrl} alt={product.name} className="h-10 w-10 object-cover rounded-md border border-[var(--color-brand-border)]" />
                            ) : (
                              <div className="h-10 w-10 bg-[var(--color-brand-cream)] rounded-md border border-[var(--color-brand-border)] flex items-center justify-center">
                                <span className="text-[10px] text-[var(--color-brand-muted)]">No img</span>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 font-medium text-[var(--color-brand-black)]">{product.name}</td>
                          <td className="px-4 py-3 text-[var(--color-brand-muted)]">
                            {product.company} • {product.type}
                          </td>
                          <td className="px-4 py-3 font-bold text-[var(--color-brand-black)]">₹{product.price.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="h-5 w-5 inline" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
