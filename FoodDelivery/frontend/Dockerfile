# -------------------- STAGE 1: BUILD REACT APP --------------------
    FROM node:20-alpine as builder

    # KHAI BÁO ARG để nhận VITE_API_URL từ docker-compose.yml
    ARG VITE_API_URL 
    
    WORKDIR /app/frontend
    
    COPY package*.json ./
    RUN npm install
    
    # Sao chép mã nguồn và build
    COPY . .
    
    # Lệnh build: Vite sẽ tự động nhúng VITE_API_URL vào mã nguồn tĩnh
    RUN npm run build
    
    # -------------------- STAGE 2: SERVE WITH NGINX --------------------
    FROM nginx:alpine
    
    # Cấu hình Nginx
    RUN rm /etc/nginx/conf.d/default.conf
    
    # Sao chép các tệp tĩnh đã build và cấu hình Nginx
    COPY --from=builder /app/frontend/dist /usr/share/nginx/html
    COPY default.conf /etc/nginx/conf.d/default.conf
    
    EXPOSE 80
    
    CMD ["nginx", "-g", "daemon off;"]