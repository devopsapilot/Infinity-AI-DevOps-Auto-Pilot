# Step 1: Use an official Node.js runtime as a parent image
FROM node:18 AS base

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Step 4: Install dependencies (npm install)
RUN npm install

# Step 5: Generate Prisma client
RUN npx prisma generate

# Step 6: Copy the rest of the application files into the container
COPY . .

# Step 7: Expose the port your app will run on (default for Next.js is 3000)
EXPOSE 3000

# Step 8: Start the Next.js development server
CMD ["npm", "run", "dev"]
