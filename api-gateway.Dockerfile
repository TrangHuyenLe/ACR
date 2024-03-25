FROM node:16.19.0
WORKDIR /code/
COPY apps/ACR-api-gateway/ apps/ACR-api-gateway/
COPY pnpm-workspace.yaml .
COPY nx.json .
COPY packages packages
COPY package.json .
RUN ["npm","install","-g", "pnpm"]
RUN ["npm","install","-g", "typescript"]
RUN ["pnpm","i"]
RUN npx nx build acr-api-gateway

CMD ["npx", "nx", "run","acr-api-gateway:start"]
