"use client";

import { useState, useEffect } from "react";
import { parseProductInput } from "@/lib/smart-parser";
import { addProduct, deleteProduct } from "@/app/actions/product-actions";
import { importExcelFile, deleteAllProducts } from "@/app/actions/excel-import";
import { Trash2, Sparkles, Loader2, Upload, FileSpreadsheet, AlertTriangle } from "lucide-react";

export default function AdminClient({ products }: { products: any[] }) {
  const [rawInput, setRawInput] = useState("");
  const [parsedData, setParsedData] = useState({ name: "", type: "", company: "" });
  const [price, setPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Excel upload state
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", parsedData.name || rawInput);
    formData.append("type", parsedData.type || "Other");
    formData.append("company", parsedData.company || "Other");
    formData.append("price", price);
    
    await addProduct(formData);
    
    // Reset form
    setRawInput("");
    setParsedData({ name: "", type: "", company: "" });
    setPrice("");
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
    }
  };

  const handleExcelImport = async () => {
    if (!excelFile) return;
    setIsImporting(true);
    setImportResult(null);

    const formData = new FormData();
    formData.append("file", excelFile);

    const result = await importExcelFile(formData);

    if (result.success) {
      setImportResult({ success: true, message: `Successfully imported ${result.count} products!` });
      setExcelFile(null);
      // Reset the file input
      const fileInput = document.getElementById("excel-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } else {
      setImportResult({ success: false, message: result.error || "Import failed" });
    }
    setIsImporting(false);
  };

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    const result = await deleteAllProducts();
    if (result.success) {
      setImportResult({ success: true, message: `Deleted ${result.count} products.` });
    } else {
      setImportResult({ success: false, message: result.error || "Delete failed" });
    }
    setShowDeleteConfirm(false);
    setIsDeleting(false);
  };

  return (
    <main className="min-h-screen bg-[var(--color-brand-cream)] px-4 py-8 text-[var(--color-brand-black)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-brand-black)]">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm text-[var(--color-brand-muted)]">
            Manage your product catalog. Use Smart Entry or bulk-import from an Excel file.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Forms */}
          <div className="lg:col-span-1 space-y-6">

            {/* Excel Import Card */}
            <div className="rounded-[var(--radius-brand)] border border-[var(--color-brand-border)] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <FileSpreadsheet className="h-5 w-5 text-green-600" />
                <h2 className="text-xl font-bold text-[var(--color-brand-charcoal)]">Excel Import</h2>
              </div>

              <p className="text-xs text-[var(--color-brand-muted)] mb-4">
                Upload your price list Excel file (.xlsx) to bulk-import all products at once.
              </p>

              <div className="space-y-3">
                <input
                  id="excel-upload"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => {
                    setExcelFile(e.target.files?.[0] || null);
                    setImportResult(null);
                  }}
                  className="w-full text-sm text-[var(--color-brand-muted)]
                    file:mr-3 file:py-2 file:px-4
                    file:rounded-[var(--radius-brand)] file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-50 file:text-green-700
                    hover:file:bg-green-100 cursor-pointer"
                />

                {excelFile && (
                  <div className="text-xs text-[var(--color-brand-charcoal)] bg-green-50 px-3 py-2 rounded-md border border-green-200">
                    📄 <strong>{excelFile.name}</strong> ({(excelFile.size / 1024).toFixed(1)} KB)
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleExcelImport}
                  disabled={!excelFile || isImporting}
                  className="w-full rounded-[var(--radius-brand)] bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Import Products
                    </>
                  )}
                </button>

                {importResult && (
                  <div className={`text-sm font-semibold px-3 py-2 rounded-md ${
                    importResult.success 
                      ? "text-green-700 bg-green-50 border border-green-200" 
                      : "text-red-700 bg-red-50 border border-red-200"
                  }`}>
                    {importResult.message}
                  </div>
                )}
              </div>

              {/* Danger Zone */}
              <div className="mt-5 pt-4 border-t border-[var(--color-brand-border)]">
                <p className="text-xs font-semibold text-red-500 mb-2 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Danger Zone
                </p>
                {showDeleteConfirm ? (
                  <div className="space-y-2">
                    <p className="text-xs text-[var(--color-brand-muted)]">
                      This will delete <strong>ALL {products.length}</strong> products. Are you sure?
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleDeleteAll}
                        disabled={isDeleting}
                        className="flex-1 rounded-[var(--radius-brand)] bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-1"
                      >
                        {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                        Yes, Delete All
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 rounded-[var(--radius-brand)] bg-[var(--color-brand-cream)] px-3 py-1.5 text-xs font-bold text-[var(--color-brand-charcoal)] hover:bg-[var(--color-brand-border)] transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full rounded-[var(--radius-brand)] border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Delete All Products ({products.length})
                  </button>
                )}
              </div>
            </div>

            {/* Smart Entry Card */}
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

                <button
                  type="submit"
                  disabled={isSubmitting || !rawInput || !price}
                  className="w-full rounded-[var(--radius-brand)] bg-[var(--color-brand-red)] px-4 py-2 text-sm font-bold text-white hover:bg-[#a01a1a] transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isSubmitting ? "Saving..." : "Add Product"}
                </button>
              </form>
            </div>
          </div>

          {/* Product List */}
          <div className="lg:col-span-2">
            <div className="rounded-[var(--radius-brand)] border border-[var(--color-brand-border)] bg-white overflow-hidden shadow-sm">
              <div className="px-4 py-3 bg-[var(--color-brand-cream)] border-b border-[var(--color-brand-border)] flex items-center justify-between">
                <h3 className="font-bold text-[var(--color-brand-charcoal)]">
                  All Products ({products.length})
                </h3>
              </div>
              <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[var(--color-brand-cream)] border-b border-[var(--color-brand-border)] sticky top-0">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-[var(--color-brand-charcoal)]">Name</th>
                      <th className="px-4 py-3 font-semibold text-[var(--color-brand-charcoal)]">Category</th>
                      <th className="px-4 py-3 font-semibold text-[var(--color-brand-charcoal)]">Price</th>
                      <th className="px-4 py-3 font-semibold text-right text-[var(--color-brand-charcoal)]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-brand-border)]">
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-[var(--color-brand-muted)]">
                          No products in the database. Import an Excel file or add products manually.
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product.id} className="hover:bg-[var(--color-brand-cream)] transition-colors">
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
