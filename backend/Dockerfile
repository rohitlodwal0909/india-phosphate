FROM node:20

WORKDIR /app

# Install Ghostscript for PDF compression
RUN apt-get update \
    && apt-get install -y ghostscript \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]