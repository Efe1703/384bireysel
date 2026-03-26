# Resmi Node.js imajını kullanıyoruz
FROM node:22-alpine

# Konteyner içindeki çalışma dizini
WORKDIR /app

# Paket dosyalarını kopyala ve kurulumları yap
COPY package*.json ./
RUN npm install

# Tüm React kodlarını kopyala
COPY . .

# Vite'in varsayılan olarak çalıştığı portu açıyoruz
EXPOSE 5173

# Uygulamayı dışarıya açarak başlatma komutu
CMD ["npm", "run", "dev", "--", "--host"]