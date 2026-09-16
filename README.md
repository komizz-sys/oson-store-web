# OsonStore — веб-часть (мини-апп)

Это только backend + фронтенд мини-аппа (webapp_server.py). Бот (bot.py,
handlers/, database/) живёт в ДРУГОМ репозитории/сервисе — сюда его заливать
не нужно.

## Деплой на Railway

1. Подключи этот репозиторий как отдельный сервис на Railway (Web-сервис)
2. Start Command не обязательно указывать вручную — файл `nixpacks.toml`
   уже всё настраивает (ставит Python, `pip install -r requirements.txt`,
   запускает `uvicorn webapp_server:app`)
3. Проверь Root Directory в Settings → Source — должно быть пусто
   (или указывать на корень этого репозитория, где лежит `webapp_server.py`)
4. Впиши переменные окружения (Variables):
   - `BOT_TOKEN` (тот же токен, что у бота — нужен для каталога простых подарков)
   - `MARKETAPP_API_KEY`
   - `STAR_UNIT_PRICE_UZS`
   - `RENT_MARKUP`
   - `TON_GRAM_RATE_UZS`
   - `RENT_FEE_GRAM`
   - `RENT_FEE_REFUND_PERCENT`
   - `PAYMENT_CARD_NUMBER`
   - `PAYMENT_CARD_HOLDER`
5. Settings → Networking → Generate Domain
6. Скопируй домен и впиши его в `WEBAPP_URL` у **бота** (другой сервис/репозиторий)

## Проверка после деплоя

Открой `https://<твой-домен>.up.railway.app/api/stars` в браузере — если видишь
JSON со списком пакетов звёзд, бэкенд работает. Если 404/ошибка — смотри
Deploy Logs на Railway.
