# Base image
FROM node:22-alpine

# Set working directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Install nodemon globally for development
RUN npm install -g nodemon

# Copy app source
COPY . .

# Expose port (from .env)
EXPOSE 4000

# Default command: use nodemon in dev, node in prod
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = 'production' ]; then node server.js; else nodemon server.js; fi"]
