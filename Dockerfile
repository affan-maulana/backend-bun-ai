# Use the official Bun image as the base image
FROM oven/bun:latest

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and bun.lockb or bun.lock
COPY package.json ./
COPY bun.lockb* bun.lock* ./

# Install dependencies using Bun
# RUN bun install

# Copy the rest of the application code
COPY . .

# Build the application
# RUN bun run build


# Generate Prisma client
# RUN bunx prisma migrate dev --name init

# Expose the port the app runs on
EXPOSE 3002

# Set environment variables
ENV NODE_ENV=production

# Command to run the application
CMD ["bun", "dev"]