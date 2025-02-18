ARG NODE_VERSION=20-alpine
FROM node:${NODE_VERSION} AS builder

LABEL Developers="Sebastian Drozd"

WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install all dependencies including devDependencies
RUN npm ci

# Copy all other source files
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM node:${NODE_VERSION}

WORKDIR /app

# Copy build output and package.json from the builder stage
# Adjusting to copy from the correct location for SvelteKit builds
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# No need to run npm ci again if we copy node_modules
# If you prefer a clean install, uncomment this line:
# RUN npm ci --only=production

# Expose the port the app runs on
EXPOSE 3002

# Start the app
CMD ["node", "build"]