# Stage 1: build
FROM node:16-alpine as build

WORKDIR /dist

# ENV PATH /dist/node_modules/.bin:$PATH
# # Build args
# # ARG REACT_APP_CONFIG_SERVICE
# # ARG REACT_APP_SOCKET_URL

# # # Environment vars
# ENV REACT_APP_CONFIG_SERVICE=$REACT_APP_CONFIG_SERVICE
# ENV REACT_APP_SOCKET_URL=$REACT_APP_SOCKET_URL

COPY . .

RUN npm i && npm run build

# Stage 2: prod
FROM nginx:1.21.5-alpine

COPY --from=build /dist/build /usr/share/nginx/html

COPY --from=build /dist/nginx.conf /etc/nginx/conf.d/default.conf

CMD [ "nginx", "-g", "daemon off;" ]