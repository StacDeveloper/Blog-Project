import amqp from "amqplib";
import { redisClient } from "./redis.js";
import { pgsql } from "./db.js";
export const startCacheConsumer = async () => {
    try {
        let channel;
        const connection = await amqp.connect({
            protocol: "amqp",
            hostname: `${process.env.RABBITMQ_HOST}`,
            port: 5672,
            username: "admin",
            password: "admin123"
        });
        channel = await connection.createChannel();
        const queueName = "cache-invalidation";
        await channel.assertQueue(queueName, { durable: true });
        console.log("channel created with the queuename", queueName);
        channel.consume(queueName, async (message) => {
            if (message) {
                try {
                    const content = JSON.parse(message.content.toString());
                    console.log("message received", content);
                    if (content.action === "invalidateCache") {
                        for (const pattern of content.keys) {
                            const keys = await redisClient.keys(pattern);
                            if (keys.length > 0) {
                                await redisClient.del(JSON.stringify(keys));
                                console.log(`keys been deleted ${keys}`);
                                const category = "";
                                const searchQuery = "";
                                const cacheKey = `blogs:${searchQuery}:${category}`;
                                const blogs = await pgsql `SELECT * FROM blogs ORDER BY created_at DESC`;
                                await redisClient.set(cacheKey, JSON.stringify(blogs), { ex: 3600 });
                                console.log("Cache rebuild with key" + cacheKey);
                            }
                        }
                    }
                    channel.ack(message);
                }
                catch (error) {
                    console.error("error processing cache invalidation in blog service" + error);
                    channel.nack(message, false, true);
                }
            }
        });
    }
    catch (error) {
        console.error("startCahceConumser error", error);
    }
};
//# sourceMappingURL=consumer.js.map