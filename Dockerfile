FROM python:3.9

WORKDIR /app

# Copy semua file yang kita upload ke dalam folder aplikasi
COPY . /app

# Install library
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Buka port 7860
EXPOSE 7860

# Jalankan server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]