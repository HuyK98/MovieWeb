# Sử dụng Node.js làm base image
FROM node:16

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Expose cổng mà backend sử dụng (ví dụ: 5000)
EXPOSE 5000

# Lệnh để chạy ứng dụng
CMD ["npm", "start"]