import type { NextFunction, Request, Response } from "express"
import { Redis } from "@upstash/redis"


interface RateLimitConfig {
    tokenPerWindow: number
    windowSizeMs: number
    tokenPerRefill: number
    refillIntervalms: number
}

interface RateLimitResult {
    allowed: boolean
    remaining: number | 0
    resetAt: number | 0
}

let redisClient: any

export const initRedis = () => {

    try {
        const redis = new Redis({
            url: process.env.REDIS_URL,
            token: process.env.REDIS_TOKEN
        })
        console.log("Redis Initialized")
        return redisClient = redis
    } catch (error: any) {
        console.log(error)
    }
}



async function checkTokenBucket(
    redis: any,
    key: string,
    config: RateLimitConfig
): Promise<RateLimitResult> {
    const now = Date.now()
    const bucketKey = `rate_limit:${key}`

    //making lua script

    const luascript = `
    local key = KEYS[1]
    local max_tokens= tonumber(ARGV[1])
    local refill_rate = tonumber(ARGV[2])
    local refill_interval = tonumber(ARGV[3])
    local now = tonumber(ARGV[4])
    local requested = tonumber(ARGV[5])
    local ttl = tonumber(ARGV[6])

    local bucket = redis.call('HMGET', key, 'tokens','last_refill')
    local tokens = tonumber(bucket[1])
    local last_refill =  tonumber(bucket[2])

    if tokens == nil then
    tokens = max_tokens
    last_refill = now

    else
        local time_passed = now - last_refill
        local refills = math.floor(time_passed / refill_interval)
        tokens = math.min(max_tokens, tokens + (refills * refill_rate))
        last_refill = last_refill + (refills * refill_interval)
    end

    local allowed = 0
    if tokens >= requested then
        tokens = tokens-requested
        allowed = 1
    end

    redis.call('HMSET', key, 'tokens', tokens, 'last_refill', last_refill)
    redis.call('EXPIRE', key, ttl)

    return {allowed, tokens, last_refill}
    `
    try {

        const result = await redis.eval(luascript,
            [bucketKey],
            [config.tokenPerWindow.toString(),
            config.tokenPerRefill.toString(),
            config.refillIntervalms.toString(),
            now.toString(),
            "1",
            "3600"
            ]
        ) as number[]
        console.log(result)
       
        

        const [allowed, remaining, last_refill] = result

        return {
            allowed: allowed === 1,
            remaining: Math.floor(remaining ?? 0),
            resetAt: allowed === 1 ? Date.now() : (last_refill ?? Date.now()) + config.refillIntervalms
        }

    } catch (error: any) {
        console.log("Rate limit failed", error.message)
        return {
            allowed: true,
            remaining: config.tokenPerWindow,
            resetAt: now + config.refillIntervalms
        }
    }

}

export const createrateLimiter = (config: RateLimitConfig) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const identifier = req.ip || req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || "unknown"
        const result = await checkTokenBucket(redisClient, identifier, config)

        res.setHeader('X-RateLimit-Limit', config.tokenPerWindow)
        res.setHeader('X-RateLimit-Remaining', result.remaining)
        res.setHeader('X-RateLimit-Reset', result.resetAt)

        if (!result.allowed) {
            res.setHeader('Retry After', Math.ceil((result.resetAt - Date.now()) / 1000))
            return res.status(429).json({ success: false, message: "Too many attempts try after some time" })
        }
        next()
    }
}


