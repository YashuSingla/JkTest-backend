# ------------ Stage 1: Build the NestJS application ------------
    FROM node:18-alpine AS builder

    # Set working directory inside the container
    WORKDIR /app
    
    # Copy package files to install dependencies
    COPY package*.json ./
    
    # Install dependencies
    RUN npm install --legacy-peer-deps
    
    # Copy the rest of the application source code
    COPY . .
    
    # Build the NestJS project (output goes to /app/dist)
    RUN npm run build
    
    
    # ------------ Stage 2: Run the compiled app ------------
    FROM node:18-alpine
    
    # Set working directory
    WORKDIR /app
    
    # Copy compiled code and node_modules from builder
    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/package*.json ./
    
    # Install only production dependencies
    RUN npm install --only=production
    
    # Expose the default NestJS port
    EXPOSE 3000
    
    # Command to run the application
    CMD ["node", "dist/main"]