# Use Node 18 Alpine for a small footprint
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files first (better caching)
COPY package.json package-lock.json ./

# Install only production dependencies
# (If you need devDependencies for building, remove '--only=production')
RUN npm ci

# Copy the rest of the source code
COPY . .

# Expose port 5000 (matches your index.js)
EXPOSE 5000

# Start the application
CMD ["node", "src/index.js"]
