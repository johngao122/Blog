import { NextRequest, NextResponse } from "next/server";
import { saveBlogPost, getAllBlogPosts } from "@/lib/blog";
import { CreateBlogPost } from "@/types/blog";

export async function GET() {
    try {
        const posts = await getAllBlogPosts();
        return NextResponse.json(posts);
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        return NextResponse.json(
            { error: "Failed to fetch blog posts" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const title = formData.get("title") as string;
        const content = formData.get("content") as string;
        const excerpt = formData.get("excerpt") as string;
        const bannerFile = formData.get("bannerFile") as File;
        const published = formData.get("published") === "true";

        if (!title || !content || !excerpt || !bannerFile) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const createPost: CreateBlogPost = {
            title,
            content,
            excerpt,
            bannerFile,
            published,
        };

        const post = await saveBlogPost(createPost);
        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error("Error creating blog post:", error);
        return NextResponse.json(
            { error: "Failed to create blog post" },
            { status: 500 }
        );
    }
}
