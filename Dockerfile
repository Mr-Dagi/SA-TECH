# Build the React app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
COPY tailwind.config.js postcss.config.js ./
COPY vite.config.ts ./
COPY .npmrc* ./
COPY src ./src
COPY public ./public
RUN npm install
RUN npm run build

# Serve the built app with a lightweight web server
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
