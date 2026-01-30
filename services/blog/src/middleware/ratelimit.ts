import type { NextFunction, Request, Response } from "express";
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

let redis = Redis

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
    local max_tokens = tonumber(ARGV[1])
    local refill_rate = tonumber(ARGV[2])
    local refill_interval = tonumber(ARGV[3])
    local now = tonumber(ARGV[4])
    local requested = tonumber(ARGV[5])
    local ttl = ttl(ARGV[6])

    local bucket = redis.call('HMGET', key, 'tokens','last_refill')
    local tokens = tonumber(bucket[1])
    local last_refill = tonumber(bucket[2])

    if tokens == nil then
    tokens = max_tokens
    last_refill = now

    else
        local time_passed = now - last_refill
        local refills =  math.floow(time_passed / refill interval)
        tokens = math.min(max_tokens, tokens + (refills * refill_rate))
        last_refill = last_refill + (refills * refill_interval)
    end

    local allowed = 0
    if tokens>= requested then
        tokens = tokens - requested
        allowed = 1
    end 

    redis.call('HMSET', key, 'tokens', tokens, 'last_refill', last_refill)
    redis.call('EXPIRE',key, ttl)

    return {allowed, tokens, last_refill}
    `
    try {
        const result = await redis.eval(luascript,
            [bucketKey],
            [config.tokenPerWindow.toString(),
            config.refillIntervalms.toString(),
            config.tokenPerRefill.toString(),
            now.toString(),
                "1",
                "3600"
            ]) as number[]

        const [allowed, remaining, last_refill] = result

        return {
            allowed: allowed === 1,
            remaining: Math.floor(remaining ?? 0),
            resetAt: allowed === 1 ? Date.now() : (last_refill ?? Date.now()) + config.refillIntervalms
        }

    } catch (error: any) {
        console.log(error)
        return {
            allowed: true,
            remaining: config.tokenPerWindow,
            resetAt: now + config.refillIntervalms
        }
    } 

}

export const createrateLimiter = (config: RateLimitConfig) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const identifier = req.ip || req.headers['x-forwareded-for']?.toString() || req.socket.remoteAddress || "Bhoot hai banda"
        const result = await checkTokenBucket(redis, identifier, config)

        res.setHeader('X-RateLimit-Limit', config.tokenPerWindow)
        res.setHeader('X-RateLimit-Remaining', result.remaining)
        res.setHeader('X-RateLimit-Reset', result.resetAt)

        if (!result.resetAt) {
            res.setHeader('Retry After Some time', "You are sending too many request at once")
            return res.status(429).json({ success: false, message: "Too many req at once" })
        }
        next()

    }
}