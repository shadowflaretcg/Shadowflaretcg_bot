
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).send("Telegram bot is running!");
  }

  const secret = process.env.WEBHOOK_SECRET;

  if (
    !secret ||
    req.headers["x-telegram-bot-api-secret-token"] !== secret
  ) {
    return res.status(401).send("Unauthorized");
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const message = req.body?.message;
  const chatId = message?.chat?.id;
  const text = message?.text || "";

  if (!token || !chatId) {
    return res.status(200).send("No message to process");
  }

  let reply = "You said: " + text;

  if (text === "/start") {
    reply = "Welcome! 👋 Your Telegram bot is working.";
  } else if (text === "/help") {
    reply = "Send me a message and I'll reply to you.";
  }

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: reply,
      }),
    }
  );

  if (!response.ok) {
    console.error("Telegram sendMessage failed");
  }

  return res.status(200).send("OK");
}
