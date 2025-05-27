"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Link as LinkIcon,
    Image as ImageIcon,
    Upload,
} from "lucide-react";
import { useState } from "react";

interface TiptapEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

export default function TiptapEditor({
    content,
    onChange,
    placeholder = "Start writing...",
}: TiptapEditorProps) {
    const [isUploading, setIsUploading] = useState(false);

    // Function to upload image to Vercel blob
    const uploadImage = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload-image", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to upload image");
        }

        const { url } = await response.json();
        return url;
    };

    // Handle image insertion (paste, drop, or manual)
    const handleImageInsert = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file");
            return;
        }

        setIsUploading(true);
        try {
            const url = await uploadImage(file);
            editor?.chain().focus().setImage({ src: url }).run();
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                HTMLAttributes: {
                    class: "rounded-lg max-w-full h-auto",
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-blue-600 hover:text-blue-800 underline",
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            // Handle paste events
            handlePaste: (view, event) => {
                const items = Array.from(event.clipboardData?.items || []);
                const imageItem = items.find((item) =>
                    item.type.startsWith("image/")
                );

                if (imageItem) {
                    event.preventDefault();
                    const file = imageItem.getAsFile();
                    if (file) {
                        handleImageInsert(file);
                    }
                    return true;
                }
                return false;
            },
            // Handle drop events
            handleDrop: (view, event) => {
                const files = Array.from(event.dataTransfer?.files || []);
                const imageFile = files.find((file) =>
                    file.type.startsWith("image/")
                );

                if (imageFile) {
                    event.preventDefault();
                    handleImageInsert(imageFile);
                    return true;
                }
                return false;
            },
            // Handle drag over to show drop zone
            handleDOMEvents: {
                dragover: (view, event) => {
                    event.preventDefault();
                    return false;
                },
            },
        },
    });

    if (!editor) {
        return null;
    }

    const addImage = () => {
        const url = window.prompt("Enter image URL:");
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const addImageFile = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                handleImageInsert(file);
            }
        };
        input.click();
    };

    const addLink = () => {
        const url = window.prompt("Enter URL:");
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    return (
        <div className="border rounded-lg overflow-hidden">
            {/* Toolbar */}
            <div className="border-b bg-gray-50 p-2 flex flex-wrap gap-1">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive("bold") ? "bg-gray-200" : ""}
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive("italic") ? "bg-gray-200" : ""}
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={editor.isActive("strike") ? "bg-gray-200" : ""}
                >
                    <Strikethrough className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={editor.isActive("code") ? "bg-gray-200" : ""}
                >
                    <Code className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6" />

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    className={
                        editor.isActive("heading", { level: 1 })
                            ? "bg-gray-200"
                            : ""
                    }
                >
                    <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    className={
                        editor.isActive("heading", { level: 2 })
                            ? "bg-gray-200"
                            : ""
                    }
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    className={
                        editor.isActive("heading", { level: 3 })
                            ? "bg-gray-200"
                            : ""
                    }
                >
                    <Heading3 className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6" />

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                    className={
                        editor.isActive("bulletList") ? "bg-gray-200" : ""
                    }
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                    className={
                        editor.isActive("orderedList") ? "bg-gray-200" : ""
                    }
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                    }
                    className={
                        editor.isActive("blockquote") ? "bg-gray-200" : ""
                    }
                >
                    <Quote className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6" />

                <Button variant="ghost" size="sm" onClick={addLink}>
                    <LinkIcon className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={addImage}
                    title="Add image from URL"
                >
                    <ImageIcon className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={addImageFile}
                    disabled={isUploading}
                    title="Upload image file"
                >
                    <Upload className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6" />

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>

            {/* Editor */}
            <div className="relative">
                <EditorContent
                    editor={editor}
                    className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto p-4 min-h-[400px] focus:outline-none"
                />
                {isUploading && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                        <div className="flex items-center gap-2 text-gray-600">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                            Uploading image...
                        </div>
                    </div>
                )}
            </div>

            {/* Help text */}
            <div className="px-4 py-2 text-xs text-gray-500 border-t bg-gray-50">
                💡 Tip: You can paste images directly (Ctrl+V) or drag & drop
                them into the editor
            </div>
        </div>
    );
}
