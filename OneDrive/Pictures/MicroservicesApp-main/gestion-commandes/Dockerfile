# Use the official Node.js image
FROM node:18

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Expose port (adjust if needed)
EXPOSE 5100

# Start the app
CMD ["node", "server.js"]
