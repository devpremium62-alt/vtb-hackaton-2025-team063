import {Injectable} from '@nestjs/common';
import {Queue, QueueEvents} from "bullmq";

@Injectable()
export class BanksQueueService {
    public queue: Queue;
    public events: QueueEvents;

    constructor() {
        const connection = {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
        };

        this.queue = new Queue('bank-requests', { connection });

        this.events = new QueueEvents('bank-requests', { connection });
        this.events.on('error', err => console.error('QueueEvents error:', err));
    }

    async addJob(url: string, token: string, bankKey: string, request: any) {
        return this.queue.add('bank-request', {url, token, bankKey, request});;
    }
}
