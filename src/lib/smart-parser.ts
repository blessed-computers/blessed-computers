const KNOWN_COMPANIES = [
  "Dell", "HP", "Lenovo", "Canon", "AMD", "Crucial", "Logitech", "JBL", "Apple", "Acer", "Asus", "Epson"
];

const KNOWN_TYPES = [
  "Laptop", "Printer", "CPU", "Components", "Accessories", "Headphones", "Desktop", "Monitor", "Keyboard", "Mouse"
];

export function parseProductInput(rawInput: string) {
  const lowerInput = rawInput.toLowerCase();
  
  // 1. Detect Company
  let detectedCompany = "Custom";
  for (const company of KNOWN_COMPANIES) {
    if (lowerInput.includes(company.toLowerCase())) {
      detectedCompany = company;
      break;
    }
  }

  // 2. Detect Type
  let detectedType = "Accessories";
  for (const type of KNOWN_TYPES) {
    if (lowerInput.includes(type.toLowerCase())) {
      detectedType = type;
      break;
    }
  }

  // 3. Extract Specs (Processors)
  let processor = "";
  const intelMatch = lowerInput.match(/\b(i3|i5|i7|i9)\b/);
  if (intelMatch) {
    processor = `Intel Core ${intelMatch[1].toUpperCase()}`;
  } else if (lowerInput.includes("ryzen")) {
    const ryzenMatch = lowerInput.match(/ryzen\s*(\d)/);
    processor = ryzenMatch ? `AMD Ryzen ${ryzenMatch[1]}` : "AMD Ryzen";
  }

  // 4. Generate Clean Name
  let generatedName = `${detectedCompany} ${detectedType}`;
  if (processor) {
    generatedName += ` with ${processor}`;
  }

  return {
    company: detectedCompany,
    type: detectedType,
    suggestedName: generatedName,
  };
}
