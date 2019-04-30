FROM node:12.0.0-alpine
LABEL "author"="<zsea@tao11.net>"
ENV  TIME_ZONE Asiz/Shanghai
RUN echo 'http://mirrors.aliyun.com/alpine/latest-stable/main' > /etc/apk/repositories
RUN echo 'http://mirrors.aliyun.com/alpine/latest-stable/community' >> /etc/apk/repositories
RUN apk update
RUN apk add --no-cache tzdata
RUN cp -r -f /usr/share/zoneinfo/Hongkong /etc/localtime
COPY . /app/
WORKDIR /app/
RUN npm install
ENTRYPOINT []
CMD node app.js