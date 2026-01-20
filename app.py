import streamlit as st
import fal_client
import os

# --- 1. CONFIG HALAMAN (Wajib paling atas) ---
st.set_page_config(
    page_title="AI Video Studio",
    page_icon="✨",
    layout="wide", # Layout lebar
    initial_sidebar_state="expanded"
)

# --- 2. CUSTOM CSS (Biar tombol & font jadi elegan) ---
st.markdown("""
<style>
    /* Tombol Gradasi Merah-Pink */
    .stButton > button {
        background: linear-gradient(45deg, #FF4B2B, #FF416C); 
        color: white;
        border: none;
        border-radius: 10px;
        height: 3em;
        width: 100%;
        font-weight: bold;
        transition: 0.3s;
    }
    .stButton > button:hover {
        transform: scale(1.02);
        box-shadow: 0 4px 15px rgba(255, 65, 108, 0.4);
    }
    .block-container { padding-top: 2rem; }
</style>
""", unsafe_allow_html=True)

# --- SIDEBAR (INPUT KEY & INFO) ---
with st.sidebar:
    st.title("🔑 Kunci Akses")
    st.info("Aplikasi ini menggunakan sistem BYOK (Bring Your Own Key).")
    
    # Input API Key User
    api_key_input = st.text_input("Masukkan Fal.ai API Key", type="password", help="Daftar di fal.ai untuk dapat key")
    
    if api_key_input:
        os.environ["FAL_KEY"] = api_key_input
        st.success("✅ Key Terhubung!")
    else:
        st.warning("⚠️ Wajib isi API Key biar jalan.")
        st.markdown("[👉 Daftar Fal.ai di sini](https://fal.ai)")

    st.divider()
    st.write("Model: Minimax/Hailuo")

# --- HEADER UTAMA ---
st.title("✨ Professional Video Generator")
st.markdown("Ubah foto produk menjadi video iklan sinematik. (Aman & Gratis pakai kuota sendiri).")
st.divider()

# --- 3. LAYOUT DUA KOLOM ---
col1, col2 = st.columns([1, 1.5], gap="large")

# --- KOLOM KIRI (INPUT) ---
with col1:
    st.subheader("1. Upload Produk")
    uploaded_file = st.file_uploader("", type=["jpg", "png", "jpeg"])
    
    if uploaded_file:
        st.image(uploaded_file, caption="Preview Produk", width=300)

    st.subheader("2. Konfigurasi Video")
    
    # Dropdown Gaya (Ini yang tadi ilang, gw balikin lagi)
    gaya = st.selectbox(
        "Gaya Visual",
        [
            "Cinematic Luxury (Mewah & Lambat)",
            "Fresh & Bright (Terang & Segar)",
            "Dark & Moody (Gelap & Elegan)",
            "Custom (Tulis Sendiri)"
        ]
    )

    # Logika Prompt Otomatis
    prompt_dasar = ""
    if gaya == "Cinematic Luxury":
        prompt_dasar = "Cinematic product shot, slow camera pan, golden hour lighting, luxury vibe, 4k, bokeh background"
    elif gaya == "Fresh & Bright":
        prompt_dasar = "Bright commercial advertisement, sunshine, fresh atmosphere, water droplets, high key lighting, 4k"
    elif gaya == "Dark & Moody":
        prompt_dasar = "Dark dramatic lighting, neon rim light, mysterious atmosphere, slow motion, smoke effect"
    
    prompt_text = st.text_area("Detail Prompt", value=prompt_dasar, height=100)
    
    # Tombol Eksekusi
    generate_btn = st.button("🚀 GENERATE VIDEO")

# --- KOLOM KANAN (HASIL) ---
with col2:
    st.subheader("3. Hasil Visual")
    
    result_container = st.container(border=True)
    
    if generate_btn:
        if not api_key_input:
            st.error("❌ Eits! Masukin API Key dulu di menu sebelah kiri (Sidebar).")
        elif not uploaded_file:
            st.toast("⚠️ Upload foto dulu bos!", icon="❌")
        else:
            with result_container:
                # Tampilan Status Loading yang Keren (Balik lagi!)
                with st.status("🤖 AI sedang bekerja...", expanded=True) as status:
                    st.write("📤 Mengupload gambar...")
                    
                    try:
                        temp_filename = "temp_upload.jpg"
                        with open(temp_filename, "wb") as f:
                            f.write(uploaded_file.getbuffer())
                        
                        url_gambar = fal_client.upload_file(temp_filename)
                        st.write("🧠 Mengirim ke Neural Network (Minimax)...")
                        
                        handler = fal_client.submit(
                            "fal-ai/minimax/video-01/image-to-video",
                            arguments={
                                "image_url": url_gambar,
                                "prompt": prompt_text,
                            },
                        )
                        result = handler.get()
                        video_url = result['video']['url']
                        
                        status.update(label="✅ Selesai!", state="complete", expanded=False)
                        
                        st.video(video_url, autoplay=True)
                        st.success("Video berhasil dibuat!")
                        st.info(f"Link: {video_url}")
                        
                    except Exception as e:
                        st.error(f"Error: {e}. (Cek saldo API Key kamu)")
    else:
        result_container.info("👈 Masukkan Key, Upload foto, lalu klik Generate.")
        # Placeholder biar cantik
        result_container.markdown(
            """
            <div style='background-color: #f0f2f6; height: 300px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #888;'>
                <h3 style='text-align: center;'>Video akan muncul di sini ✨</h3>
            </div>
            """, 
            unsafe_allow_html=True
        )