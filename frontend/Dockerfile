# Stage 1: Build the application
FROM node:latest AS builder

# Set the working directory in the Docker image
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock if using yarn)
COPY package.json ./

# Install dependencies in the image
RUN npm install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Run the server
FROM node:latest

# Set the working directory in the Docker image
WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Set the port that the container will listen on
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "start"]
