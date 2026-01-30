import amqp from "amqplib"

let channel: amqp.Channel

export const connectRabbitmq = async () => {
    try {
        const connection = await amqp.connect({
            protocol: "amqp",
            hostname: `${process.env.RABBITMQ_HOST}`,
            port: 5672,
            username: "admin",
            password: "admin123"
        });
        channel = await connection.createChannel()
        console.log("Connected to rabbitmq")
    } catch (error) {
        console.log(error)
    }
}

export const publishToQueue = async (queueName: string, message: any) => {
    try {
        if (!channel) {
            console.error("Rabbitmq Channel is not initialized")
            return
        }
        await channel.assertQueue(queueName, { durable: true })
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true })
    } catch (error) {
        console.log("error from publishToQueue", error)
    }
}

export const invalidateCacheJob = async (cacheKeys: string[]) => {
    try {
        const message = {
            action: "invalidateCache",
            keys: cacheKeys
        }
        await publishToQueue("cache-invalidation", message)
        console.log("cache invalidation job published ")
    } catch (error) {
        console.log("error from invalidateCachejOB", error)
    }
}
