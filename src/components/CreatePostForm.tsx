"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TiptapEditor from "./TiptapEditor";
import { CreateBlogPost, Draft } from "@/types/blog";
import { AutoSaveManager, saveDraft, clearDraft } from "@/lib/drafts";
import { Badge } from "@/components/ui/badge";
import { Save } from "lucide-react";

interface CreatePostFormProps {
    onSubmit: (post: CreateBlogPost) => Promise<void>;
    isLoading?: boolean;
    initialDraft?: Draft | null;
}

export default function CreatePostForm({
    onSubmit,
    isLoading = false,
    initialDraft,
}: CreatePostFormProps) {
    const [title, setTitle] = useState(initialDraft?.title || "");
    const [excerpt, setExcerpt] = useState(initialDraft?.excerpt || "");
    const [content, setContent] = useState(initialDraft?.content || "");
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [published, setPublished] = useState(
        initialDraft?.published || false
    );
    const [lastSaved, setLastSaved] = useState<string | null>(null);

    const autoSaveManager = useRef<AutoSaveManager | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const getDraftData = (): Partial<Draft> => ({
            title,
            content,
            excerpt,
            published,
            bannerFileName: bannerFile?.name,
            bannerFileSize: bannerFile?.size,
            bannerFileType: bannerFile?.type,
        });

        autoSaveManager.current = new AutoSaveManager(getDraftData);
        autoSaveManager.current.start();

        return () => {
            autoSaveManager.current?.stop();
        };
    }, [title, content, excerpt, published, bannerFile]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (title || content || excerpt) {
                setLastSaved(new Date().toLocaleTimeString());
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [title, content, excerpt]);

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

        clearDraft();

        setTitle("");
        setExcerpt("");
        setContent("");
        setBannerFile(null);
        setPublished(false);
        setLastSaved(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setBannerFile(file);
        } else {
            alert("Please select a valid image file");
        }
    };

    const handleClear = () => {
        setTitle("");
        setExcerpt("");
        setContent("");
        setBannerFile(null);
        setPublished(false);
        setLastSaved(null);
        clearDraft();

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSaveNow = () => {
        if (title || content || excerpt) {
            autoSaveManager.current?.saveNow();
            setLastSaved(new Date().toLocaleTimeString());
        }
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Create New Blog Post</CardTitle>
                    <div className="flex items-center gap-2">
                        {lastSaved && (
                            <Badge variant="secondary" className="text-xs">
                                <Save className="h-3 w-3 mr-1" />
                                Last saved: {lastSaved}
                            </Badge>
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleSaveNow}
                            disabled={!title && !content && !excerpt}
                        >
                            <Save className="h-4 w-4 mr-1" />
                            Save Now
                        </Button>
                    </div>
                </div>
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
                            ref={fileInputRef}
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
                        {initialDraft?.bannerFileName && !bannerFile && (
                            <p className="text-sm text-yellow-600">
                                Previous draft had:{" "}
                                {initialDraft.bannerFileName} - Please select a
                                new banner image
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
                            onClick={handleClear}
                        >
                            Clear
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
