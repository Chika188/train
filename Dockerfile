# 构建阶段
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install --registry=https://registry.npmmirror.com
RUN npm install -D sass-embedded
RUN npm install axios --registry=https://registry.npmmirror.com

RUN npm run build

# 部署阶段（使用 nginx 作为静态服务器）
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]