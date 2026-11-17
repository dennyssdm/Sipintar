FROM node:20-alpine

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application source code
COPY . .

# Ensure uploads and backups directories exist
RUN mkdir -p uploads backups

# Expose port
EXPOSE 5001

# Run server
CMD ["node", "server.js"]

