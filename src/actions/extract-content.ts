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
  timeout = 1800
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
      `🚫 Skipping ${url} due to error:\n${
        error instanceof Error ? error.message : "Timeout or network issue"
      }`
    );
    throw new Error(
      `Fetch failed for ${url}:\n${
        error instanceof Error ? error.message : "Timeout or network issue"
      }`
    );
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
    $("script, style, head, nav, footer, iframe, img").remove();
    const mainContent = $("body").text().replace(/\s+/g, " ").trim();
    return mainContent;
  } catch (error) {
    console.error(
      `❌ Error extracting main content for HTML content:\n${error}`
    );
    throw new Error("Content extraction failed.");
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
          throw new Error(`HTTP status ${response.status}`);
        }
        const html = await response.text();
        const mainContent = extractMainContent(html);
        console.log(`✅ Successfully processed: ${source.link}`);
        return { ...source, html: mainContent };
      } catch (error) {
        console.log(
          `🚫 Error with ${source.link}:\n${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );

        return null;
      }
    }
  );

  try {
    const results = await Promise.all(promises);

    const filterResults = results.filter(
      (source): source is ContentResult => source !== null
    );

    console.log(`📦 Processed ${filterResults.length} results.`);
    return filterResults;
  } catch (error) {
    console.error(
      `❌ General error in processing. See logs for each URL:\n${error}`
    );
    throw new Error("Processing failed for one or more sources.");
  }
}
