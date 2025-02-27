# Use the official Bun image as the base image
FROM oven/bun:latest

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and bun.lockb
COPY package.json bun.lock ./

# Install dependencies using Bun
RUN bun install

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN bunx prisma generate

# Expose the port the app runs on
EXPOSE 3002

# Set environment variables
ENV NODE_ENV=production

# Command to run the application
CMD ["bun", "dev"]