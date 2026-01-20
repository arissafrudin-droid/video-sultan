from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import fal_client
import os
import shutil

# --- SETUP SERVER ---
app = FastAPI()

# Biar Frontend (Next.js) bisa ngobrol sama Backend ini
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- FUNGSI UTAMA ---
@app.post("/generate-video")
async def generate_video(
    file: UploadFile = File(...), 
    prompt: str = Form(...),
    api_key: str = Form(...)
):
    print(f"📩 Menerima order video: {prompt}...")
    
    # 1. Simpan gambar sementara
    temp_filename = f"temp_{file.filename}"
    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # 2. Set API Key dari User (BYOK)
        os.environ["FAL_KEY"] = api_key
        
        # 3. Upload ke Fal
        print("☁️ Uploading image to Fal...")
        url_gambar = fal_client.upload_file(temp_filename)
        
        # 4. Generate Video (Minimax)
        print("🎥 Generating video...")
        handler = fal_client.submit(
            "fal-ai/minimax/video-01/image-to-video",
            arguments={
                "image_url": url_gambar,
                "prompt": prompt,
            },
        )
        result = handler.get()
        video_url = result['video']['url']
        
        print("✅ Success!")
        return {"status": "success", "video_url": video_url}

    except Exception as e:
        return {"status": "error", "message": str(e)}
        
    finally:
        # Bersihkan file sampah
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

# --- TESTER ---
@app.get("/")
def read_root():
    return {"message": "Otak AI Siap - Backend Online!"}