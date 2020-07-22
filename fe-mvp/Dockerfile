FROM nginx:1.14.1-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY /dist/fe-mvp /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/
CMD ["nginx", "-g", "daemon off;"]
