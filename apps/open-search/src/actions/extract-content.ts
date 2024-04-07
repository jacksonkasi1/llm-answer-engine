import cheerio from "cheerio";

// ** import types
import { ContentResult, SearchResult } from "@/types";

/**
 * Fetches content from a URL with a specified timeout.
 * @param {string} url - The URL to fetch.
 * @param {RequestInit} options - Fetch options.
 * @param {number} timeout - Timeout in milliseconds.
 * @returns {Promise<Response>} - The fetch response.
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = 800
): Promise<Response> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    console.log(
      `🚫 Skipping ${url} due to error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    throw error;
  }
}

/**
 * Extracts the main content from HTML using cheerio.
 * @param {string} html - The HTML content.
 * @returns {string} - The extracted main content as text.
 */
function extractMainContent(html: string): string {
  try {
    const $ = cheerio.load(html);
    $("script, style, head, nav, footer, iframe, img").remove(); // Remove unnecessary elements
    const mainContent = $("body").text().replace(/\s+/g, " ").trim(); // Clean up the text
    return mainContent;
  } catch (error) {
    console.error("❌ Error extracting main content:", error);
    throw error;
  }
}

/**
 * Fetches and processes the contents of top 10 search results.
 * @param {SearchResult[]} sources - An array of search result objects.
 * @returns {Promise<ContentResult[]>} - An array of content result objects.
 */
export async function get10BlueLinksContents(
  sources: SearchResult[]
): Promise<ContentResult[]> {
  const promises = sources.map(
    async (source): Promise<ContentResult | null> => {
      try {
        console.log(`🌐 Fetching content for: ${source.link}`);
        const response = await fetchWithTimeout(source.link);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch ${source.link}. Status: ${response.status}`
          );
        }
        const html = await response.text();
        const mainContent = extractMainContent(html);
        console.log(`✅ Successfully processed: ${source.link}`);
        console.log(`📝 Main content: ${mainContent}`);

        return { ...source, html: mainContent }; // 'html' contains the cleaned main content
      } catch (error) {
        console.log(`🚫 Error processing ${source.link}:`, error);
        return null;
      }
    }
  );

  try {
    const results = await Promise.all(promises);
    console.log(`📦 Processed ${results.length} results.`);
    return results.filter((source): source is ContentResult => source !== null);
  } catch (error) {
    console.error(
      "❌ Error fetching and processing blue links contents:",
      error
    );
    throw error;
  }
}
