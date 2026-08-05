import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const role = (session.user as any).role;
  if (role !== "SELLER" && role !== "ADMIN") {
    return NextResponse.json({ error: "Only sellers can upload images" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll("images") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const ext = file.name.split(".").pop();
      const fileName = `${(session.user as any).id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabaseAdmin.storage
        .from("product-images")
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        console.error("Supabase upload error:", error);
        continue;
      }

      const { data } = supabaseAdmin.storage.from("product-images").getPublicUrl(fileName);
      uploadedUrls.push(data.publicUrl);
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json({ error: "All uploads failed" }, { status: 500 });
    }

    return NextResponse.json({ urls: uploadedUrls }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}