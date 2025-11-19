import { Worker } from 'bullmq';
import axios from 'axios';

const worker = new Worker(
    'bank-requests',
    async job => {
        const { token, url, request } = job.data;

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
            max: 50,
            duration: 1000
        }
    }
);

console.log('BullMQ worker started');

worker.on('failed', (job, err) => {
    console.error('Job failed', err.message);
});
