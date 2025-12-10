FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --production

# Copy sources
COPY src ./src

# Final image
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

# Copy node_modules from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src

EXPOSE 4000
CMD ["node", "src/server.js"]
