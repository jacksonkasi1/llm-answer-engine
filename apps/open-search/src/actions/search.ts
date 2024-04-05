// ** import config
import { apiConfig, config } from "@/config";
import {
  GoogleApiImageSearchItem,
  GoogleImageSearchItem,
  ScraperVideoResult,
  SearchResult,
} from "@/types";

// Fetch search results from Google Search API
export async function getSources(
  message: string,
  numberOfPagesToScan = config.numberOfPagesToScan
): Promise<SearchResult[]> {
  try {
    const gConfig = apiConfig.googleCustomSearch;
    const url = `${gConfig.baseURL}?key=${gConfig.apiKey}&cx=${
      gConfig.searchEngineId
    }&q=${encodeURIComponent(message)}&num=${numberOfPagesToScan}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Google Search API request failed");
    }

    const jsonResponse = await response.json();

    if (!jsonResponse.items) {
      throw new Error("Invalid API response format");
    }

    const results: SearchResult[] = await Promise.all(
      jsonResponse.items.map(async (item: any): Promise<SearchResult> => {
        const faviconUrl = `${gConfig.favBaseURL}?domain=${
          new URL(item.link).hostname
        }&sz=128`;

        return {
          title: item.title,
          link: item.link,
          snippet: item.snippet,
          favicon: faviconUrl,
        };
      })
    );
    return results;
  } catch (error) {
    console.error("🔴 Error fetching search results:", error);
    throw error;
  }
}

// Fetch image search results from Google Search API
export async function getImages(
  message: string
): Promise<GoogleImageSearchItem[]> {
  try {
    console.log("🔍🖼️ Fetching image search results from Google Search API...");

    const gConfig = apiConfig.googleCustomSearch;
    const url = `${gConfig.baseURL}?key=${gConfig.apiKey}&cx=${
      gConfig.searchEngineId
    }&q=${encodeURIComponent(message)}&searchType=image`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Google Search API request failed for images");
    }

    const jsonResponse = await response.json();

    if (!jsonResponse.items) {
      throw new Error("Invalid API response format for images");
    }

    const images: {
      title: string;
      link: string;
      displayLink: string;
      contextLink: string;
    }[] = jsonResponse.items.map((item: GoogleApiImageSearchItem) => ({
      title: item.title,
      link: item.link,
      displayLink: item.displayLink,
      contextLink: item.image.contextLink,
    }));

    return images.slice(0, 9);
  } catch (error) {
    console.error("🔴 Error fetching image search results:", error);
    throw error;
  }
}

export async function getVideos(
  message: string
): Promise<ScraperVideoResult[] | null> {
  console.log("🔍🎥 Fetching video search results from Google Search API...");

  const sConfig = apiConfig.scraper; // Ensure apiConfig is imported correctly
  const url = `${sConfig.baseURL}/videos`;
  const data = JSON.stringify({ q: message });

  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      "X-API-KEY": sConfig.apiKey,
      "Content-Type": "application/json",
    },
    body: data,
  };

  try {
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      console.error(
        `🚫 Network response was not ok. Status: ${response.status}`
      );
      return null;
    }
    const responseData = await response.json();

    const videoPromises = responseData.videos.map((video: any) =>
      fetch(video.imageUrl, { method: "HEAD" })
        .then((imageResponse) => {
          if (imageResponse.ok) {
            const contentType = imageResponse.headers.get("content-type");
            if (contentType && contentType.startsWith("image/")) {
              return { imageUrl: video.imageUrl, link: video.link };
            }
          }
          return null;
        })
        .catch((error) => {
          console.error(
            `🔗 Error fetching image link ${video.imageUrl}:`,
            error
          );
          return null;
        })
    );

    const validLinks = (await Promise.all(videoPromises))
      .filter((link): link is ScraperVideoResult => link !== null)
      .slice(0, 9); // Limit to the first 9 valid links

    return validLinks;
  } catch (error) {
    console.error("❌ Error fetching videos:", error);
    return null;
  }
}
