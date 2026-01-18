# Build Stage
FROM node:22-bookworm-slim AS builder

WORKDIR /app

ENV BUILD_TIMESTAMP=202601180500

ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Debug build args
RUN echo "Building with Supabase URL: ${VITE_SUPABASE_URL}" && \
    echo "Building with Anon Key length: ${#VITE_SUPABASE_ANON_KEY}"

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build for production
RUN npm run build

# Run Stage
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
