import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const TOKEN = '8089972530:AAGEOXLz0dhspq5pPeKxZy-pwanAkyC0u7c';
const CHAT_ID = '-1002639424673';

app.use(express.static(__dirname));
app.use(express.json());

app.post('/send', async (req, res) => {
  const { name, phone, service, formType } = req.body;

  let formLabel = "Заявка";
  if (formType === "full") formLabel = "Заявка з форми";
  else if (formType === "short") formLabel = "Виклик замірника";

  let text = `<b>${formLabel}</b>\n`;
  if (name) text += `👤 Ім’я: ${name}\n`;
  if (phone) text += `📞 Телефон: ${phone}\n`;
  if (service) text += `🛠️ Послуга: ${service}`;

  try {
    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: 'HTML'
      })
    });

    res.sendStatus(200);
  } catch (error) {
    console.error('Помилка надсилання в Telegram:', error);
    res.status(500).json({ error: 'Помилка надсилання в Telegram' });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер працює: http://localhost:${PORT}`);
});