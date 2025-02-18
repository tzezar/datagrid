# Base image
FROM node:lts AS runtime
WORKDIR /app

# Copy your project files into the container
COPY . .

# Install dependencies and build your Starlight project
RUN npm install
RUN npm run build

# Expose the port for SSR (Starlight might use port 4321 for SSR or another default port)
ENV HOST=0.0.0.0
ENV PORT=3012
EXPOSE 3012

# Start the server
CMD node ./dist/server/entry.mjs
