"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rabbitmqConnectionPool = exports.mongoConnectionPool = void 0;
class MongoConnectionPool {
    constructor() {
        this.clients = [];
        this.currentClientIdx = 0;
    }
    addClient(client) {
        this.clients.push(client);
    }
    getClient() {
        return this.clients[this.currentClientIdx];
    }
}
exports.mongoConnectionPool = new MongoConnectionPool();
class RabbitMQConnectionPool {
    constructor() {
        this.channels = [];
        this.currentChannelIdx = 0;
    }
    addChannel(channel) {
        this.channels.push(channel);
    }
    getChannel() {
        return this.channels[this.currentChannelIdx];
    }
}
exports.rabbitmqConnectionPool = new RabbitMQConnectionPool();
