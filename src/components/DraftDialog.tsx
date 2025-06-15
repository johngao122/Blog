"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, FileText } from "lucide-react";
import { Draft } from "@/types/blog";
import { formatDraftAge, getDraftAge } from "@/lib/drafts";

interface DraftDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    draft: Draft;
    onLoadDraft: () => void;
    onDiscardDraft: () => void;
}

export default function DraftDialog({
    open,
    onOpenChange,
    draft,
    onLoadDraft,
    onDiscardDraft,
}: DraftDialogProps) {
    const draftAge = getDraftAge();
    const ageText = draftAge ? formatDraftAge(draftAge) : "unknown";

    const handleLoadDraft = () => {
        onLoadDraft();
        onOpenChange(false);
    };

    const handleDiscardDraft = () => {
        onDiscardDraft();
        onOpenChange(false);
    };

    const handleStartFresh = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Draft Found
                    </DialogTitle>
                    <DialogDescription>
                        We found a draft you were working on. Would you like to
                        continue where you left off?
                    </DialogDescription>
                </DialogHeader>

                <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="space-y-2">
                        <div>
                            <h4 className="font-medium text-sm text-gray-700">
                                Title
                            </h4>
                            <p className="text-sm">
                                {draft.title || "Untitled"}
                            </p>
                        </div>
                        {draft.excerpt && (
                            <div>
                                <h4 className="font-medium text-sm text-gray-700">
                                    Excerpt
                                </h4>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {draft.excerpt}
                                </p>
                            </div>
                        )}
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            Last saved {ageText}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <Button onClick={handleLoadDraft} className="w-full">
                        Load Draft
                    </Button>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={handleStartFresh}
                            className="flex-1"
                        >
                            Start Fresh
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDiscardDraft}
                            className="flex-1"
                        >
                            Delete Draft
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
