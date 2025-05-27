# Blog Website

A modern blog website built with Next.js, Tiptap editor, shadcn/ui components, and Vercel blob storage.

## Features

-   📝 Rich text editor with Tiptap
-   🖼️ Banner image upload to Vercel blob storage
-   🎨 Beautiful UI with shadcn/ui components
-   📱 Responsive design
-   🔗 Dynamic URLs for blog posts
-   🚀 Built with Next.js 15 and React 19

## Setup

1. **Clone and install dependencies:**

    ```bash
    npm install
    ```

2. **Set up Vercel Blob Storage:**

    - Go to [Vercel Dashboard](https://vercel.com/dashboard/stores)
    - Create a new blob store
    - Copy the read/write token
    - Create a `.env.local` file in the root directory:

    ```bash
    BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here
    ```

3. **Run the development server:**

    ```bash
    npm run dev
    ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Creating a Blog Post

1. Click the "New Post" button on the homepage
2. Fill in the title, excerpt, and select a banner image
3. Use the rich text editor to write your content with:
    - **Bold**, _italic_, ~~strikethrough~~ text
    - Headers (H1, H2, H3)
    - Lists (bulleted and numbered)
    - Blockquotes
    - Links and images
    - Code blocks
4. Choose whether to publish immediately or save as draft
5. Click "Create Post"

### Viewing Blog Posts

-   All published posts appear on the homepage
-   Click any post card to view the full article
-   Each post has its own URL: `/blog/post-slug`

## Project Structure

```
src/
├── app/
│   ├── api/blog/          # API routes for blog operations
│   ├── blog/[slug]/       # Dynamic blog post pages
│   ├── create/            # Create new post page
│   ├── globals.css        # Global styles and prose styling
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── BlogPostCard.tsx   # Blog post preview card
│   ├── CreatePostForm.tsx # Form for creating posts
│   └── TiptapEditor.tsx   # Rich text editor
├── lib/
│   ├── blog.ts            # Blog operations and Vercel blob utilities
│   └── utils.ts           # Utility functions
└── types/
    └── blog.ts            # TypeScript type definitions
```

## Technologies Used

-   **Next.js 15** - React framework with App Router
-   **React 19** - Latest React version
-   **TypeScript** - Type safety
-   **Tiptap** - Rich text editor
-   **shadcn/ui** - Beautiful UI components
-   **Tailwind CSS v4** - Styling
-   **Vercel Blob** - File storage
-   **Lucide React** - Icons

## Deployment

This project is designed to be deployed on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `BLOB_READ_WRITE_TOKEN` environment variable in Vercel dashboard
4. Deploy!

## License

MIT License
