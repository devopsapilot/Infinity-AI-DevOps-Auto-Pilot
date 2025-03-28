# Use Node.js LTS image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install 
# Copy Prisma schema before running `npx prisma generate`
COPY prisma ./prisma



# Generate Prisma client
RUN npx prisma generate
# Copy the rest of the application code
COPY . .

COPY .env.local ./

COPY .env.local ./.env
# Print .env.local content (For Debugging)
RUN cat .env.local

# List files after copying application code
RUN ls -la /app

# Build Next.js project
# RUN npm run build

# Expose Next.js default port
EXPOSE 3000

# Start the application
CMD ["npm", "run","dev"]
