# Resmi Node.js imajını kullanıyoruz
FROM node:22-alpine

# Konteyner içindeki çalışma dizinini belirliyoruz
WORKDIR /app

# Sadece package.json dosyalarını kopyalayıp npm install yapıyoruz 
COPY package*.json ./
RUN npm install

# Geri kalan tüm kodları kopyalıyoruz
COPY . .

# Uygulamanın çalışacağı portu açıyoruz
EXPOSE 5000

# Uygulamayı başlatma komutu
CMD ["npm", "start"]