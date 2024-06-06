FROM node:18.15.0-alpine3.16

WORKDIR /app

RUN apk update && apk upgrade

COPY package.json ./
COPY tsconfig.json ./
COPY ./prisma ./prisma

RUN apk add --no-cache \
    build-base \
    python \
    make \
    g++ \
    cairo-dev \
    pango-dev \
    jpeg-dev

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
