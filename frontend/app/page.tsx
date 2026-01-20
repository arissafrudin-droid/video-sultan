'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, UploadCloud, PlayCircle, Layers, Settings, Video, Image as ImageIcon } from "lucide-react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("Cinematic product shot, high quality, 4k");
  const [file, setFile] = useState<File | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleGenerate = async () => {
    if (!file) {
      alert("⚠️ Upload gambar dulu bro!");
      return;
    }
    if (!apiKey) {
      alert("⚠️ Masukkan API Key Fal.ai dulu di Sidebar Kiri!");
      return;
    }

    setLoading(true);
    setVideoUrl("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("prompt", prompt);
      formData.append("api_key", apiKey);

      const response = await fetch("https://pojokonline-api-sultan.hf.space/generate-video", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.status === "success") {
        setVideoUrl(data.video_url);
      } else {
        alert("❌ Error dari Backend: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("❌ Gagal terhubung ke Backend. Pastikan terminal Python (uvicorn) NYALA!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-900/50 p-6 flex flex-col gap-6 hidden md:flex">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-red-600 rounded-lg flex items-center justify-center">
            <Video className="text-white h-5 w-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">SultanVideo</span>
        </div>

        <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
          <Label className="text-xs text-zinc-500 mb-2 block">API KEY (FAL.AI)</Label>
          <Input 
            type="password" 
            placeholder="Paste Key di sini..." 
            className="bg-zinc-950 border-zinc-700 h-8 text-xs text-white"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>

        <nav className="flex flex-col gap-2">
          <Button variant="ghost" className="justify-start gap-3 text-zinc-400 hover:text-white hover:bg-zinc-800">
            <Layers className="h-4 w-4" /> Dashboard
          </Button>
          <Button variant="secondary" className="justify-start gap-3 bg-red-600/10 text-red-500 hover:bg-red-600/20">
            <ImageIcon className="h-4 w-4" /> Image to Video
          </Button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            
            <div>
              <h1 className="text-3xl font-bold">Studio Mode</h1>
              <p className="text-zinc-400 mt-1">Konfigurasi video AI professional.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* KOLOM KIRI */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* UPLOAD SECTION */}
                <Card className="bg-zinc-900 border-zinc-800 text-white">
                  <CardHeader>
                    <CardTitle className="text-lg">1. Upload Material</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative h-40 w-full group">
                      
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-20"
                      />
                      
                      <div className={`absolute inset-0 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center transition-colors bg-zinc-900/50 ${file ? 'border-green-500/50 bg-green-500/10' : 'border-zinc-700 group-hover:border-red-500/50'}`}>
                        {preview ? (
                           <img src={preview} alt="Preview" className="h-full w-full object-cover rounded-lg opacity-50" />
                        ) : (
                          <>
                            <UploadCloud className="h-10 w-10 text-zinc-500 mb-3 group-hover:text-red-500 transition-colors" />
                            <p className="text-sm text-zinc-300 font-medium">Klik Area Ini</p>
                            <p className="text-xs text-zinc-500">JPG/PNG (Max 10MB)</p>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* CONFIG SECTION */}
                <Card className="bg-zinc-900 border-zinc-800 text-white">
                  <CardHeader>
                    <CardTitle className="text-lg">2. Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Visual Style</Label>
                      <Select onValueChange={(val) => {
                         if(val === 'luxury') setPrompt("Cinematic product shot, slow camera pan, golden hour lighting, luxury vibe, 4k");
                         if(val === 'fresh') setPrompt("Bright commercial advertisement, sunshine, fresh atmosphere, water droplets, high key lighting, 4k");
                         if(val === 'cyber') setPrompt("Dark dramatic lighting, neon rim light, mysterious atmosphere, slow motion, smoke effect");
                      }}>
                        <SelectTrigger className="bg-zinc-950 border-zinc-700 text-white">
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                          <SelectItem value="luxury">✨ Cinematic Luxury</SelectItem>
                          <SelectItem value="fresh">🍃 Fresh & Natural</SelectItem>
                          <SelectItem value="cyber">🤖 Cyberpunk Neon</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>AI Prompt</Label>
                      <Textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="bg-zinc-950 border-zinc-700 min-h-[100px] text-white" 
                      />
                    </div>

                    <Button 
                      onClick={handleGenerate} 
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-6 shadow-lg shadow-red-900/20"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Rendering AI...
                        </>
                      ) : (
                        <>
                          <PlayCircle className="mr-2 h-5 w-5" /> GENERATE VIDEO
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* RESULT SECTION */}
              <div className="lg:col-span-2">
                <Card className="h-full bg-zinc-900 border-zinc-800 text-white overflow-hidden flex flex-col">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle>Result Preview</CardTitle>
                      <CardDescription className="text-zinc-500">High Definition (720p)</CardDescription>
                    </div>
                    <Badge variant="outline" className="border-red-500/30 text-red-400 bg-red-500/10">PRO MODEL</Badge>
                  </CardHeader>
                  <Separator className="bg-zinc-800" />
                  <CardContent className="flex-1 flex items-center justify-center p-0 min-h-[400px] bg-zinc-950 relative group">
                    
                    {videoUrl ? (
                      <div className="relative w-full h-full flex items-center justify-center bg-black">
                        <video src={videoUrl} controls autoPlay loop className="max-w-full max-h-[500px]" />
                        <a href={videoUrl} download target="_blank" className="absolute bottom-4 right-4 bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-200">
                          Download Video ⬇️
                        </a>
                      </div>
                    ) : (
                      <div className="text-center space-y-3 z-10">
                        <div className="h-20 w-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto border border-zinc-800 group-hover:scale-110 transition-transform duration-500">
                          {loading ? <Loader2 className="h-8 w-8 text-red-500 animate-spin" /> : <Video className="h-8 w-8 text-zinc-600" />}
                        </div>
                        <p className="text-zinc-500 text-sm">
                          {loading ? "Sedang membuat video... (Bisa 1-2 menit)" : "Video hasil generate akan muncul di sini"}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}