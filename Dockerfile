# Use Playwright base image (includes browsers)
FROM mcr.microsoft.com/playwright:v1.43.0-jammy

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy framework code
COPY . .

# Install Playwright browsers (optional, already included usually)
RUN npx playwright install --with-deps

# Run tests (default command)
CMD ["npx", "playwright", "test"]