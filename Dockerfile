FROM node:20.14.0-alpine3.20

RUN apk add --update --no-cache \
    make \
    g++ \
    jpeg-dev \
    cairo-dev \
    giflib-dev \
    pango-dev

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY ./prisma ./prisma

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
