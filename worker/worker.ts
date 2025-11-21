import { Worker } from 'bullmq';
import axios from 'axios';
import 'dotenv/config';

const worker = new Worker(
    'bank-requests',
    async job => {
        const { token, url, request } = job.data;

        console.log("[STARTING]: ", url);

        try {
            const res = await axios({
                ...request,
                url,
                headers: {
                    ...request.headers,
                    Authorization: `Bearer ${token}`,
                    "X-Requesting-Bank": process.env.CLIENT_ID,
                    'Content-Type': 'application/json',
                },
                timeout: 10000
            });

            return res.data;

        } catch (err: any) {
            if (err.response?.status === 429) {
                throw new Error('RATE_LIMIT');
            }
            throw err;
        }
    },
    {
        connection: {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT)
        },
        concurrency: 1,
        limiter: {
            max: 30,
            duration: 1000
        }
    }
);

console.log('BullMQ worker started');

worker.on('active', (job) => {
    console.log(`[ACTIVE] id=${job.id} name=${job.name}`);
});
worker.on('completed', (job, result) => {
    console.log(`[COMPLETED] id=${job.id}`);
});
worker.on('failed', (job, err) => {
    console.log(`[FAILED] id=${job?.id}`, err.message);
});
worker.on('progress', (job, progress) => {
    console.log(`[PROGRESS] id=${job.id}`, progress);
});

worker.on('error', (err) => {
    console.error(`[WORKER ERROR]`, err);
});
