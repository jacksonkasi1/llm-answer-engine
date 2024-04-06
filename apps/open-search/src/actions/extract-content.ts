import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import TurndownService from "turndown";

// ** import types
import { ContentResult, SearchResult } from "@/types";

// Helper function to create a timeout promise
const timeoutPromise = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms, null));

export const getMarkdownFromUrl = async (
  url: string
): Promise<string | null> => {
  try {
    // Create a fetch promise
    const fetchPromise = fetch(url).then(async (response) => {
      if (!response.ok) {
        console.error("🚫 Failed to fetch the URL: ", url);
        return null;
      }
      const downloadedPage = await response.text();
      const doc = new JSDOM(downloadedPage, { url });
      const reader = new Readability(doc.window.document);
      const article = reader.parse();
      const html = article?.content;
      if (!html) {
        console.error("📄 Failed to extract article content: ", url);
        return null;
      }
      const turndownService = new TurndownService({
        headingStyle: "atx",
      });
      return turndownService.turndown(html);
    });

    // Race the fetch operation against a timeout
    const result = await Promise.race([
      fetchPromise,
      timeoutPromise(800), // Set timeout to 800ms
    ]);

    // If the result is null, it's either a timeout or fetch failed early
    if (!result) {
      console.log("⏰ Fetch operation timed out or failed: ", url);
      return null;
    }

    console.log({ result });

    return result as string;
  } catch (error) {
    console.error("❌ An error occurred with URL: ", url, error);
    return null;
  }
};

export async function get10BlueLinksMarkdown(
  sources: SearchResult[]
): Promise<ContentResult[]> {
  console.log("🕸️ Scraping top 10 web from sources");

  const promises = sources.map(
    async (source): Promise<ContentResult | null> => {
      const markdown = await getMarkdownFromUrl(source.link);
      if (!markdown) {
        console.log("🚫 Skipped URL due to errors: ", source.link);
        return null;
      }
      return { ...source, html: markdown };
    }
  );

  const results = await Promise.all(promises);

  return results.filter((result): result is ContentResult => result !== null);
}
