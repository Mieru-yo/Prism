FROM node:18-alpine

# Install dependencies and enable corepack
RUN apk add --no-cache git
RUN corepack enable

# Set working directory
WORKDIR /hedgedoc

# Copy package files
COPY package*.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn

# Install dependencies
RUN yarn install --immutable

# Copy source code
COPY . .

# Build frontend
RUN yarn build

# Expose port
EXPOSE 3000

# Start command
CMD ["yarn", "start"]