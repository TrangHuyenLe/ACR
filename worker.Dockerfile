FROM node:16.19.1
USER root
RUN apt-get update && apt-get install curl gnupg -y \
  &&  wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1\
     --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*


# If running Docker >= 1.13.0 use docker run's --init arg to reap zombie processes, otherwise
# uncomment the following lines to have `dumb-init` as PID 1
# ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.2/dumb-init_1.2.2_x86_64 /usr/local/bin/dumb-init
# RUN chmod +x /usr/local/bin/dumb-init
# ENTRYPOINT ["dumb-init", "--"]

# Uncomment to skip the chromium download when installing puppeteer. If you do,
# you'll need to launch puppeteer with:
#     browser.launch({executablePath: 'google-chrome-stable'})
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
WORKDIR /code/
COPY apps/ACR-worker/ apps/ACR-worker/
COPY pnpm-workspace.yaml .
COPY nx.json .
COPY packages packages
COPY package.json .
RUN ["npm","install","-g", "pnpm"]
RUN ["npm","install","-g", "typescript"]
RUN ["pnpm","i"]
RUN npx nx build acr-worker

CMD ["npx", "nx", "run","acr-worker:start"]
