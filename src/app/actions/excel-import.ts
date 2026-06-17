"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import * as XLSX from "xlsx";

type ParsedProduct = {
  name: string;
  price: number;
  type: string;
  company: string;
};

/**
 * Parses an uploaded Excel file and bulk-inserts products into the database.
 * Handles various sheet layouts found in the user's price list.
 */
export async function importExcelFile(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file provided", count: 0 };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });

    const allProducts: ParsedProduct[] = [];

    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      // Get raw JSON rows — header: 1 gives us arrays of values
      const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

      if (!rows || rows.length === 0) continue;

      // The sheet name is used as the default company/category
      const sheetLabel = sheetName.trim();

      const products = parseSheet(rows, sheetLabel);
      allProducts.push(...products);
    }

    if (allProducts.length === 0) {
      return { success: false, error: "No valid products found in the file", count: 0 };
    }

    // Bulk insert using createMany for performance
    const result = await prisma.product.createMany({
      data: allProducts,
      skipDuplicates: true,
    });

    revalidatePath("/");
    revalidatePath("/catalog");
    revalidatePath("/admin");

    return { success: true, count: result.count };
  } catch (error) {
    console.error("Excel import failed:", error);
    return { success: false, error: "Failed to import Excel file", count: 0 };
  }
}

/**
 * Intelligently parses rows from a single sheet.
 * Handles multiple column layouts:
 *   - Simple: Col A = Name, Col B = Price
 *   - RAM-style: Col A = Name, Col B = Brand, Col D = Price
 *   - Quick Heal: Col A = Name, Col F = Price
 */
function parseSheet(rows: any[][], sheetLabel: string): ParsedProduct[] {
  const products: ParsedProduct[] = [];

  // Detect the price column by scanning the first few data rows
  const priceCol = detectPriceColumn(rows);

  for (const row of rows) {
    if (!row || row.length === 0) continue;

    const nameRaw = row[0];
    if (!nameRaw || typeof nameRaw !== "string") continue;

    const name = nameRaw.trim();

    // Skip header-like rows, section headers, or empty names
    if (isHeaderRow(name, sheetLabel)) continue;
    if (name.length < 3) continue;

    // Find the price — try the detected column first, then fall back
    let price = findPrice(row, priceCol);
    if (price === null || price <= 0) continue;

    // Round price to integer
    price = Math.round(price);

    // Extract company from name or sheet label
    const company = extractCompany(name, sheetLabel);
    const type = categorizeProduct(name, sheetLabel);

    products.push({ name, price, type, company });
  }

  return products;
}

/** Detect which column index contains numeric prices */
function detectPriceColumn(rows: any[][]): number {
  // Count how many numeric values appear in each column across data rows
  const colCounts: Record<number, number> = {};

  for (let i = 1; i < Math.min(rows.length, 15); i++) {
    const row = rows[i];
    if (!row) continue;
    for (let col = 1; col < row.length; col++) {
      const val = row[col];
      if (typeof val === "number" && val > 10 && val < 10000000) {
        colCounts[col] = (colCounts[col] || 0) + 1;
      }
    }
  }

  // Return the column with the most numeric hits
  let bestCol = 1;
  let bestCount = 0;
  for (const [col, count] of Object.entries(colCounts)) {
    if (count > bestCount) {
      bestCount = count;
      bestCol = parseInt(col);
    }
  }

  return bestCol;
}

/** Try to extract a valid price from the row */
function findPrice(row: any[], preferredCol: number): number | null {
  // Try the preferred column first
  if (row[preferredCol] !== undefined && row[preferredCol] !== null) {
    const val = row[preferredCol];
    if (typeof val === "number" && val > 0) return val;
    if (typeof val === "string") {
      const parsed = parseFloat(val.replace(/[₹,\s]/g, ""));
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
  }

  // Fall back: scan all columns for a reasonable price
  for (let i = 1; i < row.length; i++) {
    if (i === preferredCol) continue;
    const val = row[i];
    if (typeof val === "number" && val > 0 && val < 10000000) return val;
  }

  return null;
}

/** Check if this row is a header, title, or section divider */
function isHeaderRow(name: string, sheetLabel: string): boolean {
  const lower = name.toLowerCase();

  // Common header keywords
  const headerPatterns = [
    "price list", "product", "june", "dealer", "scheme",
    "total", "upgrade", "festival", // Quick Heal specific stuff we want to keep
  ];

  // Exact header matches
  if (lower === "product" || lower === "price" || lower === "name") return true;
  if (lower.includes("price list")) return true;
  if (lower.includes("june 26") || lower.includes("june 2026")) return true;
  if (lower === "sata" || lower === "nvme single cut" || lower === "m.2 double cut") return true;
  if (lower.startsWith("ddr") && !lower.includes("gb")) return true;
  if (lower === "scheme") return true;

  // Section headers in sheets like IVOOMI, EVM (just category names with no price)
  if (lower.endsWith("ivoomi") && !lower.includes(" ")) return true;

  return false;
}

/** Extract a company name from the product name or sheet label */
function extractCompany(name: string, sheetLabel: string): string {
  const upper = name.toUpperCase();

  const knownBrands = [
    "HP", "DELL", "LENOVO", "ACER", "ASUS", "EPSON", "CANON",
    "LOGITECH", "KYIRO", "IVOOMI", "EVM", "CRUCIAL", "SAMSUNG",
    "HYNIX", "CONSISTENT", "LAPCARE", "D-LINK", "TVS",
    "QUICK HEAL", "WD", "WESTERN DIGITAL", "GIGABYTE", "LG",
    "GEONIX", "AARVEX", "DGOLD", "DAICHI",
  ];

  for (const brand of knownBrands) {
    if (upper.includes(brand)) return brand;
  }

  // Fall back to sheet name as company
  return sheetLabel;
}

/** Categorize the product based on its name and sheet context */
function categorizeProduct(name: string, sheetLabel: string): string {
  const upper = name.toUpperCase();
  const sheetUpper = sheetLabel.toUpperCase();

  // Sheet-based categories
  const sheetCategoryMap: Record<string, string> = {
    "CPU": "CPU",
    "HP TANK": "Printer",
    "MB RAM COMBO": "Motherboard Combo",
    "LAZER HP": "Printer",
    "DIVICE": "Device",
    "PEN DRIVE": "Pen Drive",
    "TINNY DESKTOP": "Desktop",
    "BAREBONE DESKTOP": "Desktop",
    "ASSEBLED DESKTOP": "Desktop",
    "REFURBISHED LAPTOP": "Laptop",
    "MISCELLANEOUS": "Miscellaneous",
    "GIGABYTE MB": "Motherboard",
    "TFT LG": "Monitor",
    "EXTERNAL SSD": "External SSD",
    "LAPCARE": "Accessories",
    "DELL": "Laptop",
    "UPS BATTERY": "UPS",
    "HP PERIPHERALS": "Peripherals",
    "WD HARD DISK": "Hard Disk",
    "EPSON INK": "Ink & Toner",
    "LOGITECH": "Accessories",
    "TVS PRINTER": "Printer",
    "ACER TFT": "Monitor",
    "D-LINK": "Networking",
    "KYIRO": "Accessories",
    "QUICK HEAL": "Software",
    "IVOOMI": "Accessories",
    "ALL SSD": "SSD",
    "RAM": "RAM",
    "EPSON PRINTER": "Printer",
    "EVM": "Accessories",
  };

  if (sheetCategoryMap[sheetUpper]) return sheetCategoryMap[sheetUpper];

  // Name-based fallback
  if (upper.includes("LAPTOP")) return "Laptop";
  if (upper.includes("PRINTER")) return "Printer";
  if (upper.includes("KEYBOARD") || upper.includes("MOUSE")) return "Peripherals";
  if (upper.includes("SSD") || upper.includes("NVME")) return "SSD";
  if (upper.includes("RAM") || upper.includes("DDR")) return "RAM";
  if (upper.includes("MONITOR") || upper.includes("TFT")) return "Monitor";
  if (upper.includes("CABLE") || upper.includes("ADAPTER")) return "Accessories";

  return "Other";
}

/** Delete all products from the database */
export async function deleteAllProducts() {
  try {
    const result = await prisma.product.deleteMany();
    
    revalidatePath("/");
    revalidatePath("/catalog");
    revalidatePath("/admin");

    return { success: true, count: result.count };
  } catch (error) {
    console.error("Failed to delete all products:", error);
    return { success: false, error: "Failed to delete products", count: 0 };
  }
}
