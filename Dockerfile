FROM node:8

WORKDIR /app

COPY . ./

RUN apt-get update \
    && apt-get install -qq libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev build-essential g++ fontconfig

# COPY './PingFangMedium.ttf' '/usr/share/fonts/PingFangMedium.ttf'
COPY './fonts' '/usr/share/fonts'
# RUN fc-list :lang=zh
RUN cd /bin && ln -sf bash /bin/sh
RUN npm i
# RUN npm install canvas

EXPOSE 7100

CMD npm run docker-start
