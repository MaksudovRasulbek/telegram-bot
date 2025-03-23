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
// server.js
const fastify_1 = __importDefault(require("fastify"));
const mongoose_1 = __importDefault(require("mongoose"));
const telegraf_1 = require("telegraf");
const constants_1 = require("./constants");
const controllers_1 = __importDefault(require("./controllers"));
const middlewares_1 = __importDefault(require("./middlewares"));
const scenes_1 = __importDefault(require("./scenes"));
const fastify = (0, fastify_1.default)({ logger: true });
function startBot() {
    return __awaiter(this, void 0, void 0, function* () {
        // Create the bot using the token
        const bot = new telegraf_1.Telegraf(constants_1.ENV.token);
        // Connect to MongoDB
        yield mongoose_1.default.connect(constants_1.ENV.mongoUri)
            .then(() => console.log("MongoDB connected"))
            .catch((err) => console.log("MongoDB connection error:", err));
        yield mongoose_1.default.set("debug", true);
        // Apply middlewares
        (0, middlewares_1.default)(bot);
        // Use session middleware
        bot.use((0, telegraf_1.session)());
        // Apply all scenes
        (0, scenes_1.default)(bot);
        // Apply all controllers
        (0, controllers_1.default)(bot);
        // Catch errors
        bot.catch((err, ctx) => {
            console.log("Bot error:", String(err));
        });
        // Launch the bot
        bot.launch({ dropPendingUpdates: true });
        console.log("Bot is running");
        // Handle unhandled promise rejections
        process.on("unhandledRejection", (err, promise) => {
            console.log("Unhandled Rejection at:", promise, "reason:", err);
            process.exit(1);
        });
    });
}
// Start the bot
startBot();
// Define a route to check the server status
fastify.get('/', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    return { status: 'Server is running' };
}));
// Start the Fastify server
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield fastify.listen({ port: 3031, host: '0.0.0.0' });
        console.log("Fastify server is running on http://localhost:3031");
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
});
startServer();
