import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Validation check for Supabase
        const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
        const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || (!hasServiceKey && !hasAnonKey)) {
            return NextResponse.json({
                error: "Environment variables missing",
                details: "NEXT_PUBLIC_SUPABASE_URL and either SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in Vercel."
            }, { status: 500 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file selected" }, { status: 400 });
        }

        console.log(`🛰️ Upload Request: ${file.name} | Key Mode: ${hasServiceKey ? "Service Role (Bypasses RLS)" : "Anon Key (Needs RLS)"}`);

        const buffer = new Uint8Array(await file.arrayBuffer());
        const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const filename = `${Date.now()}_${cleanName}`;

        // Attempt to create bucket if it doesn't exist (only works if we have service key or correct permissions)
        try {
            const { data: buckets } = await supabase.storage.listBuckets();
            if (buckets && !buckets.find(b => b.name === 'uploads')) {
                console.log("Bucket 'uploads' not found. Attempting to create...");
                await supabase.storage.createBucket('uploads', { public: true });
            }
        } catch (e) {
            console.log("Could not verify/create bucket automatically (expected if using limited keys)");
        }

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('uploads')
            .upload(filename, buffer, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            const isRLSError = error.message.toLowerCase().includes("policy") || error.message.toLowerCase().includes("permission");
            const isBucketError = error.message.toLowerCase().includes("not found");

            return NextResponse.json({
                error: "Supabase Error",
                details: error.message,
                status: (error as any).status,
                action_plan: isRLSError ? "SQL Required" : isBucketError ? "Bucket Required" : "Config Check",
                sql_fix: isRLSError ? `
-- RUN THIS IN SUPABASE SQL EDITOR --
create policy "Public Access" on storage.objects for select using ( bucket_id = 'uploads' );
create policy "Admin Upload" on storage.objects for insert with check ( bucket_id = 'uploads' );
                `.trim() : undefined
            }, { status: 500 });
        }

        const { data: { publicUrl } } = supabase.storage
            .from('uploads')
            .getPublicUrl(filename);

        return NextResponse.json({ url: publicUrl });
    } catch (error: any) {
        return NextResponse.json({
            error: "Server Error",
            message: error.message
        }, { status: 500 });
    }
}
