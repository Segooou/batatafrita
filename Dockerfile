FROM node:18-alpine

RUN apk add --no-cache \
    build-base \
    python \
    make \
    g++ \
    cairo-dev \
    pango-dev \
    jpeg-dev

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY ./prisma ./prisma
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
