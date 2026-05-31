# Use the official Node.js 18 alpine image for a lightweight footprint
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json to install dependencies first
COPY package*.json ./

# Install only production dependencies for a leaner image
RUN npm ci --only=production

# Copy all project source files to the container
COPY . .

# Expose port 3000 to the container network
EXPOSE 3000

# Start the application
CMD [ "node", "server.js" ]
