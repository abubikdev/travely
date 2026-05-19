const IMAGE_EXT = /\.(jpe?g|png|gif|webp|heic|heif|bmp|tiff?)$/i;

export type DocumentFileKind = "pdf" | "image";

export function resolveDocumentKind(file: File): DocumentFileKind | null {
  const name = file.name.toLowerCase();
  if (file.type === "application/pdf" || name.endsWith(".pdf")) return "pdf";
  if (file.type.startsWith("image/") || IMAGE_EXT.test(name)) return "image";
  return null;
}

export function resolveMimeType(file: File, kind: DocumentFileKind): string {
  if (file.type) return file.type;
  if (kind === "pdf") return "application/pdf";
  return "image/jpeg";
}
