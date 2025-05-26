import express from 'express';
import cors from 'cors';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: 'https://www.provicno.com',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running!');
});

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID =  process.env.TELEGRAM_CHAT_ID;

app.post('/api/send', async (req, res) => {
  const { name, phone, service, formType } = req.body;

  let formLabel = "Заявка";
  if (formType === "full") formLabel = "Заявка з форми";
  else if (formType === "short") formLabel = "Виклик замірника";

  let text = `<b>${formLabel}</b>\n`;
  if (name) text += `👤 Ім’я: ${name}\n`;
  if (phone) text += `📞 Телефон: ${phone}\n`;
  if (service) text += `🛠️ Послуга: ${service}`;

  try {
    axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text,
      parse_mode: 'HTML'
    });

    res.sendStatus(200);
  } catch (error) {
    console.error('Помилка надсилання в Telegram:', error.response?.data || error.message);
    res.status(500).json({ error: 'Помилка надсилання в Telegram' });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер працює на порті: http://localhost:${PORT}`);
});
