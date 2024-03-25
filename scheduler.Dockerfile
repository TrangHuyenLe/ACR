FROM node:16.19.0
WORKDIR /code/
COPY apps/ACR-scheduler/ apps/ACR-scheduler/
COPY pnpm-workspace.yaml .
COPY nx.json .
COPY packages packages
COPY package.json .
RUN ["npm","install","-g", "pnpm"]
RUN ["npm","install","-g", "typescript"]
RUN ["pnpm","i"]
RUN npx nx build acr-scheduler

CMD ["npx", "nx", "run","acr-scheduler:start"]
