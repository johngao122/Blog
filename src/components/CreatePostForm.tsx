"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TiptapEditor from "./TiptapEditor";
import { CreateBlogPost } from "@/types/blog";

interface CreatePostFormProps {
    onSubmit: (post: CreateBlogPost) => Promise<void>;
    isLoading?: boolean;
}

export default function CreatePostForm({
    onSubmit,
    isLoading = false,
}: CreatePostFormProps) {
    const [title, setTitle] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [published, setPublished] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !title.trim() ||
            !content.trim() ||
            !excerpt.trim() ||
            !bannerFile
        ) {
            alert("Please fill in all fields and select a banner image");
            return;
        }

        const post: CreateBlogPost = {
            title: title.trim(),
            content,
            excerpt: excerpt.trim(),
            bannerFile,
            published,
        };

        await onSubmit(post);

        setTitle("");
        setExcerpt("");
        setContent("");
        setBannerFile(null);
        setPublished(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setBannerFile(file);
        } else {
            alert("Please select a valid image file");
        }
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Create New Blog Post</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter blog post title"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="excerpt">Excerpt</Label>
                        <Textarea
                            id="excerpt"
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            placeholder="Brief description of the blog post"
                            rows={3}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="banner">Banner Image</Label>
                        <Input
                            id="banner"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                        />
                        {bannerFile && (
                            <p className="text-sm text-gray-600">
                                Selected: {bannerFile.name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Content</Label>
                        <TiptapEditor
                            content={content}
                            onChange={setContent}
                            placeholder="Write your blog post content here..."
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="published"
                            checked={published}
                            onChange={(e) => setPublished(e.target.checked)}
                            className="rounded"
                        />
                        <Label htmlFor="published">Publish immediately</Label>
                    </div>

                    <div className="flex gap-4">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create Post"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setTitle("");
                                setExcerpt("");
                                setContent("");
                                setBannerFile(null);
                                setPublished(false);
                            }}
                        >
                            Clear
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
