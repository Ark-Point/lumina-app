import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import { join } from "path";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const imagePath = join(
    process.cwd(),
    "public",
    "miniapp",
    "opengraph-image.png"
  );
  const imageBuffer = await fs.readFile(imagePath);

  return new NextResponse(imageBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=604800, immutable",
      "Content-Length": imageBuffer.length.toString(),
    },
  });
}
