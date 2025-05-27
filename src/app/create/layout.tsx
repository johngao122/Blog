import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create New Post",
    description: "Write and publish a new blog post",
};

export default function CreateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
