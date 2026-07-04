# ============================================
# STAGE 1: Build Stage
# ============================================
FROM node:24-alpine AS builder

WORKDIR /app

# Install Yarn (Alpine doesn't include it by default)
RUN apk add --no-cache yarn

# Copy package files first for better caching
COPY package.json yarn.lock ./

# Install ALL dependencies (including devDependencies needed for build)
RUN yarn install --frozen-lockfile --production=false

# Copy source code
COPY . .

# Set build-time environment variables (if needed)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build the Next.js application
RUN yarn build

# ============================================
# STAGE 2: Production Stage
# ============================================
FROM node:24-alpine AS runner

WORKDIR /app

# Install Yarn
RUN apk add --no-cache yarn

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 nextjs

# Copy built application from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/public ./public

# Set correct permissions
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose the Next.js port
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]