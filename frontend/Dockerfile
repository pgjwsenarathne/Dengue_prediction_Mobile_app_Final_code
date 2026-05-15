# Use an official Node runtime as a parent image
FROM node:20-slim

# Set the working directory in the container
WORKDIR /app

# Install expo-cli globally
RUN npm install -g expo-cli

# Copy package files
COPY package.json package-lock.json* ./

# Install project dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Expose Metro Bundler and Web ports
EXPOSE 8081
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

# The default command to start the expo development server
# "--web" starts the web-only version if that's what's needed for portability.
# Alternatively, use "npx expo start" for a general development server.
CMD ["npx", "expo", "start", "--web"]
