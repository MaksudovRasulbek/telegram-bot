// server.js
import Fastify from 'fastify';
import mongoose from "mongoose";
import { Telegraf, session } from "telegraf";
import { ENV } from "./constants";
import allControllers from "./controllers";
import allMiddlewares from "./middlewares";
import allScenes from "./scenes";

const fastify = Fastify({ logger: true });

async function startBot() {
  // Create the bot using the token
  const bot = new Telegraf(ENV.token);

  // Connect to MongoDB
  await mongoose.connect(ENV.mongoUri)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err));
    await mongoose.set("debug", true);


  // Apply middlewares
  allMiddlewares(bot);

  // Use session middleware
  bot.use(session());

  // Apply all scenes
  allScenes(bot);

  // Apply all controllers
  allControllers(bot);

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
}

// Start the bot
startBot();

// Define a route to check the server status
fastify.get('/', async (request, reply) => {
  return { status: 'Server is running' };
});

// Start the Fastify server
const startServer = async () => {
  try {
    await fastify.listen({ port: 3031, host:'0.0.0.0'});
    console.log("Fastify server is running on http://localhost:3031");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://demo53146:<db_password>@cluster0.wi7qr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

startServer();
