# Multi-stage Dockerfile for Node.js backend + React frontend
# Stage 1: Build React frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/client

# Copy client package files
COPY client/package*.json ./

# Install client dependencies
RUN npm ci

# Copy client source code
COPY client/ ./

# Build React app for production
RUN npm run build

# Stage 2: Build production Node.js backend
FROM node:18-alpine AS production

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy server source code
COPY server/ ./server/

# Copy built React frontend from previous stage
COPY --from=frontend-builder /app/client/build ./client/build

# Create uploads directory for file storage
RUN mkdir -p /app/uploads

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose port (Azure Container Apps uses 8080 by default)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "server/index.js"]
