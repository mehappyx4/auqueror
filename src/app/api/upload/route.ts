import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file selected" }, { status: 400 });
        }

        const buffer = new Uint8Array(await file.arrayBuffer());
        const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const filename = `${Date.now()}_${cleanName}`;

        // Check for Supabase Configuration
        const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL &&
            (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

        if (hasSupabase) {
            console.log(`🛰️ Uploading to Supabase: ${filename}`);

            // Attempt to create bucket if it doesn't exist
            try {
                const { data: buckets } = await supabase.storage.listBuckets();
                if (buckets && !buckets.find(b => b.name === 'uploads')) {
                    await supabase.storage.createBucket('uploads', { public: true });
                }
            } catch (e) {
                console.log("Supabase bucket check skipped");
            }

            const { data, error } = await supabase.storage
                .from('uploads')
                .upload(filename, buffer, {
                    contentType: file.type,
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                console.error("Supabase Upload Error:", error);
                throw new Error(error.message);
            }

            const { data: { publicUrl } } = supabase.storage
                .from('uploads')
                .getPublicUrl(filename);

            return NextResponse.json({ url: publicUrl });
        } else {
            // FALLBACK: Local File System Upload (Verification Mode / Local Dev)
            console.log(`💾 Uploading to Local Storage: ${filename}`);

            const uploadDir = path.join(process.cwd(), "public/uploads");

            // Ensure directory exists
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const filePath = path.join(uploadDir, filename);
            await writeFile(filePath, buffer);

            // URL path relative to public folder
            const localUrl = `/uploads/${filename}`;
            return NextResponse.json({ url: localUrl });
        }

    } catch (error: any) {
        console.error("Upload failed:", error);
        return NextResponse.json({
            error: "Upload Failed",
            details: error.message
        }, { status: 500 });
    }
}
