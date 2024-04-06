# Use the official Node.js 16 image as a parent image
FROM node:lts-alpine3.19

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of your application's code
COPY . .

# Bind the application to port 3000
EXPOSE 3000

# Define the Docker container's command to run your application
CMD [ "node", "app.js" ]
