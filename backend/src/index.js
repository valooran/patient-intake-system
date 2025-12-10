const crypto = require('crypto');
if (!global.crypto) {
  global.crypto = crypto;
}

const { SecretClient } = require("@azure/keyvault-secrets");
const { DefaultAzureCredential } = require("@azure/identity");

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const credential = new DefaultAzureCredential();
const keyVaultUrl = process.env.KEY_VAULT_URL;
const client = new SecretClient(keyVaultUrl, credential);


async function startServer() {

  const appInsights = require('applicationinsights');
  const appKey = (await client.getSecret("APP-INSIGHTS-KEY"));
  appInsights
    .setup(appKey.value)
    .setAutoCollectConsole(true, true)
    .start();

  const app = express();
  app.use(cors());
  app.use(express.json());

  const secret = await client.getSecret("OPENAI-API-KEY");
  process.env.OPENAI_API_KEY = secret.value;

  const mongoose = require("mongoose");
  const dbConnectionURI = await client.getSecret("MONGO-URI");
  mongoose
    .connect(dbConnectionURI.value)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error(err));

  app.use("/api/auth", require("./routes/auth"));
  app.use("/api/appointments", require("./routes/appointments"));
  app.use("/api/feedback", require("./routes/feedback"));
  app.use("/api/chat", require("./routes/chat"));

  const PORT = await client.getSecret("PORT");
  app.listen(PORT.value, () => console.log(`Server running on port ${PORT.value}`));
}

startServer();