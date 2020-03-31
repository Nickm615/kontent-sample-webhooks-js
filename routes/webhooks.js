const express = require("express");
const router = express.Router();
const database = require(`../utils/database`);
const webhookHelper = require("wip-webhook-helper");

const signatureHelper = new webhookHelper.SignatureHelper();
const secret = process.env.WEBHOOK_SECRET;
const signatureHeader = "x-kc-signature";

router.get("/", function(req, res, next) {
  const webhookCollection = database.getCollection("webhooks");
  var output = webhookCollection.chain().simplesort("meta.created", true).data();

  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({reports: output }));
});

router.get("/count", function(req, res, next) {
  const webhookCollection = database.getCollection("webhooks");
  var count = webhookCollection.count();

  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ count }));
});

router.post("/check-hash", function(req, res, next) {
  const hash = signatureHelper.getHashFromString(req.rawBody, secret);
  const expectedHash = req.header(signatureHeader);
  const hashesMatch = hash === expectedHash;

  const message = `Calculated hash ${
    hashesMatch ? "matches" : "doesn't match"
  } the expected hash.`;

  const data = {
    calculatedHash: hash,
    expectedHash
  };

  const record = createWebhookRecord({
    endpoint: `check-hash`,
    message,
    data,
    webhookBody: req.body
  });

  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(record));
});

router.post("/delivery-event", function(req, res) {
  const isValid = validateWebhook(req, res);
  if (!isValid) return;

  const action = verbifyOperation(req.body.message.operation);
  console.log(req.body.data.items[0].id)
  const itemCount = req.body.data.items ? req.body.data.items.length : 0;

  const message = `${itemCount} ${
    itemCount === 1 ? "item was" : "items were"
  } ${action}`;
  const data = null;

  const record = createWebhookRecord({
    endpoint: `delivery-event`,
    message,
    data,
    webhookBody: req.body
  });

  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(record));
});

function createWebhookRecord({ endpoint, message, data, webhookBody }) {
  let record = {
    endpoint,
    message,
    data,
    webhookBody
  };

  const webhookCollection = database.getCollection("webhooks");
  webhookCollection.insert(record);

  return record;
}

function validateWebhook(req, res) {
  const expectedHash = req.header(signatureHeader);
  var isFromKontent = signatureHelper.isValidSignatureFromString(
    req.rawBody,
    secret,
    expectedHash
  );

  if (!isFromKontent) {
    const calculatedHash = signatureHelper.getHashFromString(req.rawBody, secret)
    res.status(403).end(`Not valid webhook from Kentico Kontent. Expected ${expectedHash}, got ${calculatedHash}`);
  }

  return isFromKontent;
}

function verbifyOperation(operation) {
  switch (operation) {
    case "upsert":
      return "upserted";
    case "archive":
      return "archived";
    case "change_workflow_step":
      return "moved to another workflow step";
    case "restore":
      return "restored";
    case "publish":
      return "published";
    case "unpublish":
      return "unpublished";
  }
}

module.exports = router;
