"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Copy } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
    setFileUrl("");
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Pilih file terlebih dahulu");
      return;
    }

    setLoading(true);
    setFileUrl("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`https://file.pasarjaya.cloud/api/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data?.fileUrl) {
        setFileUrl(data.fileUrl);
        toast.success("File berhasil diupload!");
      } else {
        toast.error(data?.message || "Upload gagal.");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat upload.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fileUrl);
      toast.success("Link berhasil disalin!");
    } catch (err) {
      toast.error("Gagal menyalin link.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-background">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-xl">Upload File</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="file">Pilih File</Label>
            <Input id="file" type="file" onChange={handleFileChange} accept="*" />
          </div>

          <Button onClick={handleUpload} disabled={loading} className="w-full">
            {loading ? "Uploading..." : "Upload"}
          </Button>

          {file && (
            <p className="text-sm text-muted-foreground text-center truncate">
              File dipilih: <strong>{file.name}</strong>
            </p>
          )}

          {fileUrl && (
            <div className="text-sm text-center mt-4 space-y-2">
              ✅ Link file berhasil:
              <div className="flex items-center justify-center gap-2">
                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all max-w-[220px] sm:max-w-full">
                  {fileUrl}
                </a>
                <Button size="icon" variant="ghost" onClick={handleCopy} className="h-8 w-8">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
