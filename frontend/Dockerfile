FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the frontend code and compile it
COPY . .
RUN npm run build

# Nginx web server
FROM nginx:alpine

# Copy the finished, static files from the Builder stage into Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 (the default internet port)
EXPOSE 80

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]