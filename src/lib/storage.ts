import { createClient } from "@supabase/supabase-js";
import { writeFile, mkdir, readFile } from "fs/promises";
import path from "path";

const LOCAL_UPLOAD_DIR = path.join(process.cwd(), "uploads");

export async function uploadFile(
  workspaceId: string,
  documentId: string,
  filename: string,
  buffer: Buffer,
): Promise<string> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "documents";

  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const storagePath = `${workspaceId}/${documentId}/${filename}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(storagePath, buffer, { upsert: true });

    if (error) throw new Error(`Storage upload failed: ${error.message}`);

    const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
    return data.publicUrl;
  }

  const dir = path.join(LOCAL_UPLOAD_DIR, workspaceId, documentId);
  await mkdir(dir, { recursive: true });
  const filePath = path.join(dir, filename);
  await writeFile(filePath, buffer);
  return filePath;
}

export async function downloadFile(fileUrl: string): Promise<Buffer> {
  if (fileUrl.startsWith("http")) {
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error("Failed to download file from storage.");
    return Buffer.from(await response.arrayBuffer());
  }

  return readFile(fileUrl);
}
