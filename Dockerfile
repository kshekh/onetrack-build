# Build Image
FROM node:19 as builder

WORKDIR /usr/src/app

# Copy package json
COPY package.json .

RUN npm install

COPY . .

RUN npm run build:css

RUN npm run build

# Deployment image
FROM node:19

WORKDIR /usr/src/app

# Copy needed data
COPY package*.json ./

# Copy from builder image
COPY --from=builder /usr/src/app/build/ build/
COPY --from=builder /usr/src/app/node_modules/ node_modules/
COPY server/server.js server/server.js
COPY server/handlers.js server/handlers.js
COPY server/countryCodesHelper.js server/countryCodesHelper.js

ENTRYPOINT ["npm", "start"]
