# Sử dụng image Node.js LTS chính thức làm base image
FROM node:20-alpine

# Đặt thư mục làm việc bên trong container
WORKDIR /app/backend

# Sao chép các tệp package.json và package-lock.json (trước)
# để tận dụng Docker cache cho việc cài đặt dependencies
COPY package*.json ./

# Cài đặt dependencies. Sử dụng --omit=dev vì nodemon chỉ dùng khi dev.
# Bạn có thể giữ nodemon nếu muốn chạy dev bên trong container.
RUN npm install --omit=dev

# Sao chép toàn bộ mã nguồn còn lại
COPY . .

# Mở cổng mà Express server lắng nghe (xem server.js, bạn dùng PORT 10000)
EXPOSE 10000

# Lệnh mặc định để chạy ứng dụng
# Chú ý: Ở môi trường Production, bạn KHÔNG nên dùng nodemon.
# Lệnh 'start' được định nghĩa trong package.json
CMD ["npm", "start"]