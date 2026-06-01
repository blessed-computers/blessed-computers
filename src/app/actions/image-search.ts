"use server";

export async function fetchProductImage(query: string): Promise<string | null> {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const cx = process.env.GOOGLE_SEARCH_ENGINE_ID;

  if (!apiKey || !cx) {
    console.error("Missing Google Search API keys");
    return null;
  }

  try {
    const url = new URL("https://customsearch.googleapis.com/customsearch/v1");
    url.searchParams.append("key", apiKey);
    url.searchParams.append("cx", cx);
    url.searchParams.append("q", query);
    url.searchParams.append("searchType", "image");
    url.searchParams.append("num", "1"); // Only need the top result
    url.searchParams.append("safe", "active");

    const response = await fetch(url.toString());
    if (!response.ok) {
      console.error("Google Custom Search API error", await response.text());
      return null;
    }

    const data = await response.json();
    if (data.items && data.items.length > 0) {
      return data.items[0].link;
    }
  } catch (error) {
    console.error("Error fetching product image:", error);
  }

  return null;
}
