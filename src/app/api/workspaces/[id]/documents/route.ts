import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { AuthError, requireVerifiedUser, requireWorkspaceAccess } from "@/lib/rbac";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from "@/lib/validators";
import { detectFileType } from "@/lib/rag/parser";
import { uploadFile } from "@/lib/storage";
import { processDocument } from "@/server/rag";
import { rateLimit } from "@/lib/api";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { session } = await requireWorkspaceAccess(id);
    const { searchParams } = new URL(request.url);
    const pinnedOnly = searchParams.get("pinned") === "true";
    const search = searchParams.get("q")?.trim();

    if (pinnedOnly) {
      const pins = await db.pinnedDocument.findMany({
        where: { userId: session.user.id, document: { workspaceId: id, deletedAt: null } },
        include: { document: true },
        orderBy: { pinnedAt: "desc" },
      });
      return NextResponse.json(pins.map((p) => p.document));
    }

    const documents = await db.document.findMany({
      where: {
        workspaceId: id,
        deletedAt: null,
        ...(search
          ? { filename: { contains: search, mode: "insensitive" as const } }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    const recent = await db.recentlyViewed.findMany({
      where: { userId: session.user.id, document: { workspaceId: id, deletedAt: null } },
      include: { document: true },
      orderBy: { viewedAt: "desc" },
      take: 5,
    });

    return NextResponse.json({ documents, recentlyViewed: recent.map((r) => r.document) });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const rateLimited = rateLimit(request as never, "upload", 10, 60_000);
    if (rateLimited) return rateLimited;

    const { id } = await params;
    const session = await requireVerifiedUser();
    await requireWorkspaceAccess(id, "EDITOR");

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File exceeds 50 MB limit" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type as (typeof ALLOWED_MIME_TYPES)[number])) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    const fileType = detectFileType(file.type, file.name);
    if (!fileType) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    const document = await db.document.create({
      data: {
        workspaceId: id,
        filename: file.name,
        fileType,
        fileUrl: "",
        uploadedById: session.user.id,
        status: "PENDING",
      },
    });

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileUrl = await uploadFile(id, document.id, file.name, buffer);

    await db.document.update({
      where: { id: document.id },
      data: { fileUrl, status: "PENDING" },
    });

    await db.auditLog.create({
      data: {
        workspaceId: id,
        actorId: session.user.id,
        action: "DOCUMENT_UPLOADED",
        targetType: "Document",
        targetId: document.id,
        metadata: { filename: file.name, fileType },
      },
    });

    processDocument(document.id).catch(console.error);

    return NextResponse.json(
      { ...document, fileUrl, status: "PENDING" },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
