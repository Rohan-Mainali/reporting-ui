FROM node:16.14.0-alpine3.15 as builder
ENV REACT_APP_JSON_ENDPOINT=""
ENV REACT_APP_BACKEND_ENDPOINT=""
ENV REACT_APP_SESSION_ENDPOINT="https://api.dentira.com"
ENV REACT_APP_REDIRECT_URL="https://www.dentira.com/login"
ENV REACT_APP_SESSION_ENDPOINT_AU="https://au-api.dentira.com"
ENV REACT_APP_REDIRECT_URL_AU="https://au.dentira.com/login"
ENV REACT_APP_SESSION_ENDPOINT_NZ="https://nz-api.dentira.com"
ENV REACT_APP_REDIRECT_URL_NZ="https://nz.dentira.com/login"
ENV REACT_APP_SESSION_ENDPOINT_CA="https://123api.dentira.com"
ENV REACT_APP_REDIRECT_URL_CA="https://canada.dentira.com/login"
ENV REACT_APP_API_KEY="fb4a6b72-a08a-4331-8d95-c7046ec6cd22"
WORKDIR /build
COPY . /build
RUN npm install
RUN npm run build

FROM httpd:2.4.46 as runtime
COPY --from=builder /build/build /usr/local/apache2/htdocs
