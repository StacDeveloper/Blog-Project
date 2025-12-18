import amqp from "amqplib";
let channel;
export const connectRabbitmq = async () => {
    try {
        const connection = await amqp.connect({
            protocol: "amqp",
            hostname: "localhost",
            port: 5672,
            username: "admin",
            password: "admin123"
        });
        channel = await connection.createChannel();
        console.log("Connected to rabbitmq");
    }
    catch (error) {
        console.log(error);
    }
};
export const publishToQueue = async (queueName, message) => {
    try {
        if (!channel) {
            console.error("Rabbitmq Channel is not initialized");
            return;
        }
        await channel.assertQueue(queueName, { durable: true });
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
    }
    catch (error) {
        console.log("error from publishToQueue", error);
    }
};
export const invalidateCacheJob = async (cacheKeys) => {
    try {
        const message = {
            action: "invalidateCache",
            keys: cacheKeys
        };
        await publishToQueue("cache-invalidation", message);
        console.log("cache invalidation job published ");
    }
    catch (error) {
        console.log("error from invalidateCachejOB", error);
    }
};
// export const updateBlogs = async (queueName: string, keys: string[]) => {
//     try {
//         if (!channel) {
//             console.error("no channel exist")
//             return
//         }
//         const msg = {
//             action: "update-blog",
//             keys: keys
//         }
//         channel.assertQueue(queueName, { durable: true })
//         channel.sendToQueue(queueName, Buffer.from(JSON.stringify(msg)))
//     } catch (error) {
//         console.error("error from update blogs", error)
//     }
// }
//# sourceMappingURL=rabbitmq.js.map