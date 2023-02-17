FROM node:lts-alpine3.16

WORKDIR /app

COPY ./src /app/src
COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
COPY ./tsconfig.json /app/tsconfig.json

RUN npm run build:prod

COPY ./src/app/public /app/build/app/public

# Remove unused files
RUN rm -rf /app/src

CMD ["npm", "run", "start:prod"]
