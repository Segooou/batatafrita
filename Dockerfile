FROM node:18-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    python \
    make \
    g++ \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY ./prisma ./prisma
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
