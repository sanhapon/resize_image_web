FROM rust:1.57 as builder

WORKDIR /usr/src/app

RUN apt-get update && \
    apt-get install libssl-dev

WORKDIR /usr/src/server

COPY ./server .
RUN cargo build --release

FROM debian:buster-slim
WORKDIR /app

RUN ls -al .

COPY --from=builder /usr/src/server/target/release .
COPY  ./server/public public

EXPOSE 12345
EXPOSE 80

CMD ["./server"]
