"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  onSubmit: (content: string) => Promise<void>;
  disabled?: boolean;
  suggestions?: string[];
}

export function ChatInput({
  onSubmit,
  disabled,
  suggestions = [],
}: ChatInputProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || loading || disabled) return;

    setLoading(true);
    try {
      await onSubmit(content.trim());
      setContent("");
    } finally {
      setLoading(false);
    }
  }

  async function handleSuggestion(suggestion: string) {
    if (loading || disabled) return;
    setLoading(true);
    try {
      await onSubmit(suggestion);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border-t border-graphite/10 bg-paper p-4">
      {suggestions.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSuggestion(s)}
              disabled={loading || disabled}
              className="rounded-[var(--radius-pill)] border border-graphite/10 px-3 py-1 text-xs text-graphite hover:border-signal hover:text-signal disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Ask a question about your documents…"
          disabled={loading || disabled}
          className="flex-1"
          aria-label="Question input"
        />
        <Button type="submit" disabled={loading || disabled || !content.trim()}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-label="Sending" />
          ) : (
            <Send className="h-4 w-4" aria-label="Send" />
          )}
        </Button>
      </form>
    </div>
  );
}
