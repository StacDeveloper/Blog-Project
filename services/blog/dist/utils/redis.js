import { Redis } from "@upstash/redis";
import { createClient } from "redis";
// export const redisClient = () => {
//     try {
//         const redisConnection = new Redis({
//             url: process.env.REDIS_URL!,
//             token: process.env.REDIS_TOKEN!
//         })
//         console.log("redis connected")
//         return redisConnection
//     } catch (error) {
//         console.log(error)
//     }
// }
export const redisClient = new Redis({
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN
});
// export const redisClient = createClient({
//     url: process.env.REDIS_URL!
// }) 
//# sourceMappingURL=redis.js.map