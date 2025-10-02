# Use an official Node.js image to build the app
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the production-ready React app
RUN npm run build

# Use a lightweight web server to serve the build
FROM nginx:alpine

# Copy the build files from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to serve the frontend
EXPOSE 80

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
