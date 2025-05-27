import { put, list, del } from "@vercel/blob";
import { BlogPost, CreateBlogPost } from "@/types/blog";

export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export async function uploadBanner(file: File): Promise<string> {
    const blob = await put(`banners/${Date.now()}-${file.name}`, file, {
        access: "public",
    });
    console.log("Uploaded banner URL:", blob.url);
    return blob.url;
}

export async function saveBlogPost(post: CreateBlogPost): Promise<BlogPost> {
    const id = crypto.randomUUID();
    const slug = generateSlug(post.title);
    const now = new Date().toISOString();

    const bannerUrl = await uploadBanner(post.bannerFile);

    const blogPost: BlogPost = {
        id,
        title: post.title,
        slug,
        content: post.content,
        excerpt: post.excerpt,
        bannerUrl,
        createdAt: now,
        updatedAt: now,
        published: post.published,
    };

    await put(`posts/${id}.json`, JSON.stringify(blogPost), {
        access: "public",
    });

    return blogPost;
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
    try {
        console.log("Fetching blog posts...");
        const { blobs } = await list({ prefix: "posts/" });
        console.log("Found blobs:", blobs.length);

        const posts: BlogPost[] = [];

        for (const blob of blobs) {
            try {
                console.log("Fetching blob:", blob.pathname);
                const response = await fetch(blob.url);
                const post: BlogPost = await response.json();
                console.log("Post data:", {
                    title: post.title,
                    published: post.published,
                    bannerUrl: post.bannerUrl,
                });

                if (post.published) {
                    posts.push(post);
                }
            } catch (error) {
                console.error(`Error fetching post from ${blob.url}:`, error);
            }
        }

        console.log("Total published posts:", posts.length);

        // Sort by creation date (newest first)
        return posts.sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        );
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        return [];
    }
}

export async function getBlogPostBySlug(
    slug: string
): Promise<BlogPost | null> {
    try {
        const posts = await getAllBlogPosts();
        return posts.find((post) => post.slug === slug) || null;
    } catch (error) {
        console.error("Error fetching blog post by slug:", error);
        return null;
    }
}

export async function deleteBlogPost(id: string): Promise<void> {
    try {
        await del(`posts/${id}.json`);
    } catch (error) {
        console.error("Error deleting blog post:", error);
        throw error;
    }
}
