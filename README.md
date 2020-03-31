# Sample Kontent Webhook Handlers for Javascript

This is a simple Express application that acts as an endpoint for Kentico Kontent webhooks. It implements the following

* Validate notification signatures to ensure requests are from Kontent
* Logs valid webhooks to a simple database (powered by [LokiJS](http://techfort.github.io/LokiJS/))
* Displays a basic summary of received webhooks

## Requirements

## Setup and Running

1. Clone the repository
2. Create a `.env` file in the root with a `WEBHOOK_SECRET` variable

```
WEBHOOK_SECRET=your_webhook_secret_will_go_here
```

3. Run the following commands:

```console
npm install
npm start
```

4. The application will then be available at <http://localhost:3000> (configurable in /bin/www or).
5. Use a tool like [ngrok](https://ngrok.com/) to forward external traffic to your local computer. To use ngrok, follow their [setup guide](https://dashboard.ngrok.com/get-started) and in step 4 use the port number the Express application will run on (3000 by default).
6. [Create a webhook in Kontent](https://docs.kontent.ai/tutorials/develop-apps/integrate/using-webhooks-for-automatic-updates#a-creating-a-webhook)
    1. Use one of the forwarding addresses for the webhook name and append one of the following:
        * For check-hash example: `/webhooks/check-hash`
        * For dedeliveryvent sample: `/webhooks/delivery-event`
    2. Copy the webhook secret to the `.env` file
7. Perform actions that trigger your webhook
8. Go to <http://localhost:3000> to see the log (it refreshes automatically after a few seconds)
