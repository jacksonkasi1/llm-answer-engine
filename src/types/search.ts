export interface GoogleApiImageSearchItem {
  title: string;
  link: string;
  displayLink: string;
  image: {
    contextLink: string;
  };
}

export interface GoogleImageSearchItem {
  title: string;
  link: string;
  displayLink: string;
  contextLink: string;
}

export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  favicon: string;
}

export interface ContentResult extends SearchResult {
  html: string; // This holds the converted Markdown content
}

export interface ScraperVideoResult {
  imageUrl: string;
  link: string;
}
