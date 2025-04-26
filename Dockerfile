# Use Node.js LTS version as the base image
# slim version reduces image size by excluding unnecessary tools
FROM node:20-slim

# Set the working directory inside the container
# All subsequent commands will run from this directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if exists)
# This is done first to leverage Docker's cache for faster builds
COPY package*.json ./

# Install project dependencies and nodemon globally
# nodemon is needed for development to auto-restart server on code changes
RUN npm install && npm install -g nodemon

# Copy all project files into the container
# This is done after installing dependencies to avoid unnecessary rebuilds
COPY . .

# Set environment variables
ENV PORT=8080

# Document which port the container will listen on
# This is just documentation, actual port mapping is done in docker-compose
EXPOSE 8080

# Command to run when container starts
# Uses npm start which runs nodemon server.js as defined in package.json
CMD ["npm", "start"]