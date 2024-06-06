FROM node:18.15.0-alpine3.16

RUN apk --no-cache add \
    sudo \
    build-base \
    libcairo \
    libcairo-dev \
    libpng \
    libpng-dev \
    libjpeg-turbo \
    libjpeg-turbo-dev \
    pango \
    pango-dev \
    giflib \
    giflib-dev \
    librsvg \
    librsvg-dev

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY ./prisma ./prisma

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
