"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const axios_1 = __importDefault(require("axios"));
require("dotenv/config");
const worker = new bullmq_1.Worker('bank-requests', (job) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { token, url, request } = job.data;
    try {
        const res = yield (0, axios_1.default)(Object.assign(Object.assign({}, request), { url, headers: Object.assign(Object.assign({}, request.headers), { Authorization: `Bearer ${token}`, "X-Requesting-Bank": process.env.CLIENT_ID, 'Content-Type': 'application/json' }), timeout: 10000 }));
        return res.data;
    }
    catch (err) {
        if (((_a = err.response) === null || _a === void 0 ? void 0 : _a.status) === 429) {
            throw new Error('RATE_LIMIT');
        }
        throw err;
    }
}), {
    connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
    },
    concurrency: 1,
    limiter: {
        max: 50,
        duration: 1000
    }
});
console.log('BullMQ worker started');
worker.on('failed', (job, err) => {
    console.error('Job failed', err.message);
});
