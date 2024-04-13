# LLM Open Search

LLM Open Search is an advanced search engine powered by AI to deliver search results, images, videos, and follow-up questions based on user queries. This project is a fork of the [Perplexity-Inspired LLM Answer Engine](https://github.com/developersdigest/llm-answer-engine) and extends its capabilities using Google's API, Cloudflare Workers AI, and Groq-Mixtral AI models.

<div>
    <a href="https://www.loom.com/share/d21687daed7d4f19900c7aa957387ea4">
      <p>Open Search - Powering insights with AI - 13 April 2024 - Watch Video</p>
    </a>
    <a href="https://www.loom.com/share/d21687daed7d4f19900c7aa957387ea4">
      <img style="max-width:300px;" src="https://cdn.loom.com/sessions/thumbnails/d21687daed7d4f19900c7aa957387ea4-with-play.gif">
    </a>
</div>

---

<div style="position: relative; padding-bottom: 63.49206349206349%; height: 0;"><iframe src="https://www.loom.com/embed/42bf2570c66b4b6fbf53ba1756d38e55" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>

## Credits ✨

This project was inspired by and forked from [Perplexity-Inspired LLM Answer Engine by developersdigest](https://github.com/developersdigest/llm-answer-engine). Special thanks to the original creators for their foundational work which motivated this project.

## Technologies Used

- **Next.js**: Front-end and server-side rendering.
- **Tailwind CSS**: Styling.
- **Vercel AI SDK**: for AI-powered text streaming.
- **Cloudflare Workers and AI**: Leveraging AI for serverless execution and enhanced query processing.
- **Groq & Mixtral**: AI technologies for processing and understanding user queries.
- **Langchain.js**: Langchain JS for text operations.
- **Google API and Serper API**: For fetching real-time search results, images, and videos.
- **OpenAI Embeddings**: For creating vector representations of text.

## Planned Features

- [ ] UI overhaul for a more contemporary look and feel.
- [ ] Improvements to the speed of response generation.
- [ ] Addition of chat memory for a continuous user experience.
- [ ] User authentication for personalized search histories.
- [ ] Support for creating and managing search collections.
- [ ] Integration of RAG for better context handling in responses.
- [ ] Development of voice search functionality.

## Installation

To get started with this project, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/jacksonkasi1/open-search.git
   ```

2. Navigate to the project directory:

   ```bash
   cd open-search
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

   or if you're using Bun:

   ```bash
   bun install
   ```

## Environment Setup

Create a `.env` file in your project root and add the following keys:

```plaintext
OPENAI_API_KEY=sk-yourkey
GROQ_API_KEY=gsk-yourkey
SERPER_API=yourkey
GOOGLE_SEARCH_ENGINE_ID=yourid
GOOGLE_SEARCH_API_KEY=yourkey
NODE_ENV=development
```

## Deployment

Before deploying, ensure you have installed Wrangler. For instructions on installing Wrangler, refer to the [official Wrangler installation guide](https://developers.cloudflare.com/workers/wrangler/install-and-update/).

To deploy your application to Cloudflare Workers:

1. Build the project:

   ```bash
   bun run pages:build
   ```

2. Preview the build locally:

   ```bash
   bun run preview
   ```

3. Deploy to Cloudflare:

   ```bash
   bun run deploy
   ```

   These commands compile your project, allow you to preview it locally, and then deploy it to Cloudflare, making it accessible on the internet.

## Contributing 💙

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

This new section provides clear steps on how to deploy the project using Cloudflare Workers after setting up the environment and installing dependencies. It bridges the setup instructions with how contributors can get involved with the project.

## License

This project is licensed under the MIT License.
