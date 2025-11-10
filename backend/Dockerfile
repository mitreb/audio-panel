FROM node:25-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client and build
RUN npm run build

# Production stage
FROM node:25-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies only
RUN npm ci --only=production

# Generate Prisma Client
RUN npx prisma generate

# Copy built application
COPY --from=builder /app/dist ./dist

# Create uploads directory (for local development fallback)
RUN mkdir -p uploads

# Expose port (Cloud Run will set PORT env var, typically 8080)
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
