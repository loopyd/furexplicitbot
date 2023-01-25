FROM node:18.5.0-buster-slim
ARG LOGIN_FA_COOKIE_A
ENV LOGIN_FA_COOKIE_A=${LOGIN_FA_COOKIE_A}
ARG LOGIN_FA_COOKIE_B
ENV LOGIN_FA_COOKIE_B=${LOGIN_FA_COOKIE_B}
ARG DB_DIALECT
ENV DB_DIALECT=${DB_DIALECT}
ARG DB_HOST
ENV DB_HOST=${DB_HOST}
ARG MARIADB_DATABASE
ENV MARIADB_DATABASE=${MARIADB_DATABASE}
ARG MARIADB_USERNAME
ENV MARIADB_USERNAME=${MARIADB_USERNAME}
ARG MARIADB_PASSWORD
ENV MARIADB_PASSWORD=${MARIADB_PASSWORD}
ARG MARIADB_PORT
ENV MARIADB_PORT=${MARIADB_PORT}

# RUN apk add --no-cache git

# Create app directory
WORKDIR /usr/src/app

# Get app dependencies
COPY package*.json ./

# building app
RUN npm ci --only=production

# Bundle app source
COPY . .

# Cleanup app source
RUN rm -fv ./docker-entrypoint.sh ./Dockerfile 

# start up the bot
COPY docker-entrypoint.sh /usr/local/bin/
ENTRYPOINT ["docker-entrypoint.sh"]