"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Upload,
  MessageSquare,
  BarChart3,
  ArrowLeft,
  Download,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DocumentRow } from "@/components/workspace/document-row";
import { DocumentListSkeleton, AnalyticsSkeleton, ChatSkeleton } from "@/components/ui/skeleton";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { CommandPalette } from "@/components/workspace/command-palette";
import { AnalyticsView, type AnalyticsData } from "@/components/workspace/analytics-view";
import { DocumentViewer } from "@/components/workspace/document-viewer";
import { cn } from "@/lib/utils";
import type { Citation } from "@/types";
import type { Confidence, DocStatus } from "@/types";

interface Document {
  id: string;
  filename: string;
  status: DocStatus;
  failureReason?: string | null;
  createdAt: string;
}

interface Message {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  confidence?: Confidence | null;
  citations?: Citation[];
}


interface WorkspaceViewProps {
  workspaceId: string;
  workspaceName: string;
}

export function WorkspaceView({
  workspaceId,
  workspaceName,
}: WorkspaceViewProps) {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [recent, setRecent] = useState<Document[]>([]);
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [highlight, setHighlight] = useState<Citation | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [followUps, setFollowUps] = useState<string[]>([]);
  const [asking, setAsking] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [view, setView] = useState<"chat" | "analytics">("chat");
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [mobilePane, setMobilePane] = useState<"documents" | "content">(
    "documents",
  );

  const fetchDocuments = useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    const res = await fetch(
      `/api/workspaces/${workspaceId}/documents?${params}`,
    );
    if (res.ok) {
      const data = await res.json();
      setDocuments(data.documents ?? data);
      setRecent(data.recentlyViewed ?? []);
      setPinnedIds(new Set(data.pinnedDocumentIds ?? []));
    }
    setLoading(false);
  }, [workspaceId, search]);

  useEffect(() => {
    const timer = setTimeout(fetchDocuments, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchDocuments, search]);

  const hasActiveProcessing = documents.some(
    (doc) => doc.status === "PENDING" || doc.status === "PROCESSING",
  );

  useEffect(() => {
    if (!hasActiveProcessing) return;
    const interval = setInterval(fetchDocuments, 3000);
    return () => clearInterval(interval);
  }, [hasActiveProcessing, fetchDocuments]);

  useEffect(() => {
    async function initConversation() {
      const res = await fetch(`/api/workspaces/${workspaceId}/conversations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Conversation" }),
      });
      if (res.ok) {
        const conv = await res.json();
        setConversationId(conv.id);
      }
    }
    initConversation();
  }, [workspaceId]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/documents`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        await fetchDocuments();
      } else {
        const data = await res.json().catch(() => ({}));
        const msg = data?.error ?? `Upload failed (${res.status})`;
        console.error("[upload] error:", res.status, data);
        setUploadError(msg);
      }
    } catch (err) {
      console.error("[upload] network error:", err);
      setUploadError("Network error — please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handlePin(docId: string) {
    const isPinned = pinnedIds.has(docId);
    const method = isPinned ? "DELETE" : "POST";
    const res = await fetch(`/api/documents/${docId}/pin`, { method });
    if (res.ok) {
      setPinnedIds((prev) => {
        const next = new Set(prev);
        if (isPinned) next.delete(docId);
        else next.add(docId);
        return next;
      });
    }
  }

  async function handleAsk(content: string) {
    if (!conversationId) return;
    setAsking(true);
    setFollowUps([]);

    setMessages((prev) => [
      ...prev,
      { id: `temp-${Date.now()}`, role: "USER", content },
    ]);

    const res = await fetch(`/api/conversations/${conversationId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    setAsking(false);

    if (res.ok) {
      const data = await res.json();
      setMessages((prev) => [
        ...prev.filter((m) => !m.id.startsWith("temp-")),
        { id: `user-${Date.now()}`, role: "USER", content },
        {
          id: data.message.id,
          role: "ASSISTANT",
          content: data.message.content,
          confidence: data.message.confidence,
          citations: data.citations,
        },
      ]);
      setFollowUps(data.followUps ?? []);
    }
  }

  async function loadAnalytics() {
    setView("analytics");
    setAnalyticsLoading(true);
    const res = await fetch(`/api/workspaces/${workspaceId}/analytics`);
    if (res.ok) setAnalytics(await res.json());
    setAnalyticsLoading(false);
  }

  function handleCitationClick(citation: Citation) {
    setSelectedDocId(citation.documentId);
    setHighlight(citation);
  }

  const sortedDocs = [...documents].sort((a, b) => {
    const aPin = pinnedIds.has(a.id) ? 0 : 1;
    const bPin = pinnedIds.has(b.id) ? 0 : 1;
    return aPin - bPin;
  });

  return (
    <div className="flex h-[calc(100vh-0px)] flex-col">
      <header className="flex h-14 items-center justify-between border-b border-graphite/10 px-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/app">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="font-semibold text-ink">{workspaceName}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setView("chat");
              setMobilePane("content");
            }}
          >
            <MessageSquare className="h-4 w-4" />
            Chat
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              loadAnalytics();
              setMobilePane("content");
            }}
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Button>
          {conversationId && (
            <Button variant="ghost" size="sm" asChild>
              <a href={`/api/conversations/${conversationId}/export`}>
                <Download className="h-4 w-4" />
                Export
              </a>
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPaletteOpen(true)}
          >
            <kbd className="rounded border border-graphite/20 px-2 py-0.5 font-mono text-xs text-graphite">
              ⌘K
            </kbd>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/workspace/${workspaceId}/settings`} aria-label="Workspace settings">
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      <div className="flex border-b border-graphite/10 p-2 sm:hidden">
        {(
          [
            { key: "documents", label: "Documents" },
            { key: "content", label: "Chat" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setMobilePane(tab.key)}
            className={cn(
              "flex-1 rounded-[var(--radius-default)] py-1.5 text-sm font-medium transition-colors",
              mobilePane === tab.key
                ? "bg-signal-tint text-signal"
                : "text-graphite",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside
          className={cn(
            "w-full flex-col border-r border-graphite/10 sm:flex sm:w-80",
            mobilePane === "documents" ? "flex" : "hidden",
          )}
        >
          <div className="border-b border-graphite/10 p-3">
            <Input
              placeholder="Search documents…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search documents"
            />
            <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-default)] border border-dashed border-graphite/20 py-2 text-sm text-graphite hover:border-signal hover:text-signal">
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading…" : "Upload PDF, DOCX, or TXT"}
              <input
                type="file"
                className="hidden"
                accept=".pdf,.docx,.txt"
                onChange={handleUpload}
                disabled={uploading}
              />
            </label>
            {uploadError && (
              <p className="mt-1 text-xs text-flag px-1">{uploadError}</p>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {loading ? (
              <DocumentListSkeleton />
            ) : sortedDocs.length === 0 ? (
              <p className="p-4 text-center text-sm text-graphite">
                {search
                  ? "No matches for this filter."
                  : "No documents yet — upload your first PDF, DOCX, or text file."}
              </p>
            ) : (
              sortedDocs.map((doc) => (
                <DocumentRow
                  key={doc.id}
                  {...doc}
                  isPinned={pinnedIds.has(doc.id)}
                  isSelected={selectedDocId === doc.id}
                  onSelect={() => setSelectedDocId(doc.id)}
                  onPin={() => handlePin(doc.id)}
                />
              ))
            )}
            {recent.length > 0 && (
              <div className="mt-4 px-2">
                <p className="text-xs font-medium text-graphite">
                  Recently viewed
                </p>
                {recent.map((doc) => (
                  <DocumentRow
                    key={`recent-${doc.id}`}
                    {...doc}
                    onSelect={() => setSelectedDocId(doc.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </aside>

        <main
          className={cn(
            "w-full flex-1 flex-col sm:flex",
            mobilePane === "content" ? "flex" : "hidden",
          )}
        >
          {view === "analytics" ? (
            analyticsLoading || !analytics ? (
              <div className="flex-1 overflow-y-auto p-6">
                <h2 className="text-lg font-semibold text-ink">Analytics</h2>
                <div className="mt-6">
                  <AnalyticsSkeleton />
                </div>
              </div>
            ) : (
              <AnalyticsView analytics={analytics} />
            )
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 && !asking && (
                  <p className="text-center text-graphite">
                    Ask a question about your documents.
                  </p>
                )}
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    role={msg.role}
                    content={msg.content}
                    confidence={msg.confidence}
                    citations={msg.citations}
                    onCitationClick={handleCitationClick}
                  />
                ))}
                {asking && <ChatSkeleton />}
              </div>
              <ChatInput
                onSubmit={handleAsk}
                disabled={asking}
                suggestions={followUps}
              />
            </>
          )}
        </main>

        {selectedDocId && (
          <DocumentViewer
            documentId={selectedDocId}
            highlight={highlight}
            onClose={() => {
              setSelectedDocId(null);
              setHighlight(null);
            }}
          />
        )}
      </div>

      <CommandPalette
        workspaces={[{ id: workspaceId, name: workspaceName }]}
        documents={documents.map((d) => ({
          id: d.id,
          filename: d.filename,
          workspaceId,
        }))}
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
      />
    </div>
  );
}
