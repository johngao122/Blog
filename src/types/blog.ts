export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    bannerUrl: string;
    createdAt: string;
    updatedAt: string;
    published: boolean;
}

export interface CreateBlogPost {
    title: string;
    content: string;
    excerpt: string;
    bannerFile: File;
    published: boolean;
}
