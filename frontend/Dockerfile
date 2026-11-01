# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build the production React files
ENV REACT_APP_API_URL=""
RUN npm run build


# Stage 2: Serve the React files using NGINX
FROM nginx:alpine

# Remove the default NGINX website
RUN rm -rf /usr/share/nginx/html/*

# Copy the production React build into NGINX
COPY --from=build /app/build /usr/share/nginx/html

# Copy our custom NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]