# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:6.9.5-alpine as build-stage

WORKDIR /app

COPY ./ /app/

RUN npm install -g @angular/cli@1.0.0-beta.28.3 --unsafe-perm=true --allow-root
RUN npm rebuild node-sass@4.11.0

#RUN ls

#RUN npm run build -- --output-path=./dist/out --configuration production
RUN ng build --prod --base-href / --environment=prod --output-hashing=all

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
# There can only be one non-build from statement
FROM nginx
EXPOSE 80

COPY --from=build-stage /app/ROOT.war/ /usr/share/nginx/html

# Copy the default nginx.conf 
#COPY ./default.conf /etc/nginx/conf.d/default.conf