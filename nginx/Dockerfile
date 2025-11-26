FROM nginx:latest
RUN apt-get update && apt-get install -y ca-certificates
COPY mkcert-rootCA.crt /usr/local/share/ca-certificates/mkcert-rootCA.crt
RUN update-ca-certificates