import { Draft } from "@/types/blog";

const DRAFT_KEY = "blog_draft";
const AUTOSAVE_INTERVAL = 30000;

export function saveDraft(draft: Partial<Draft>): void {
    if (typeof window === "undefined") return;

    const currentDraft = loadDraft();
    const draftToSave: Draft = {
        id: currentDraft?.id || crypto.randomUUID(),
        title: draft.title || "",
        content: draft.content || "",
        excerpt: draft.excerpt || "",
        bannerFileName: draft.bannerFileName,
        bannerFileSize: draft.bannerFileSize,
        bannerFileType: draft.bannerFileType,
        published: draft.published || false,
        lastSaved: new Date().toISOString(),
    };

    localStorage.setItem(DRAFT_KEY, JSON.stringify(draftToSave));
}

export function loadDraft(): Draft | null {
    if (typeof window === "undefined") return null;

    try {
        const draftJson = localStorage.getItem(DRAFT_KEY);
        if (!draftJson) return null;

        return JSON.parse(draftJson) as Draft;
    } catch (error) {
        console.error("Error loading draft:", error);
        return null;
    }
}

export function clearDraft(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(DRAFT_KEY);
}

export function hasDraft(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(DRAFT_KEY) !== null;
}

export function getDraftAge(): number | null {
    const draft = loadDraft();
    if (!draft) return null;

    const lastSaved = new Date(draft.lastSaved);
    const now = new Date();
    return now.getTime() - lastSaved.getTime();
}

export function formatDraftAge(ageMs: number): string {
    const minutes = Math.floor(ageMs / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return "just now";
}

export class AutoSaveManager {
    private intervalId: NodeJS.Timeout | null = null;
    private getDraftData: () => Partial<Draft>;

    constructor(getDraftData: () => Partial<Draft>) {
        this.getDraftData = getDraftData;
    }

    start(): void {
        if (this.intervalId) return;

        this.intervalId = setInterval(() => {
            const draftData = this.getDraftData();

            if (draftData.title || draftData.content || draftData.excerpt) {
                saveDraft(draftData);
            }
        }, AUTOSAVE_INTERVAL);
    }

    stop(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    saveNow(): void {
        const draftData = this.getDraftData();
        if (draftData.title || draftData.content || draftData.excerpt) {
            saveDraft(draftData);
        }
    }
}
