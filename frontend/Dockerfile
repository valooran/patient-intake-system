# --- Stage 1: Build the React App ---
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install ALL dependencies (including devDependencies like Vite/Typescript)
RUN npm ci

# Copy source code
COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the project (creates the 'dist' folder)
RUN npm run build

# --- Stage 2: Serve with Nginx ---
FROM nginx:alpine

# Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from Stage 1 to Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy a simple Nginx config to handle React Router (Client-side routing)
# We will create this config file in the next step
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
