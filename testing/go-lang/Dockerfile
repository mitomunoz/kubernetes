FROM golang:1.20 AS builder

WORKDIR /app

COPY . .

RUN go mod init go-microservice && go mod tidy && go build -o server server.go

FROM gcr.io/distroless/base

COPY --from=builder /app/server /server

CMD ["/server"]

EXPOSE 3000