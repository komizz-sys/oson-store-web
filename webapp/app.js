Const tg = window.Telegram && window.Telegram.WebApp;
If (tg) { tg.expand(); tg.ready(); }

/**
 * Telegram иногда отдаёт initData не мгновенно на первом кадре WebView —
 * страница уже выполнилась, а initData ещё пустая строка (особенно на
 * некоторых версиях клиента при "холодном" открытии мини-аппа). Раньше из-за
 * этого Tarix/Profil мгновенно показывали "открой в Telegram", хотя человек
 * и так был внутри Telegram. Ждём короткими попытками, прежде чем сдаться.
 */
/**
 * Telegram иногда отдаёт initData не мгновенно на первом кадре WebView —
 * страница уже выполнилась, а initData ещё пустая строка. На слабых
 * Android-устройствах (видел в логах — Redmi Note 9S "AVERAGE" performance)
 * это может занимать заметно больше 1.5 сек, особенно на медленном интернете.
 * БАГ БЫЛ ЗДЕСЬ: ждали всего 1.5 сек и сдавались — Tarix/Profil показывали
 * "открой в Telegram", хотя человек и так был внутри Telegram, просто
 * initData ещё не успела дойти. Увеличил окно ожидания и сделал его терпеливее.
 */
function waitForInitData(maxWaitMs = 4000, stepMs = 150) {
  Return new Promise(function(resolve) {
    If (tg && tg.initData) { resolve(tg.initData); return; }
    Let waited = 0;
    Const iv = setInterval(function() {
      Waited += stepMs;
      If (tg && tg.initData) { clearInterval(iv); resolve(tg.initData); }
      Else if (waited >= maxWaitMs) { clearInterval(iv); resolve(tg && tg.initData ? tg.initData : ""); }
    }, stepMs);
  });
}

/**
 * Отдельное (и обычно куда более быстрое) ожидание именно initDataUnsafe.user —
 * это НЕподписанные данные, для отображения имени/аватарки в Profil подпись
 * не нужна, поэтому не блокируем это той же долгой проверкой, что my_orders/my_stats.
 */
function waitForUnsafeUser(maxWaitMs = 4000, stepMs = 150) {
  Return new Promise(function(resolve) {
    Const get = function() { return tg && tg.initDataUnsafe && tg.initDataUnsafe.user; };
    If (get()) { resolve(get()); return; }
    Let waited = 0;
    Const iv = setInterval(function() {
      Waited += stepMs;
      Const u = get();
      If (u) { clearInterval(iv); resolve(u); }
      Else if (waited >= maxWaitMs) { clearInterval(iv); resolve(null); }
    }, stepMs);
  });
}

/* ---------------- i18n ---------------- */
Const I18N = {
  Uz: {
    Ijara_title: "Gift Arendasi", history_title: "Xaridlar tarixi",
    History_empty: "Hozircha xaridlar tarixi bo'sh.", history_hint: "To'liq tarix - botdagi \"Mening buyurtmalarim\" bo'limida.",
    Top_title: "Reyting", top_subtitle: "Eng faol mijozlar", top_forming: "Reyting shakllanmoqda", top_hint: "Birinchi xaridni amalga oshiring!",
    Profile_operator: "Operator", profile_channel: "\ud83d\udce2 Bot kanali", profile_orders_channel: "\ud83d\uded2 Savdo/Orderlar",
    Nav_main: "Asosiy", nav_rent: "Ijara", nav_history: "Tarix", nav_profile: "Profil",
    Modal_to_whom: "Kimga?", modal_to_self: "O'zimga", modal_to_friend: "Do'stimga",
    Modal_recipient_label: "Qabul qiluvchi (@username):", modal_message_label: "Xabar (ixtiyoriy):",
    Modal_message_placeholder: "Tabrik matni...", modal_rent_days: "Necha kunga?", modal_gift_quantity: "Nechta dona?",
    Modal_card_label: "To'lov uchun karta (Uzcard/Humo)", modal_card_holder_label: "Qabul qiluvchi",
    Modal_copy: "Nusxalash", modal_paid: "To'ladim", modal_cancel: "Bekor qilish",
    Err_username: "Username kiriting", err_no_username: "Sizda public username yo'q. Telegram sozlamalaridan o'rnating yoki \"Do'stimga\" tanlang.",
    Rent_terms: (fee, refund) => "Xizmat haqi: ~" + fee + ". Ijara tugagach ~" + refund + " qaytariladi.",
    Copied: "Nusxalandi!", empty: "Hozircha bo'sh.", rent_days_suffix: "kun", rent_from: "dan", rent_btn: "Ijaraga olish",
    Modal_preview: "Telegram-da ko'rish",
    Sort_recent: "Yangilari", sort_price_asc: "Narx: arzondan qimmatga", sort_price_desc: "Narx: qimmatdan arzonga",
    Sort_duration_asc: "Muddat: qisqa", sort_duration_desc: "Muddat: uzun",
    Load_more: "Ko'proq ko'rsatish", premium_title: "Telegram Premium olish", premium_subtitle: "O'zingiz yoki yaqiningiz uchun", premium_get_suffix: "olish",
    Custom_amount: "Boshqa miqdor", custom_amount_hint: "O'zingiz kiriting", custom_amount_label: "Nechta Stars?",
    Recent_recipient_label: "Yaqinda:", collection_all: "Barcha kolleksiyalar", collection_title: "Kolleksiya bo'yicha filtr",
    Live_label: "JONLI", minutes_ago: "daqiqa oldin", hours_ago: "soat oldin",
    Status_awaiting_payment: "To'lov kutilmoqda", status_payment_review: "Tekshirilmoqda", status_paid: "To'landi",
    Status_fulfilling: "Bajarilmoqda", status_completed: "Bajarildi", status_rejected: "Bekor qilindi",
    Cat_stars: "\u2b50 Stars", cat_premium: "\ud83d\udc8e Premium", cat_simple_gift: "\ud83c\udf81 Sovg'a", cat_nft_rent: "\ud83d\uddbc Ijara",
    Top_period_today: "Bugun", top_period_week: "Hafta", top_period_month: "Oy", top_period_all: "Hammasi",
    Top_orders_suffix: "buyurtma", top_you: "Siz", top_empty: "Bu davrda hali xaridlar yo'q.", badge_popular: "Mashhur", per_star: "so'm / yulduz", profile_no_purchases: "Birinchi xaridni amalga oshiring 🚀",
    Howto_title: "🎁 Ijara qanday ishlaydi?",
    Howto_steps: ["Gift va ijara muddatini tanlang", "Buyurtmani rasmiylashtiring va to'lovni amalga oshiring", "Admin to'lovni tasdiqlaydi", "Telegram botga tutorial video yuboriladi", "Videoni ko'rib, Telegram'dan shaxsiy havolangizni oling", "Havolani shu yerdagi maydonga joylang", "Havola tekshiriladi va sovg'a ulanadi", "Sovg'a profilingizda ko'rinadi ✅"],
    Ao_title: "Aktiv buyurtma", ao_awaiting_payment: "To'lov kutilmoqda", ao_payment_review: "To'lov tekshirilmoqda",
    Ao_paid: "To'lov tasdiqlandi", ao_fulfilling: "Bajarilmoqda",
    Ao_link_title: "Keyingi qadam: havolani kiriting", ao_link_hint: "Botga yuborilgan tutorial videodagi ko'rsatma bo'yicha olingan havolani joylang.",
    Ao_link_send: "Havolani yuborish", ao_watch_tutorial: "Tutorialni ko'rish (botda)",
    Ao_connected: "Sovg'a profilingizga ulandi!",
    Ao_connect_pending: "Havola saqlandi — sovg'a bir necha daqiqada ulanadi",
    Ao_err_empty: "Havolani kiriting", ao_err_bad_link: "Havola noto'g'ri. U tc:// bilan boshlanishi kerak.",
    Ao_err_connect: "Ulashda xatolik. Operator tez orada qo'lda ulab beradi.", ao_err_network: "Server bilan bog'lanib bo'lmadi.", ao_cancel: "Buyurtmani bekor qilish", ao_cancel_confirm: "Buyurtma bekor qilinsinmi?", ao_cancel_request: "Bekor qilishni so'rash", ao_cancel_request_confirm: "Buyurtma to'langan. Sotuvchidan bekor qilishni so'raymizmi?", ao_cancel_requested: "📨 So'rov yuborildi. Sotuvchi tez orada ko'rib chiqadi.", ao_pay_title: "To'lovni amalga oshiring", ao_pay_hint: "Kartaga summani o'tkazing va chek skrinshotini shu yerga yuklang.", ao_pay_upload: "Chek skrinshotini yuklash", ao_receipt_sent: "✅ Chek yuborildi! Admin tez orada tekshiradi.", ao_err_too_big: "Fayl juda katta (8 MB gacha).", ao_err_receipt: "Chekni yuborib bo'lmadi, qayta urinib ko'ring.", ao_err_wrong_status: "Bu buyurtma uchun chek allaqachon yuborilgan.", ao_err_no_image: "Rasmni o'qib bo'lmadi. Galereyadan oddiy rasm (JPG/PNG) tanlang.", ao_err_not_found: "Buyurtma topilmadi.",
    Profile_stats_title: "Mening statistikam", profile_stats_rank: "Reyting o'rningiz", profile_stats_total: "Jami xarid",
    History_loading: "Yuklanmoqda...", history_open_bot: "Ochish uchun botni Telegram ichida oching.",
    Order_success_title: "Buyurtma muvaffaqiyatli qabul qilindi", order_success_hint: "Tez orada tasdiqlaymiz — natija shu botda yoziladi.",
    Order_success_item: "Mahsulot", order_success_recipient: "Qabul qiluvchi", order_success_total: "Summa",
    Order_success_history: "Tarixni ko'rish", order_success_more: "Yana xarid qilish", order_success_home: "Asosiy sahifa",
    Nav_cart: "Savat", cart_title: "Savat", cart_empty: "Savat bo'sh", cart_empty_hint: "Mahsulot tanlang va \"Savatga\" tugmasini bosing.",
    Cart_add: "Savatga", cart_added: "Savatga qo'shildi ✅", cart_buy_now: "Hozir to'lash",
    Cart_total: "Jami", cart_pay: "Hammasini to'lash", cart_clear: "Savatni tozalash",
    Cart_clear_confirm: "Savatni tozalaymizmi?", cart_to_self: "O'zimga", cart_to: "Kimga",
    Cart_items_suffix: "ta mahsulot", cart_go_shop: "Do'konga o'tish",
    Cart_pay_hint: "Kartaga jami summani bitta o'tkazma bilan yuboring, so'ng \"To'ladim\" tugmasini bosing.",
    Cart_err_generic: "Buyurtmani yuborib bo'lmadi, qayta urinib ko'ring.",
    Cart_err_no_username: "Sizda public username yo'q. Telegram sozlamalaridan o'rnating yoki \"Do'stimga\" tanlang.",
    Cart_err_stars_limit: "Bitta buyurtmada 50 dan 1 000 000 tagacha yulduz olish mumkin. Miqdorni kamaytiring.",
    Cart_active_title: "Savat",
    Cart_success_hint: "Buyurtmani tasdiqlash uchun bot chatini oching — u yerda \"Tasdiqlash\" tugmasini bosing.",
    Flow_step_created: "Qabul qilindi", flow_step_payment: "To'lov", flow_step_doing: "Bajarilmoqda", flow_step_done: "Tayyor",
    Flow_awaiting_title: "To'lovni kutyapmiz", flow_awaiting_sub: "Summani kartaga o'tkazing va chek skrinshotini shu yerga yuklang — qolganini shu oynada ko'rasiz.",
    Flow_review_title: "To'lov tekshirilmoqda", flow_review_sub: "Odatda bir necha daqiqa. Oyna o'zi yangilanadi — yopmasangiz ham bo'ladi.",
    Flow_doing_title: "Buyurtma bajarilmoqda", flow_doing_sub: "Allaqachon ish boshladik. Tayyor bo'lishi bilan shu yerda ko'rasiz.",
    Flow_done_title: "Bajarildi!", flow_done_sub: "Buyurtmangiz yakunlandi. Xaridingiz uchun rahmat 🙌",
    Flow_rejected_title: "Buyurtma bekor qilindi", flow_rejected_sub: "To'lov tasdiqlanmadi. Operatorga yozing yoki qayta urinib ko'ring.",
    Flow_pay_exact: "Aynan shu summani o'tkazing:",
    Flow_commission_note: "Agar bankingiz o'tkazma uchun komissiya olsa — uni summa USTIGA qo'shing. Kartaga aynan shu summa tushishi kerak, aks holda to'lov avtomatik tasdiqlanmaydi.", flow_minimize: "Yopish (do'konga qaytish)", flow_write_operator: "Operatorga yozish",
    Flow_tips: ["Qabul qiluvchi tekshirilmoqda…", "Buyurtma tayyorlanmoqda…", "Yetkazib berilmoqda…", "Deyarli tayyor…"],
    Rentals_title: "Mening ijaralarim", rentals_empty: "Aktiv ijara yo'q.",
    Rent_ends_in: "Tugashiga", rent_days_short: "kun", rent_hours_short: "soat",
    Rent_extend: "Uzaytirish", rent_extend_title: "Ijarani uzaytirish", rent_extend_days: "Necha kunga uzaytiramiz?",
    Rent_extend_until: "Yangi tugash sanasi", rent_extend_note: "Sovg'a profilingizda qoladi — havolani qayta yuborish shart emas.",
    Rent_ending_soon: "Tez orada tugaydi!",
  },
  Ru: {
    Ijara_title: "Аренда гифтов", history_title: "История покупок",
    History_empty: "Пока пусто.", history_hint: "Полная история - в разделе «Мои заказы» в боте.",
    Top_title: "Рейтинг", top_subtitle: "Самые активные клиенты", top_forming: "Рейтинг формируется", top_hint: "Сделайте первую покупку!",
    Profile_operator: "Оператор", profile_channel: "\ud83d\udce2 Канал бота", profile_orders_channel: "\ud83d\uded2 Заказы/Отзывы",
    Nav_main: "Главная", nav_rent: "Аренда", nav_history: "История", nav_profile: "Профиль",
    Modal_to_whom: "Кому?", modal_to_self: "Себе", modal_to_friend: "Другу",
    Modal_recipient_label: "Получатель (@username):", modal_message_label: "Сообщение (необязательно):",
    Modal_message_placeholder: "Текст поздравления...", modal_rent_days: "На сколько дней?", modal_gift_quantity: "Сколько штук?",
    Modal_card_label: "Карта для оплаты (Uzcard/Humo)", modal_card_holder_label: "Получатель",
    Modal_copy: "Скопировать", modal_paid: "Я оплатил", modal_cancel: "Отмена",
    Err_username: "Введите username", err_no_username: "У вас нет публичного username. Установите в настройках Telegram или выберите \"Другу\".",
    Rent_terms: (fee, refund) => "Сервисный сбор: ~" + fee + ". После окончания аренды вернётся ~" + refund + ".",
    Copied: "Скопировано!", empty: "Пока пусто.", rent_days_suffix: "дн.", rent_from: "от", rent_btn: "Арендовать",
    Modal_preview: "Смотреть в Telegram",
    Sort_recent: "Новинки", sort_price_asc: "Цена: по возрастанию", sort_price_desc: "Цена: по убыванию",
    Sort_duration_asc: "Срок: короче", sort_duration_desc: "Срок: длиннее",
    Load_more: "Показать ещё", premium_title: "Оформить Telegram Premium", premium_subtitle: "Себе или близкому человеку", premium_get_suffix: "оформить",
    Custom_amount: "Другое количество", custom_amount_hint: "Введите сами", custom_amount_label: "Сколько звёзд?",
    Recent_recipient_label: "Недавнее:", collection_all: "Все коллекции", collection_title: "Фильтр по коллекции",
    Live_label: "СЕЙЧАС", minutes_ago: "мин назад", hours_ago: "ч назад",
    Status_awaiting_payment: "Ждём оплату", status_payment_review: "Проверяется", status_paid: "Оплачено",
    Status_fulfilling: "Выполняется", status_completed: "Выполнено", status_rejected: "Отменено",
    Cat_stars: "\u2b50 Stars", cat_premium: "\ud83d\udc8e Premium", cat_simple_gift: "\ud83c\udf81 Подарок", cat_nft_rent: "\ud83d\uddbc Аренда",
    Top_period_today: "Сегодня", top_period_week: "Неделя", top_period_month: "Месяц", top_period_all: "Всё время",
    Top_orders_suffix: "заказ(ов)", top_you: "Вы", top_empty: "За этот период покупок ещё не было.", badge_popular: "Популярный", per_star: "сум / звезда", profile_no_purchases: "Сделайте первую покупку 🚀",
    Howto_title: "🎁 Как работает аренда?",
    Howto_steps: ["Выберите подарок и срок аренды", "Оформите заказ и оплатите", "Админ подтверждает оплату", "В Telegram-бот приходит видео-инструкция", "Посмотрите видео и получите свою персональную ссылку", "Вставьте ссылку в поле здесь", "Ссылка проверяется, подарок подключается", "Подарок появляется в вашем профиле ✅"],
    Ao_title: "Активный заказ", ao_awaiting_payment: "Ждём оплату", ao_payment_review: "Проверяем оплату",
    Ao_paid: "Оплата подтверждена", ao_fulfilling: "Выполняется",
    Ao_link_title: "Следующий шаг: вставьте ссылку", ao_link_hint: "Вставьте ссылку, полученную по инструкции из видео, которое пришло в бот.",
    Ao_link_send: "Отправить ссылку", ao_watch_tutorial: "Посмотреть инструкцию (в боте)",
    Ao_connected: "Подарок подключён к профилю!",
    Ao_connect_pending: "Ссылка сохранена — подарок подключится через пару минут",
    Ao_err_empty: "Введите ссылку", ao_err_bad_link: "Неверная ссылка. Она должна начинаться с tc://",
    Ao_err_connect: "Ошибка подключения. Оператор скоро подключит вручную.", ao_err_network: "Не удалось связаться с сервером.", ao_cancel: "Отменить заказ", ao_cancel_confirm: "Отменить заказ?", ao_cancel_request: "Попросить отменить заказ", ao_cancel_request_confirm: "Заказ уже оплачен. Отправить продавцу просьбу отменить его?", ao_cancel_requested: "📨 Запрос отправлен. Продавец скоро его рассмотрит.", ao_pay_title: "Оплатите заказ", ao_pay_hint: "Переведите сумму на карту и загрузите сюда скриншот чека.", ao_pay_upload: "Загрузить скриншот чека", ao_receipt_sent: "✅ Чек отправлен! Админ скоро проверит.", ao_err_too_big: "Файл слишком большой (до 8 МБ).", ao_err_receipt: "Не удалось отправить чек, попробуйте ещё раз.", ao_err_wrong_status: "Чек по этому заказу уже отправлен.", ao_err_no_image: "Не удалось прочитать изображение. Выберите обычное фото (JPG/PNG).", ao_err_not_found: "Заказ не найден.",
    Profile_stats_title: "Моя статистика", profile_stats_rank: "Ваше место в рейтинге", profile_stats_total: "Всего куплено",
    History_loading: "Загрузка...", history_open_bot: "Откройте магазин внутри Telegram, чтобы увидеть историю.",
    Order_success_title: "Заказ успешно оформлен", order_success_hint: "Скоро подтвердим — результат придёт в этот же чат.",
    Order_success_item: "Товар", order_success_recipient: "Получатель", order_success_total: "Сумма",
    Order_success_history: "Смотреть историю", order_success_more: "Купить ещё", order_success_home: "На главную",
    Nav_cart: "Корзина", cart_title: "Корзина", cart_empty: "Корзина пуста", cart_empty_hint: "Выберите товар и нажмите «В корзину».",
    Cart_add: "В корзину", cart_added: "Добавлено в корзину ✅", cart_buy_now: "Оплатить сейчас",
    Cart_total: "Итого", cart_pay: "Оплатить всё", cart_clear: "Очистить корзину",
    Cart_clear_confirm: "Очистить корзину?", cart_to_self: "Себе", cart_to: "Кому",
    Cart_items_suffix: "товар(ов)", cart_go_shop: "Перейти в магазин",
    Cart_pay_hint: "Переведите на карту общую сумму одним платежом и нажмите «Я оплатил».",
    Cart_err_generic: "Не удалось оформить заказ, попробуйте ещё раз.",
    Cart_err_no_username: "У вас нет публичного username. Установите его в настройках Telegram или выберите «Другу».",
    Cart_err_stars_limit: "За один заказ можно купить от 50 до 1 000 000 звёзд. Уменьшите количество.",
    Cart_active_title: "Корзина",
    Cart_success_hint: "Откройте чат бота и нажмите «Подтвердить» — после этого придут реквизиты и сумма.",
    Flow_step_created: "Оформлен", flow_step_payment: "Оплата", flow_step_doing: "Выполняется", flow_step_done: "Готово",
    Flow_awaiting_title: "Ждём оплату", flow_awaiting_sub: "Переведите сумму на карту и загрузите сюда скриншот чека — дальше всё видно в этом окне.",
    Flow_review_title: "Проверяем оплату", flow_review_sub: "Обычно это пара минут. Окно обновится само — можно не закрывать.",
    Flow_doing_title: "Заказ выполняется", flow_doing_sub: "Уже занимаемся вашим заказом. Как будет готово — увидите здесь.",
    Flow_done_title: "Выполнено!", flow_done_sub: "Заказ выполнен. Спасибо за покупку 🙌",
    Flow_rejected_title: "Заказ отменён", flow_rejected_sub: "Оплата не подтверждена. Напишите оператору или оформите заново.",
    Flow_pay_exact: "Переведите ровно:",
    Flow_commission_note: "Если ваш банк берёт комиссию за перевод — добавьте её СВЕРХУ. На карту должна прийти ровно эта сумма, иначе оплата не подтвердится автоматически.", flow_minimize: "Свернуть (вернуться в магазин)", flow_write_operator: "Написать оператору",
    Flow_tips: ["Проверяем получателя…", "Готовим заказ…", "Отправляем…", "Почти готово…"],
    Rentals_title: "Мои аренды", rentals_empty: "Активных аренд нет.",
    Rent_ends_in: "Осталось", rent_days_short: "дн.", rent_hours_short: "ч",
    Rent_extend: "Продлить", rent_extend_title: "Продление аренды", rent_extend_days: "На сколько дней продлить?",
    Rent_extend_until: "Новая дата окончания", rent_extend_note: "Подарок остаётся в профиле — ссылку заново присылать не нужно.",
    Rent_ending_soon: "Скоро закончится!",
  },
  En: {
    Ijara_title: "Gift rental", history_title: "Purchase history",
    History_empty: "Nothing here yet.", history_hint: "Full history is in \"My orders\" in the bot chat.",
    Top_title: "Rating", top_subtitle: "Most active customers", top_forming: "Rating is forming", top_hint: "Make your first purchase!",
    Profile_operator: "Operator", profile_channel: "\ud83d\udce2 Bot channel", profile_orders_channel: "\ud83d\uded2 Orders channel",
    Nav_main: "Home", nav_rent: "Rent", nav_history: "History", nav_profile: "Profile",
    Modal_to_whom: "For whom?", modal_to_self: "Myself", modal_to_friend: "A friend",
    Modal_recipient_label: "Recipient (@username):", modal_message_label: "Message (optional):",
    Modal_message_placeholder: "Congratulation text...", modal_rent_days: "For how many days?", modal_gift_quantity: "How many?",
    Modal_card_label: "Payment card (Uzcard/Humo)", modal_card_holder_label: "Recipient",
    Modal_copy: "Copy", modal_paid: "I've paid", modal_cancel: "Cancel",
    Err_username: "Enter a username", err_no_username: "You don't have a public username. Set one in Telegram settings or choose \"A friend\".",
    Rent_terms: (fee, refund) => "Service fee: ~" + fee + ". ~" + refund + " is refunded after the rental ends.",
    Copied: "Copied!", empty: "Nothing here yet.", rent_days_suffix: "days", rent_from: "from", rent_btn: "Rent",
    Modal_preview: "View in Telegram",
    Sort_recent: "Newest", sort_price_asc: "Price: low to high", sort_price_desc: "Price: high to low",
    Sort_duration_asc: "Duration: shortest", sort_duration_desc: "Duration: longest",
    Load_more: "Show more", premium_title: "Get Telegram Premium", premium_subtitle: "For yourself or someone else", premium_get_suffix: "get",
    Custom_amount: "Custom amount", custom_amount_hint: "Enter your own", custom_amount_label: "How many Stars?",
    Recent_recipient_label: "Recent:", collection_all: "All collections", collection_title: "Filter by collection",
    Live_label: "LIVE", minutes_ago: "min ago", hours_ago: "h ago",
    Status_awaiting_payment: "Awaiting payment", status_payment_review: "Under review", status_paid: "Paid",
    Status_fulfilling: "In progress", status_completed: "Completed", status_rejected: "Cancelled",
    Cat_stars: "\u2b50 Stars", cat_premium: "\ud83d\udc8e Premium", cat_simple_gift: "\ud83c\udf81 Gift", cat_nft_rent: "\ud83d\uddbc Rent",
    Top_period_today: "Today", top_period_week: "Week", top_period_month: "Month", top_period_all: "All time",
    Top_orders_suffix: "order(s)", top_you: "You", top_empty: "No purchases in this period yet.", badge_popular: "Popular", per_star: "so'm / star", profile_no_purchases: "Make your first purchase 🚀",
    Howto_title: "🎁 How does renting work?",
    Howto_steps: ["Pick a gift and rental period", "Place the order and pay", "Admin confirms your payment", "A tutorial video is sent to the Telegram bot", "Watch it and get your personal link from Telegram", "Paste the link into the field here", "The link is verified and the gift is connected", "The gift appears on your profile ✅"],
    Ao_title: "Active order", ao_awaiting_payment: "Awaiting payment", ao_payment_review: "Checking payment",
    Ao_paid: "Payment confirmed", ao_fulfilling: "In progress",
    Ao_link_title: "Next step: paste your link", ao_link_hint: "Paste the link you got by following the tutorial video sent to the bot.",
    Ao_link_send: "Send link", ao_watch_tutorial: "Watch tutorial (in bot)",
    Ao_connected: "Gift connected to your profile!",
    Ao_connect_pending: "Link saved — the gift will connect in a few minutes",
    Ao_err_empty: "Enter the link", ao_err_bad_link: "Invalid link. It should start with tc://",
    Ao_err_connect: "Connection error. An operator will connect it manually soon.", ao_err_network: "Could not reach the server.", ao_cancel: "Cancel order", ao_cancel_confirm: "Cancel this order?", ao_cancel_request: "Request cancellation", ao_cancel_request_confirm: "This order is already paid. Send the seller a cancellation request?", ao_cancel_requested: "📨 Request sent. The seller will review it shortly.", ao_pay_title: "Pay for your order", ao_pay_hint: "Transfer the amount to the card and upload the receipt screenshot here.", ao_pay_upload: "Upload receipt screenshot", ao_receipt_sent: "✅ Receipt sent! The admin will check it shortly.", ao_err_too_big: "File is too large (max 8 MB).", ao_err_receipt: "Could not send the receipt, please try again.", ao_err_wrong_status: "A receipt for this order was already sent.", ao_err_no_image: "Could not read the image. Pick a regular photo (JPG/PNG).", ao_err_not_found: "Order not found.",
    Profile_stats_title: "My stats", profile_stats_rank: "Your rank", profile_stats_total: "Total spent",
    History_loading: "Loading...", history_open_bot: "Open the shop inside Telegram to see your history.",
    Order_success_title: "Order placed successfully", order_success_hint: "We'll confirm soon — the result will be posted in this chat.",
    Order_success_item: "Item", order_success_recipient: "Recipient", order_success_total: "Total",
    Order_success_history: "View history", order_success_more: "Buy more", order_success_home: "Home",
    Nav_cart: "Cart", cart_title: "Cart", cart_empty: "Your cart is empty", cart_empty_hint: "Pick an item and tap \"Add to cart\".",
    Cart_add: "Add to cart", cart_added: "Added to cart ✅", cart_buy_now: "Pay now",
    Cart_total: "Total", cart_pay: "Pay for everything", cart_clear: "Clear cart",
    Cart_clear_confirm: "Clear the cart?", cart_to_self: "Myself", cart_to: "For",
    Cart_items_suffix: "item(s)", cart_go_shop: "Go to shop",
    Cart_pay_hint: "Transfer the total to the card in one payment, then tap \"I've paid\".",
    Cart_err_generic: "Could not place the order, please try again.",
    Cart_err_no_username: "You don't have a public username. Set one in Telegram settings or choose \"A friend\".",
    Cart_err_stars_limit: "You can buy between 50 and 1,000,000 stars per order. Lower the amount.",
    Cart_active_title: "Cart",
    Cart_success_hint: "Open the bot chat and tap \"Confirm\" — payment details will arrive there.",
    Flow_step_created: "Placed", flow_step_payment: "Payment", flow_step_doing: "In progress", flow_step_done: "Done",
    Flow_awaiting_title: "Waiting for payment", flow_awaiting_sub: "Transfer the amount to the card and upload the receipt here — everything else happens in this window.",
    Flow_review_title: "Checking your payment", flow_review_sub: "Usually a couple of minutes. This screen updates by itself.",
    Flow_doing_title: "Order in progress", flow_doing_sub: "We're working on it. You'll see the result right here.",
    Flow_done_title: "Done!", flow_done_sub: "Your order is complete. Thanks for your purchase 🙌",
    Flow_rejected_title: "Order cancelled", flow_rejected_sub: "The payment wasn't confirmed. Contact the operator or order again.",
    Flow_pay_exact: "Transfer exactly:",
    Flow_commission_note: "If your bank charges a transfer fee, add it ON TOP. Exactly this amount must arrive on the card, otherwise the payment won't be confirmed automatically.", flow_minimize: "Minimize (back to shop)", flow_write_operator: "Contact operator",
    Flow_tips: ["Checking the recipient…", "Preparing your order…", "Delivering…", "Almost there…"],
    Rentals_title: "My rentals", rentals_empty: "No active rentals.",
    Rent_ends_in: "Left", rent_days_short: "d", rent_hours_short: "h",
    Rent_extend: "Extend", rent_extend_title: "Extend rental", rent_extend_days: "Extend by how many days?",
    Rent_extend_until: "New end date", rent_extend_note: "The gift stays on your profile — no need to send the link again.",
    Rent_ending_soon: "Ending soon!",
  },
};

Let lang = "uz";
function t(key) { return I18N[lang][key] !== undefined ? I18N[lang][key] : key; }

function applyI18n() {
  Document.querySelectorAll("[data-i18n]").forEach(function(el) {
    Const key = el.dataset.i18n;
    Const val = t(key);
    If (typeof val === "string") el.textContent = val;
  });
  Document.querySelectorAll("[data-i18n-placeholder]").forEach(function(el) {
    El.placeholder = t(el.dataset.i18nPlaceholder);
  });
  RenderRentTerms();
  If (currentTab === "ijara") { renderIjara(); renderMyRentals(); }
  Else if (currentTab === "savat") renderCart();
  Else renderItems();
}

function setActiveFlagUI() {
  Array.prototype.forEach.call(document.querySelectorAll(".lang-flag"), function(btn) {
    Btn.classList.toggle("active", btn.dataset.lang === lang);
  });
}

Array.prototype.forEach.call(document.querySelectorAll(".lang-flag"), function(btn) {
  Btn.addEventListener("click", function() {
    Lang = btn.dataset.lang;
    SetActiveFlagUI();
    ApplyI18n();
    If (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred("light");
  });
});
setActiveFlagUI();

/* ---------------- Форматирование ---------------- */
function fmtUZS(n) { return Math.round(n).toLocaleString("ru-RU").replace(/,/g, " ") + " so'm"; }

/* ---------------- Короткое уведомление (тост) ---------------- */
Let _toastTimer = null;
function showToast(text) {
  Const el = document.getElementById("toast");
  If (!el) return;
  El.textContent = text;
  El.classList.remove("hidden");
  El.style.animation = "sheetUp .25s cubic-bezier(.2,.9,.25,1) both";
  ClearTimeout(_toastTimer);
  _toastTimer = setTimeout(function() { el.classList.add("hidden"); }, 1800);
}

/* ================= КОРЗИНА =================
 * Хранится в localStorage этого устройства: заказ создаётся на сервере только
 * в момент оплаты, поэтому корзина — чисто клиентское "черновое" состояние.
 * Одна строка корзины = один товар с количеством и своим получателем
 * (можно в одном заказе купить звёзды себе и премиум другу).
 */
Const CART_KEY = "oson_cart_v1";
Const CART_MAX_LINES = 20;
Const CART_MAX_QTY = 10;
Let cart = [];

function loadCart() {
  Try {
    Const raw = localStorage.getItem(CART_KEY);
    Const parsed = raw ? JSON.parse(raw) : [];
    Cart = Array.isArray(parsed) ? parsed.filter(function(l) { return l && l.kind && l.unitPrice > 0; }) : [];
  } catch (e) { cart = []; } // localStorage может быть недоступен — просто пустая корзина
}

function saveCart() {
  Try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) { /* тихо игнорируем */ }
  UpdateCartBadge();
}

function cartCount() {
  Return cart.reduce(function(sum, l) { return sum + l.qty; }, 0);
}

function cartTotal() {
  Return cart.reduce(function(sum, l) { return sum + l.unitPrice * l.qty; }, 0);
}

function updateCartBadge() {
  Const badge = document.getElementById("cart-badge");
  If (!badge) return;
  Const n = cartCount();
  Badge.textContent = n > 99 ? "99+" : String(n);
  Badge.classList.toggle("hidden", n === 0);
}

/** Одинаковый товар одному и тому же получателю не плодит строки — растёт количество. */
function cartLineKey(line) {
  Return [line.kind, line.itemName, line.giftId || "", line.starsAmount || "", line.recipientType, line.recipient || "", line.note || ""].join("|");
}

function addToCart(line) {
  Const key = cartLineKey(line);
  Const existing = cart.filter(function(l) { return cartLineKey(l) === key; })[0];
  If (existing) {
    Existing.qty = Math.min(existing.qty + line.qty, CART_MAX_QTY);
  } else {
    If (cart.length >= CART_MAX_LINES) return false;
    Cart.push(line);
  }
  SaveCart();
  Return true;
}

function cartChangeQty(index, delta) {
  Const line = cart[index];
  If (!line) return;
  Const next = line.qty + delta;
  If (next < 1) { cartRemove(index); return; }
  If (next > CART_MAX_QTY) return;
  Line.qty = next;
  SaveCart();
  RenderCart();
  If (tg && tg.HapticFeedback) tg.HapticFeedback.selectionChanged();
}

function cartRemove(index) {
  Cart.splice(index, 1);
  SaveCart();
  RenderCart();
  If (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred("light");
}

function clearCart() {
  Cart = [];
  SaveCart();
  RenderCart();
}

/**
 * Кладёт в корзину товар, открытый сейчас в модалке оплаты (со всеми
 * выбранными в ней параметрами: получатель, сообщение, количество подарков).
 */
function addActiveItemToCart() {
  Const item = activeItem;
  If (!item) return;
  If (["stars", "stars_custom", "premium", "simple_gift"].indexOf(item.kind) === -1) return;

  Const errorEl = document.getElementById("modal-error");
  Let friendUsername = document.getElementById("gift-username").value.trim();
  If (recipientType === "friend") {
    If (!friendUsername) { errorEl.textContent = t("err_username"); errorEl.classList.remove("hidden"); return; }
    If (friendUsername.charAt(0) !== "@") friendUsername = "@" + friendUsername;
    SaveRecentRecipient(friendUsername);
  }

  Const note = document.getElementById("gift-message").value.trim();
  Const line = {
    Uid: "c" + Date.now() + Math.random().toString(16).slice(2, 6),
    Kind: item.kind,
    Emoji: item.emoji,
    Image: item.image || null,
    Qty: 1,
    UnitPrice: item.price,
    RecipientType: recipientType,
    Recipient: recipientType === "friend" ? friendUsername : "",
    Note: note,
  };

  If (item.kind === "stars") {
    Line.starsAmount = item.raw.amount;
    Line.itemName = item.raw.amount + " звёзд";
    Line.title = item.raw.amount.toLocaleString("ru-RU").replace(/,/g, " ") + " ⭐️";
  } else if (item.kind === "stars_custom") {
    Line.starsAmount = item.raw.qty;
    Line.itemName = item.raw.qty + " звёзд";
    Line.title = item.raw.qty + " ⭐️";
    Line.unitPrice = item.price;
  } else if (item.kind === "premium") {
    Line.itemName = "Premium — " + item.raw.label;
    Line.title = "💎 " + item.raw.label;
  } else if (item.kind === "simple_gift") {
    Line.giftId = item.raw.id;
    Line.itemName = "Подарок " + item.emoji + " (" + item.raw.star_count + "⭐)";
    Line.title = item.emoji + " " + item.raw.star_count + "⭐";
    Line.qty = giftQty; // количество, выбранное в модалке
    Line.unitPrice = item.raw.price_uzs; // цена за ОДНУ штуку
  }

  If (!addToCart(line)) { showToast("🛒 " + t("cart_title") + " — max " + CART_MAX_LINES); return; }

  If (tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred("success");
  CloseModal();
  ShowToast(t("cart_added"));
}

function cartLineLabel(line) {
  If (line.recipientType === "friend" && line.recipient) return line.recipient;
  Return t("cart_to_self");
}

function renderCart() {
  Const listEl = document.getElementById("cart-list");
  Const checkoutEl = document.getElementById("cart-checkout");
  Const clearBtn = document.getElementById("cart-clear-btn");
  If (!listEl) return;

  If (!cart.length) {
    ListEl.innerHTML =
      '<div class="glass-card rounded-[22px] p-8 text-center text-gray-400">' +
        '<p class="text-3xl mb-2">🛒</p>' +
        '<p class="text-[14px] font-semibold text-white mb-1">' + t("cart_empty") + '</p>' +
        '<p class="text-[12px] mb-4">' + t("cart_empty_hint") + '</p>' +
        '<button onclick="switchTab(\'asosiy\')" class="press pill-gold rounded-xl px-4 py-2 text-[12px] font-semibold">' + t("cart_go_shop") + '</button>' +
      '</div>';
    CheckoutEl.classList.add("hidden");
    ClearBtn.classList.add("hidden");
    Return;
  }

  ListEl.innerHTML = cart.map(function(line, i) {
    Const iconHTML = line.image
      ? '<img src="' + line.image + '" class="w-12 h-12 rounded-xl object-cover flex-shrink-0" onerror="this.replaceWith(Object.assign(document.createElement(\'div\'),{className:\'w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-xl flex-shrink-0\',textContent:\'' + line.emoji + '\'}))" />'
      : '<div class="w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center text-xl flex-shrink-0">' + line.emoji + '</div>';

    Return '<div class="glass-card rounded-[20px] p-3 flex items-center gap-3">' +
      iconHTML +
      '<div class="min-w-0 flex-1">' +
        '<div class="text-[13px] font-semibold text-white truncate">' + line.title + '</div>' +
        '<div class="text-[10px] text-gray-500 truncate">' + t("cart_to") + ': ' + cartLineLabel(line) + '</div>' +
        '<div class="text-[12px] font-bold text-neon-yellow mt-0.5">' + fmtUZS(line.unitPrice * line.qty) + '</div>' +
      '</div>' +
      '<div class="flex flex-col items-end gap-1.5 flex-shrink-0">' +
        '<button onclick="cartRemove(' + i + ')" class="press text-gray-500 text-[15px] leading-none px-1">✕</button>' +
        '<div class="flex items-center gap-2 bg-white/[0.05] rounded-xl px-1.5 py-1">' +
          '<button onclick="cartChangeQty(' + i + ',-1)" class="press w-6 h-6 rounded-lg bg-white/10 text-white text-sm font-bold leading-none">−</button>' +
          '<span class="text-[12px] font-bold w-4 text-center">' + line.qty + '</span>' +
          '<button onclick="cartChangeQty(' + i + ',1)" class="press w-6 h-6 rounded-lg bg-white/10 text-white text-sm font-bold leading-none">+</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join("");

  Document.getElementById("cart-total").textContent = fmtUZS(cartTotal());
  CheckoutEl.classList.remove("hidden");
  ClearBtn.classList.remove("hidden");

  GetPaymentInfo().then(function(pay) {
    Document.getElementById("cart-card-number").textContent = pay.card_number || "—";
    Document.getElementById("cart-card-holder").textContent = pay.card_holder || "—";
  }).catch(function() { /* реквизиты просто останутся прочерком */ });
}

/** Отправка всей корзины одним заказом — одна сумма, один чек. */
Let cartOrderInFlight = false;
async function submitCartOrder() {
  If (cartOrderInFlight || !cart.length) return;
  Const errorEl = document.getElementById("cart-error");
  Const btn = document.getElementById("cart-pay-btn");
  ErrorEl.classList.add("hidden");

  Const base = await getShopApiUrl();
  Const initData = await waitForInitData();
  If (!base || !initData) {
    ErrorEl.textContent = t("history_open_bot");
    ErrorEl.classList.remove("hidden");
    Return;
  }

  Const items = cart.map(function(line) {
    Return {
      Category: line.kind,
      Item_name: line.itemName,
      Price: line.unitPrice,
      Quantity: line.qty,
      Stars_amount: line.starsAmount,
      Gift_id: line.giftId,
      Recipient: line.recipient,
      Recipient_type: line.recipientType,
      Note: line.note || undefined,
    };
  });

  CartOrderInFlight = true;
  Const prev = btn.innerHTML;
  Btn.disabled = true;
  Btn.innerHTML = '<span class="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full align-middle" style="animation: spin .7s linear infinite;"></span>';

  Try {
    Const res = await fetch(base + "/public/place_cart_order", {
      Method: "POST", headers: { "Content-Type": "application/json" },
      Body: JSON.stringify({ initData: initData, items: items }),
    });
    Const data = await res.json();
    If (!res.ok || data.error) {
      ErrorEl.textContent = data.error === "no_username" ? t("cart_err_no_username")
        : data.error === "stars_limit" ? t("cart_err_stars_limit")
        : t("cart_err_generic");
      ErrorEl.classList.remove("hidden");
      Return;
    }
    // Корзина оформлена одним заказом — очищаем её и переходим на экран
    // живого статуса, дальше всё происходит там же, внутри витрины.
    Const total = cartTotal();
    Const count = cartCount();
    ClearCart();
    OpenOrderFlow({ cart_id: data.cart_id, order_id: data.order_id }, {
      Order_id: data.order_id,
      Cart_id: data.cart_id,
      Item_name: "🛒 " + count + " " + t("cart_items_suffix"),
      Recipient: "",
      Price_uzs: total,
      Pay_amount: data.pay_amount,
      Card_number: data.card_number,
      Card_holder: data.card_holder,
    });
  } catch (e) {
    ErrorEl.textContent = t("ao_err_network");
    ErrorEl.classList.remove("hidden");
  } finally {
    CartOrderInFlight = false;
    Btn.disabled = false;
    Btn.innerHTML = prev;
  }
}

/**
 * Подтверждение действия. В Telegram лучше спрашивать его нативным
 * showConfirm — обычный window.confirm в WebView клиента может быть
 * заблокирован, и тогда кнопка молча ничего не делала бы.
 */
function askConfirm(text, onYes) {
  If (tg && tg.showConfirm) { tg.showConfirm(text, function(ok) { if (ok) onYes(); }); return; }
  If (confirm(text)) onYes();
}

LoadCart();
UpdateCartBadge();

Document.getElementById("cart-clear-btn").addEventListener("click", function() {
  If (!cart.length) return;
  AskConfirm(t("cart_clear_confirm"), clearCart);
});

/* ---------------- Загрузка каталога ---------------- */
Const catalog = { stars: [], premium: [], simple_gift: [], nft_rent: [] };
Let currentCategory = "stars";
Let currentTab = "asosiy";
Let currentRentSort = "recently_touch";
Let currentRentCollection = null;
Let currentRentCollectionName = null;

async function loadCatalog(cat, forceReload) {
  If (catalog[cat].length && !forceReload) return catalog[cat];
  Const res = await fetch("/api/" + cat);
  If (!res.ok) throw new Error("bad response " + cat);
  Const data = await res.json();
  Catalog[cat] = data.map(normalizeItem(cat));
  Return catalog[cat];
}

async function fetchRentPage(cursor) {
  Let url = "/api/nft_rent?sort_by=" + currentRentSort;
  If (currentRentCollection) url += "&collection_address=" + encodeURIComponent(currentRentCollection);
  If (cursor) url += "&cursor=" + encodeURIComponent(cursor);
  Const res = await fetch(url);
  If (!res.ok) throw new Error("bad response nft_rent");
  Const data = await res.json();
  Const mapped = data.items.map(normalizeItem("nft_rent"));
  Return { items: mapped, nextCursor: data.next_cursor };
}

function normalizeItem(cat) {
  Return function(raw) {
    If (cat === "stars") return { kind: "stars", title: raw.amount.toLocaleString("ru-RU") + " Stars", price: raw.price_uzs, emoji: "⭐️", raw: raw };
    If (cat === "premium") return { kind: "premium", title: raw.label, price: raw.price_uzs, emoji: "👑", raw: raw };
    If (cat === "simple_gift") return { kind: "simple_gift", title: raw.star_count + "⭐", price: raw.price_uzs, emoji: raw.sticker_emoji || "🎁", image: raw.image_url || null, raw: raw };
    If (cat === "nft_rent") return { kind: "nft_rent", title: raw.name, price: raw.price_per_day_uzs_with_markup, emoji: pickGiftEmoji(raw.name), image: raw.image_url, previewUrl: raw.preview_url, raw: raw };
  };
}

// Фото у API нет, подбираем эмодзи по названию для узнаваемости карточки
function pickGiftEmoji(name) {
  Const n = (name || "").toLowerCase();
  If (n.includes("pepe")) return "🐸";
  If (n.includes("cat")) return "🐱";
  If (n.includes("bird")) return "🐦";
  If (n.includes("wine")) return "🍷";
  If (n.includes("hat") || n.includes("cap")) return "🎩";
  If (n.includes("watch")) return "⌚️";
  If (n.includes("ring")) return "💍";
  If (n.includes("bear")) return "🧸";
  If (n.includes("rose") || n.includes("flower")) return "🌹";
  If (n.includes("crown")) return "👑";
  Return "🖼";
}

async function renderItems() {
  Const grid = document.getElementById("products-grid");
  // Stars — компактные карточки с цифрой, помещается 3 в ряд.
  // Gift — картинка главный герой, ей нужно место: 2 в ряд.
  Grid.className = currentCategory === "stars"
    ? "p-4 grid grid-cols-3 gap-3 max-w-sm mx-auto"
    : "p-4 grid grid-cols-2 gap-3 max-w-sm mx-auto";

  If (currentCategory === "premium") { await renderPremiumList(); return; }
  Document.getElementById("premium-list").classList.add("hidden");
  Grid.classList.remove("hidden");

  Grid.innerHTML = skeletonHTML(6, currentCategory === "stars" ? "h-[104px]" : "h-[168px]");
  Let items;
  Try { items = await loadCatalog(currentCategory); }
  Catch (e) { grid.innerHTML = '<p class="col-span-full text-center text-xs text-gray-500 py-8">' + t("empty") + '</p>'; return; }

  If (!items.length) { grid.innerHTML = '<p class="col-span-full text-center text-xs text-gray-500 py-8">' + t("empty") + '</p>'; return; }

  Const customCardHTML = currentCategory === "stars"
    ? '<div id="stars-custom-card" class="glass-card press rounded-[20px] p-3 flex flex-col items-center justify-center text-center cursor-pointer min-h-[104px]" style="border-style: dashed;">' +
        '<div class="text-2xl">✏️</div>' +
        '<div class="text-[10px] text-gray-300 mt-1.5 leading-tight">' + t("custom_amount") + '</div>' +
        '<div class="text-[9px] text-gray-500 mt-0.5">' + t("custom_amount_hint") + '</div>' +
      '</div>'
    : "";

  Grid.innerHTML = items.map(function(it, i) {
    Const isPopularStars = currentCategory === "stars" && it.raw && it.raw.amount === 1000;
    Const popularBadge = isPopularStars
      ? '<span class="badge-popular absolute -top-1.5 right-1.5 pill-gold text-[8px] font-bold px-2 py-0.5 rounded-full leading-none z-10">' + t("badge_popular") + '</span>'
      : "";
    Const cardBase = '<div data-i="' + i + '" class="product-card glass-card press rounded-[20px] cursor-pointer relative overflow-visible' + (isPopularStars ? " card-popular" : "") + '">';

    // STARS: героем делаем само число, а не одинаковую жёлтую звезду —
    // раньше 15 карточек выглядели идентично, различал только мелкий текст.
    // Плюс показываем цену за 1 звезду: чем больше пакет, тем она ниже,
    // так человек видит выгоду и берёт пакет побольше.
    If (currentCategory === "stars") {
      Const amount = it.raw.amount;
      Const perStar = Math.round(it.price / amount);
      Return cardBase +
        popularBadge +
        '<div class="p-3 flex flex-col items-center text-center">' +
          '<div class="flex items-baseline gap-0.5 mt-1">' +
            '<span class="text-[22px] font-black text-white leading-none tracking-tight">' + amount.toLocaleString("ru-RU").replace(/,/g, " ") + '</span>' +
            '<span class="text-[11px]">⭐️</span>' +
          '</div>' +
          '<div class="text-[11px] font-bold text-neon-yellow mt-2">' + fmtUZS(it.price) + '</div>' +
          '<div class="text-[9px] text-gray-500 mt-0.5">' + perStar + " " + t("per_star") + '</div>' +
        '</div>' +
      '</div>';
    }

    // GIFT: картинка — главный герой, ей отдаём всю ширину карточки.
    Const iconHTML = it.image
      ? '<img src="' + it.image + '" loading="lazy" class="w-full h-full object-cover animated-gift" onerror="this.style.display=\'none\'; this.nextElementSibling.style.display=\'flex\';" />' +
        '<div class="absolute inset-0 hidden items-center justify-center text-4xl animated-gift">' + it.emoji + '</div>'
      : '<div class="absolute inset-0 flex items-center justify-center text-4xl animated-gift">' + it.emoji + '</div>';
    Return cardBase +
      popularBadge +
      '<div class="relative w-full aspect-square rounded-t-[20px] overflow-hidden" style="background: radial-gradient(circle at 50% 35%, rgba(255,255,255,0.07), transparent 70%);">' + iconHTML + '</div>' +
      '<div class="px-2 py-2.5 text-center">' +
        '<div class="text-[10px] text-gray-400 leading-tight">' + it.title + '</div>' +
        '<div class="text-[11px] font-bold text-neon-yellow mt-1">' + fmtUZS(it.price) + '</div>' +
      '</div>' +
    '</div>';
  }).join("") + customCardHTML;

  Const customCard = document.getElementById("stars-custom-card");
  If (customCard) customCard.addEventListener("click", openCustomStarsModal);

  Array.prototype.forEach.call(grid.querySelectorAll(".product-card"), function(card) {
    Card.addEventListener("click", function() { openModal(items[Number(card.dataset.i)]); });
  });

  RevealOnScroll(grid);
}


/**
 * Плавное появление карточек по мере прокрутки.
 *
 * Карточка стартует чуть ниже и прозрачной, а когда доезжает до экрана —
 * проявляется и встаёт на место. Небольшая задержка по порядку внутри ряда
 * даёт «волну» вместо одновременной вспышки всего списка.
 *
 * Важное про надёжность: класс `reveal` (который и прячет карточку)
 * навешивается ЗДЕСЬ, из скрипта, и только если браузер умеет
 * IntersectionObserver. Если не умеет — карточки просто остаются видимыми,
 * а не исчезают навсегда. То же самое, если наблюдатель почему-то не
 * сработает: всё, что уже на экране, показываем сразу.
 */
function revealOnScroll(container) {
  If (!container) return;
  Const cards = container.children;
  If (!cards.length) return;

  If (!("IntersectionObserver" in window)) return; // старый браузер — показываем как есть

  Const observer = new IntersectionObserver(function(entries, obs) {
    Entries.forEach(function(entry) {
      If (!entry.isIntersecting) return;
      Const el = entry.target;
      Const delay = Math.min(Number(el.dataset.revealOrder || 0), 8) * 45;
      SetTimeout(function() { el.classList.add("revealed"); }, delay);
      Obs.unobserve(el); // проявили один раз — при обратной прокрутке не мигает
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });

  Array.prototype.forEach.call(cards, function(card, i) {
    Card.classList.add("reveal");
    Card.dataset.revealOrder = i % 9; // задержка считается внутри «экрана», а не по всему списку
    Observer.observe(card);
  });

  // Страховка: если через полсекунды что-то из видимой части так и не
  // проявилось (бывает при быстром переключении вкладок), показываем принудительно.
  SetTimeout(function() {
    Array.prototype.forEach.call(cards, function(card) {
      Const box = card.getBoundingClientRect();
      If (box.top < window.innerHeight && box.bottom > 0) card.classList.add("revealed");
    });
  }, 500);
}

/* ---------------- Ijara (аренда) — с догрузкой страниц ---------------- */
Let rentNextCursor = null;
Let rentLoadingMore = false;

// Карточка аренды в стиле MarketApp: картинка с бейджем срока, название,
// цена + "so'm" + "· N kun", кнопка "Ijaraga olish". Кликается ВСЯ карточка,
// не только кнопка.
function rentCardHTML(it, i) {
  Const imgBlock = it.image
    ? '<img src="' + it.image + '" loading="lazy" class="absolute inset-0 w-full h-full object-cover" onerror="this.style.display=\'none\'; this.nextElementSibling.style.display=\'flex\';" />' +
      '<div class="absolute inset-0 hidden items-center justify-center"><span class="text-6xl animated-gift">' + it.emoji + '</span></div>'
    : '<div class="absolute inset-0 flex items-center justify-center"><span class="text-6xl animated-gift">' + it.emoji + '</span></div>';

  Const discountBadge = it.raw.discount_per_day > 0
    ? '<span class="absolute top-2 right-2 bg-red-500/80 backdrop-blur text-[10px] font-bold px-2 py-1 rounded-lg text-white">-' + it.raw.discount_per_day + '%</span>'
    : '';

  Const numberBadge = it.raw.number
    ? '<span class="text-[11px] text-gray-500 font-mono">#' + it.raw.number + '</span>'
    : '';

  Return '<div data-i="' + i + '" class="rent-card glass-card press rounded-[22px] overflow-hidden flex flex-col cursor-pointer">' +
    '<div class="rent-img relative h-44">' +
      ImgBlock +
      DiscountBadge +
      '<span class="absolute bottom-2 right-2 bg-black/50 backdrop-blur-md text-[10px] font-semibold px-2 py-1 rounded-lg text-gray-200 border border-white/10">' +
        T("rent_from") + ' ' + it.raw.min_duration_days + '-' + it.raw.max_duration_days + ' ' + t("rent_days_suffix") +
      '</span>' +
    '</div>' +
    '<div class="p-3.5 flex flex-col gap-1.5">' +
      '<div class="flex items-center justify-between">' +
        '<div class="text-sm font-bold text-white truncate">' + it.title + '</div>' +
        NumberBadge +
      '</div>' +
      '<div class="text-sm font-bold text-neon-yellow">' + fmtUZS(it.price) + ' <span class="text-[11px] text-gray-400 font-normal">· 1 ' + t("rent_days_suffix") + '</span></div>' +
      '<button data-i="' + i + '" class="rent-btn press mt-2 w-full py-3 rounded-2xl btn-primary font-semibold text-white text-sm">' + t("rent_btn") + '</button>' +
    '</div>' +
  '</div>';
}

function renderRentGrid() {
  Const grid = document.getElementById("ijara-grid");
  Const items = catalog.nft_rent;

  Grid.innerHTML = items.map(function(it, i) { return rentCardHTML(it, i); }).join("");

  Array.prototype.forEach.call(grid.querySelectorAll(".rent-card"), function(card) {
    Card.addEventListener("click", function(e) {
      If (e.target.closest(".rent-btn")) return; // кнопка сама откроет — избегаем двойного триггера
      OpenModal(items[Number(card.dataset.i)]);
    });
  });
  Array.prototype.forEach.call(grid.querySelectorAll(".rent-btn"), function(btn) {
    Btn.addEventListener("click", function() { openModal(items[Number(btn.dataset.i)]); });
  });

  RevealOnScroll(grid);
  RenderLoadMoreButton();
}

function renderLoadMoreButton() {
  Const existing = document.getElementById("rent-load-more");
  If (existing) existing.remove();

  If (!rentNextCursor) return;

  Const btn = document.createElement("button");
  Btn.id = "rent-load-more";
  Btn.className = "col-span-2 mt-1 py-3.5 rounded-2xl pill press text-sm font-semibold";
  Btn.textContent = t("load_more");
  Btn.addEventListener("click", loadMoreRent);
  Document.getElementById("ijara-grid").appendChild(btn);
}

async function loadMoreRent() {
  If (rentLoadingMore) return;
  RentLoadingMore = true;
  Const btn = document.getElementById("rent-load-more");
  If (btn) { btn.textContent = "..."; btn.disabled = true; }

  Try {
    Const page = await fetchRentPage(rentNextCursor);
    Catalog.nft_rent = catalog.nft_rent.concat(page.items);
    RentNextCursor = page.nextCursor;
    RenderRentGrid();
  } catch (e) { /* тихо игнорируем — кнопка просто останется */ }

  RentLoadingMore = false;
}

async function renderIjara(reset) {
  Const grid = document.getElementById("ijara-grid");

  If (reset || !catalog.nft_rent.length) {
    Grid.innerHTML = skeletonHTML(4, "h-80");
    Catalog.nft_rent = [];
    RentNextCursor = null;

    Try {
      Const page = await fetchRentPage(null);
      Catalog.nft_rent = page.items;
      RentNextCursor = page.nextCursor;
    } catch (e) {
      Grid.innerHTML = '<p class="col-span-2 text-center text-xs text-gray-500 py-8">' + t("empty") + '</p>';
      Return;
    }
  }

  If (!catalog.nft_rent.length) { grid.innerHTML = '<p class="col-span-2 text-center text-xs text-gray-500 py-8">' + t("empty") + '</p>'; return; }
  RenderRentGrid();
}

Document.getElementById("rent-sort-select").addEventListener("change", function(e) {
  CurrentRentSort = e.target.value;
  RenderIjara(true);
});

/* ---------------- Фильтр по коллекции ---------------- */
Let _collectionsCache = null;

Document.getElementById("rent-collection-btn").addEventListener("click", openCollectionModal);
Document.getElementById("collection-close-btn").addEventListener("click", closeCollectionModal);
Document.getElementById("collection-modal").addEventListener("click", function(e) {
  If (e.target === document.getElementById("collection-modal")) closeCollectionModal();
});

async function openCollectionModal() {
  Const modal = document.getElementById("collection-modal");
  Const content = document.getElementById("collection-content");
  Const listEl = document.getElementById("collection-list");

  Modal.classList.remove("hidden");
  RequestAnimationFrame(function() {
    Modal.classList.remove("opacity-0");
    Content.classList.remove("translate-y-full");
  });

  If (!_collectionsCache) {
    ListEl.innerHTML = skeletonHTML(4, "h-12");
    Try {
      Const res = await fetch("/api/rent_collections");
      _collectionsCache = await res.json();
    } catch (e) { _collectionsCache = []; }
  }

  PaintCollectionList();
}

function paintCollectionList() {
  Const listEl = document.getElementById("collection-list");
  Const rows = [{ name: t("collection_all"), address: null, image: null }].concat(_collectionsCache || []);

  ListEl.innerHTML = rows.map(function(c) {
    Const selected = c.address === currentRentCollection;
    Const iconHTML = c.image
      ? '<img src="' + c.image + '" alt="" class="w-8 h-8 rounded-lg object-cover flex-shrink-0" onerror="this.replaceWith(Object.assign(document.createElement(\'div\'],{className:\'w-8 h-8 rounded-lg bg-white/10 flex-shrink-0\'}))">'
      : '<div class="w-8 h-8 rounded-lg bg-white/10 flex-shrink-0"></div>';
    Return '<div data-address="' + (c.address || "") + '" data-name="' + c.name + '" class="collection-row press flex items-center gap-3 rounded-2xl p-3 cursor-pointer border ' +
      (selected ? "bg-neon-blue/10 border-neon-blue/50" : "bg-white/[0.04] border-white/[0.08]") + '">' +
      iconHTML +
      '<span class="text-sm font-medium text-white flex-1">' + c.name + '</span>' +
      (selected ? '<span class="text-neon-blue text-sm">✓</span>' : '') +
    '</div>';
  }).join("");

  Array.prototype.forEach.call(listEl.querySelectorAll(".collection-row"), function(row) {
    Row.addEventListener("click", function() {
      CurrentRentCollection = row.dataset.address || null;
      CurrentRentCollectionName = currentRentCollection ? row.dataset.name : null;
      Document.getElementById("rent-collection-label").textContent = currentRentCollectionName || t("collection_all");
      CloseCollectionModal();
      RenderIjara(true);
    });
  });
}

function closeCollectionModal() {
  Const modal = document.getElementById("collection-modal");
  Const content = document.getElementById("collection-content");
  Content.classList.add("translate-y-full");
  Modal.classList.add("opacity-0");
  SetTimeout(function() { modal.classList.add("hidden"); }, 300);
}

/* ---------------- Premium: список с радио-выбором ---------------- */
Let selectedPremiumIndex = 0;

async function renderPremiumList() {
  Document.getElementById("products-grid").classList.add("hidden");
  Const container = document.getElementById("premium-list");
  Container.classList.remove("hidden");

  Const optionsEl = document.getElementById("premium-options");
  OptionsEl.innerHTML = skeletonHTML(3, "h-16");

  Let items;
  Try { items = await loadCatalog("premium"); }
  Catch (e) { optionsEl.innerHTML = '<p class="text-center text-xs text-gray-500 py-8">' + t("empty") + '</p>'; return; }

  If (!items.length) { optionsEl.innerHTML = '<p class="text-center text-xs text-gray-500 py-8">' + t("empty") + '</p>'; return; }
  If (selectedPremiumIndex >= items.length) selectedPremiumIndex = 0;

  function paint() {
    // "Популярный" — на тариф с самым долгим сроком (обычно 12 месяцев).
    // Если совпадений несколько (напр. "12 месяцев" и "12 месяцев как подарок"),
    // помечаем только первый по списку, чтобы бейдж не задублировался.
    Const durationOf = function(title) {
      Const m = /^(\d+)/.exec(title || "");
      Return m ? parseInt(m[1], 10) : 0;
    };
    Const maxDuration = Math.max.apply(null, items.map(function(it) { return durationOf(it.title); }));
    Let popularMarked = false;

    OptionsEl.innerHTML = items.map(function(it, i) {
      Const selected = i === selectedPremiumIndex;
      Const isPopular = !popularMarked && maxDuration > 0 && durationOf(it.title) === maxDuration;
      If (isPopular) popularMarked = true;
      Const popularBadge = isPopular
        ? '<span class="badge-popular absolute -top-2 right-3 pill-gold text-[9px] font-bold px-2 py-0.5 rounded-full leading-none">' + t("badge_popular") + '</span>'
        : "";
      Return '<div data-i="' + i + '" class="premium-option press flex items-center justify-between gap-3 rounded-2xl p-4 cursor-pointer border relative ' +
        (selected ? "bg-neon-blue/10 border-neon-blue/50" : (isPopular ? "bg-white/[0.04] card-popular" : "bg-white/[0.04] border-white/[0.08]")) + '">' +
        popularBadge +
        '<div class="flex items-center gap-3 min-w-0">' +
          '<span class="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ' + (selected ? "border-neon-blue" : "border-gray-600") + '">' +
            (selected ? '<span class="w-2.5 h-2.5 rounded-full bg-neon-blue"></span>' : "") +
          '</span>' +
          '<span class="text-[13.5px] font-semibold text-white leading-tight">' + it.title + '</span>' +
        '</div>' +
        '<span class="text-[13.5px] font-bold text-neon-yellow flex-shrink-0">' + fmtUZS(it.price) + '</span>' +
      '</div>';
    }).join("");

    Array.prototype.forEach.call(optionsEl.querySelectorAll(".premium-option"), function(row) {
      Row.addEventListener("click", function() {
        SelectedPremiumIndex = Number(row.dataset.i);
        Paint();
        UpdatePremiumCta();
      });
    });
  }

  function updatePremiumCta() {
    Const btn = document.getElementById("premium-cta-btn");
    Const it = items[selectedPremiumIndex];
    Btn.textContent = it.title + " " + t("premium_get_suffix");
    Btn.onclick = function() { openModal(it); };
  }

  Paint();
  UpdatePremiumCta();
}

function skeletonHTML(n, heightClass) {
  Let out = "";
  For (let i = 0; i < n; i++) out += '<div class="skeleton rounded-2xl ' + heightClass + '"></div>';
  Return out;
}

function setCategory(cat) {
  CurrentCategory = cat;
  Array.prototype.forEach.call(document.querySelectorAll(".cat-btn"), function(btn) {
    Btn.className = "cat-btn press px-4 py-2 rounded-full pill text-xs whitespace-nowrap";
  });
  Document.getElementById("cat-" + cat).className = "cat-btn press px-4 py-2 rounded-full pill-gold text-xs font-semibold whitespace-nowrap";
  RenderItems();
}

function switchTab(tab) {
  CurrentTab = tab;
  ["asosiy","ijara","savat","tarix","top","profil"].forEach(function(x) {
    Document.getElementById("view-" + x).classList.add("view-hidden");
  });
  Document.getElementById("view-" + tab).classList.remove("view-hidden");
  Array.prototype.forEach.call(document.querySelectorAll(".nav-btn"), function(btn) {
    Btn.classList.remove("text-neon-blue"); btn.classList.add("text-gray-500");
  });
  Document.getElementById("tab-" + tab).classList.remove("text-gray-500");
  Document.getElementById("tab-" + tab).classList.add("text-neon-blue");
  If (tab === "ijara") { renderIjara(); renderMyRentals(); }
  If (tab === "savat") renderCart();
  If (tab === "tarix") renderHistory();
  If (tab === "top") renderLeaderboard(currentTopPeriod);
  If (tab === "profil") { initProfile(); renderProfileStats(); }
}

/* ---------------- Модалка оплаты ---------------- */
Let activeItem = null;
Let recipientType = "self";
Let rentDays = 1;

Const modal = document.getElementById("payment-modal");
Const modalContent = document.getElementById("payment-content");

function setRecipient(type) {
  RecipientType = type;
  Const btnSelf = document.getElementById("rec-self");
  Const btnFriend = document.getElementById("rec-friend");
  Const userField = document.getElementById("username-field");
  Const activeCls = "flex-1 py-1.5 rounded-lg bg-white/10 font-semibold text-xs text-white shadow-inner";
  Const inactiveCls = "flex-1 py-1.5 rounded-lg text-gray-400 font-semibold text-xs";

  If (type === "self") {
    BtnSelf.className = activeCls; btnFriend.className = inactiveCls;
    UserField.classList.add("hidden");
  } else {
    BtnFriend.className = activeCls; btnSelf.className = inactiveCls;
    UserField.classList.remove("hidden");
    ShowRecentRecipientChip();
  }
  Document.getElementById("modal-error").classList.add("hidden");
}

function showRecentRecipientChip() {
  Let recent = null;
  Try { recent = localStorage.getItem("oson_last_recipient"); } catch (e) { /* недоступно — просто не покажем чип */ }

  Const chip = document.getElementById("recent-recipient-chip");
  Const btn = document.getElementById("recent-recipient-btn");
  If (!recent) { chip.classList.add("hidden"); return; }

  Btn.textContent = recent;
  Btn.onclick = function() { document.getElementById("gift-username").value = recent; };
  Chip.classList.remove("hidden");
}

function saveRecentRecipient(username) {
  Try { localStorage.setItem("oson_last_recipient", username); } catch (e) { /* тихо игнорируем */ }
}

function stepDays(delta) {
  If (!activeItem) return;
  Let min, max;
  If (activeItem.kind === "nft_rent") {
    Min = activeItem.raw.min_duration_days; max = activeItem.raw.max_duration_days;
  } else if (activeItem.kind === "nft_rent_extend") {
    Min = activeItem.raw.min_days; max = activeItem.raw.max_days;
  } else {
    Return;
  }
  Const next = rentDays + delta;
  If (next < min || next > max) return;
  RentDays = next;
  Document.getElementById("days-value").textContent = rentDays;
  Document.getElementById("modal-price").textContent = fmtUZS(activeItem.price * rentDays);
  If (activeItem.kind === "nft_rent_extend") updateExtendUntilLabel();
}

/** Показывает, до какой даты сдвинется аренда при выбранном числе дней. */
function updateExtendUntilLabel() {
  Const el = document.getElementById("extend-note");
  If (!el || !activeItem || activeItem.kind !== "nft_rent_extend") return;
  Const ends = new Date(String(activeItem.raw.ends_at).replace(" ", "T") + "Z");
  Const newEnds = new Date(ends.getTime() + rentDays * 86400000);
  El.innerHTML = t("rent_extend_note") +
    '<br><span class="text-white font-semibold">' + t("rent_extend_until") + ": " +
    newEnds.toISOString().slice(0, 10) + '</span>';
}

Const GIFT_QTY_MAX = 10;
Let giftQty = 1;
function stepGiftQty(delta) {
  If (!activeItem || activeItem.kind !== "simple_gift") return;
  Const next = giftQty + delta;
  If (next < 1 || next > GIFT_QTY_MAX) return;
  GiftQty = next;
  Document.getElementById("gift-qty-value").textContent = giftQty;
  Document.getElementById("modal-price").textContent = fmtUZS(activeItem.price * giftQty);
}

// Пределы одного заказа звёзд — столько принимает Fragment/MarketApp
// (их ошибка: "400: {'detail': '50 - 1,000,000'}"). Те же числа проверяются
// на сервере: здесь это удобство, там — защита.
Const STARS_MIN = 50;
Const STARS_MAX = 1000000;

Let _starsRateCache = null;
async function openCustomStarsModal() {
  If (!_starsRateCache) {
    Const res = await fetch("/api/stars_rate");
    _starsRateCache = await res.json();
  }
  Const rate = _starsRateCache.rate_uzs_per_star;
  Const qty = 50;
  OpenModal({
    Kind: "stars_custom",
    Title: t("custom_amount"),
    Price: rate * qty,
    Emoji: "✏️",
    Raw: { rate: rate, qty: qty, min: _starsRateCache.min_stars || 50 },
  });
}

async function openModal(item) {
  ActiveItem = item;
  If (item.kind === "nft_rent") rentDays = item.raw.min_duration_days;
  else if (item.kind === "nft_rent_extend") rentDays = item.raw.min_days || 1;
  else rentDays = 1;

  Document.getElementById("modal-title").textContent = item.title + (item.raw && item.raw.number ? " #" + item.raw.number : "");
  Const emojiEl = document.getElementById("modal-emoji");
  If (item.image) {
    Const bigClass = item.kind === "nft_rent" ? "w-24 h-24" : "w-10 h-10";
    EmojiEl.className = "rounded-2xl overflow-hidden flex-shrink-0 animated-gift";
    EmojiEl.innerHTML = '<img src="' + item.image + '" class="' + bigClass + ' rounded-2xl object-cover" onerror="this.parentElement.textContent=\'' + item.emoji + '\';" />';
  } else {
    EmojiEl.className = "text-4xl animated-gift";
    EmojiEl.textContent = item.emoji;
  }
  Const isRentLike = item.kind === "nft_rent" || item.kind === "nft_rent_extend";
  Document.getElementById("modal-price").textContent = fmtUZS(isRentLike ? item.price * rentDays : item.price);
  Document.getElementById("gift-message").value = "";
  Document.getElementById("gift-username").value = "";
  Document.getElementById("modal-error").classList.add("hidden");
  SetRecipient("self");

  // Продление: получателя выбирать не нужно — подарок уже у клиента в профиле
  Const isExtend = item.kind === "nft_rent_extend";
  Document.getElementById("recipient-field").classList.toggle("hidden", isExtend);
  If (isExtend) document.getElementById("username-field").classList.add("hidden");
  Const extendNote = document.getElementById("extend-note");
  ExtendNote.classList.toggle("hidden", !isExtend);
  If (isExtend) updateExtendUntilLabel();

  // "В корзину" — только для обычных товаров: у аренды свой срок и комиссия сети
  Const addCartBtn = document.getElementById("add-to-cart-btn");
  Const cartable = ["stars", "stars_custom", "premium", "simple_gift"].indexOf(item.kind) !== -1;
  AddCartBtn.classList.toggle("hidden", !cartable);

  Document.getElementById("rent-days-field").classList.toggle("hidden", !isRentLike);
  If (isRentLike) document.getElementById("days-value").textContent = rentDays;

  Document.getElementById("gift-quantity-field").classList.toggle("hidden", item.kind !== "simple_gift");
  If (item.kind === "simple_gift") {
    GiftQty = 1;
    Document.getElementById("gift-qty-value").textContent = giftQty;
    Document.getElementById("modal-price").textContent = fmtUZS(item.price * giftQty);
  }

  Const starsCustomField = document.getElementById("stars-custom-field");
  Const starsCustomInput = document.getElementById("stars-custom-input");
  StarsCustomField.classList.toggle("hidden", item.kind !== "stars_custom");
  If (item.kind === "stars_custom") {
    StarsCustomInput.value = item.raw.qty || STARS_MIN;
    StarsCustomInput.oninput = function() {
      Let qty = parseInt(starsCustomInput.value, 10);
      If (isNaN(qty) || qty < STARS_MIN) qty = STARS_MIN;
      // Fragment больше миллиона за раз не продаёт — не даём набрать сумму,
      // которую потом невозможно будет выполнить. Поле поправляем прямо на
      // экране, чтобы человек видел, на чём его ограничили.
      If (qty > STARS_MAX) {
        Qty = STARS_MAX;
        StarsCustomInput.value = STARS_MAX;
      }
      Item.raw.qty = qty;
      Item.price = qty * item.raw.rate;
      Document.getElementById("modal-price").textContent = fmtUZS(item.price);
    };
  }

  Const previewBtn = document.getElementById("preview-gift-btn");
  If (item.kind === "nft_rent" && item.previewUrl) {
    PreviewBtn.classList.remove("hidden");
    PreviewBtn.onclick = function() {
      If (tg && tg.openTelegramLink) tg.openTelegramLink(item.previewUrl);
      Else window.open(item.previewUrl, "_blank");
    };
  } else {
    PreviewBtn.classList.add("hidden");
    PreviewBtn.onclick = null;
  }

  Try {
    Const pay = await getPaymentInfo();
    Document.getElementById("pay-card-number").textContent = pay.card_number || "—";
    Document.getElementById("pay-card-holder").textContent = pay.card_holder || "—";
  } catch (e) {
    Document.getElementById("pay-card-number").textContent = "—";
  }

  If (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred("light");
  Modal.classList.remove("hidden");
  RequestAnimationFrame(function() {
    Modal.classList.remove("opacity-0");
    ModalContent.classList.remove("translate-y-full");
  });
}

function closeModal() {
  If (document.activeElement && document.activeElement.blur) document.activeElement.blur(); // убрать клавиатуру
  ModalContent.classList.add("translate-y-full");
  Modal.classList.add("opacity-0");
  SetTimeout(function() { modal.classList.add("hidden"); }, 300);
}

// Клик по затемнённому фону вокруг шторки — тоже закрывает
Modal.addEventListener("click", function(e) {
  If (e.target === modal) closeModal();
});

/* ---------------- Свайп вниз для закрытия шторки ---------------- */
(function enableSwipeToDismiss() {
  Const handle = document.getElementById("sheet-handle");
  Let startY = 0, currentY = 0, dragging = false;

  function onStart(y) {
    Dragging = true;
    StartY = y;
    CurrentY = y;
    ModalContent.style.transition = "none";
  }
  function onMove(y) {
    If (!dragging) return;
    CurrentY = y;
    Const delta = Math.max(0, currentY - startY);
    ModalContent.style.transform = "translateY(" + delta + "px)";
  }
  function onEnd() {
    If (!dragging) return;
    Dragging = false;
    ModalContent.style.transition = "";
    Const delta = currentY - startY;
    ModalContent.style.transform = "";
    If (delta > 90) {
      CloseModal();
    }
  }

  Handle.addEventListener("touchstart", function(e) { onStart(e.touches[0].clientY); }, { passive: true });
  Handle.addEventListener("touchmove", function(e) { onMove(e.touches[0].clientY); }, { passive: true });
  Handle.addEventListener("touchend", onEnd);

  // На всякий случай (десктоп/тестирование) — те же события мышью
  Handle.addEventListener("mousedown", function(e) { onStart(e.clientY); });
  Document.addEventListener("mousemove", function(e) { if (dragging) onMove(e.clientY); });
  Document.addEventListener("mouseup", onEnd);
})();

Let _paymentInfoCache = null;
async function getPaymentInfo() {
  If (_paymentInfoCache) return _paymentInfoCache;
  Const res = await fetch("/api/payment_info");
  _paymentInfoCache = await res.json();
  Return _paymentInfoCache;
}

function copyCard() {
  GetPaymentInfo().then(function(p) {
    Navigator.clipboard.writeText((p.card_number || "").replace(/\s/g, ""));
    If (tg && tg.showAlert) tg.showAlert(t("copied")); else alert(t("copied"));
  });
}

function openTgUsername(username) {
  If (!username) return;
  If (tg && tg.openTelegramLink) tg.openTelegramLink("https://t.me/" + username);
  Else window.open("https://t.me/" + username, "_blank");
}

async function initSupportInfo() {
  Try {
    Const res = await fetch("/api/support_info");
    Const info = await res.json();

    If (info.operator_username) {
      Document.getElementById("operator-handle").textContent = "@" + info.operator_username;
      Document.getElementById("row-operator").onclick = function() { openTgUsername(info.operator_username); };
    }
    If (info.channel_username) {
      Const row = document.getElementById("row-channel");
      Row.classList.remove("hidden"); row.classList.add("flex");
      Document.getElementById("channel-handle").textContent = "@" + info.channel_username;
      Row.onclick = function() { openTgUsername(info.channel_username); };
    }
    If (info.orders_channel_username) {
      Const row = document.getElementById("row-orders");
      Row.classList.remove("hidden"); row.classList.add("flex");
      Document.getElementById("orders-handle").textContent = "@" + info.orders_channel_username;
      Row.onclick = function() { openTgUsername(info.orders_channel_username); };
    }
  } catch (e) { /* тихо игнорируем — строки просто останутся скрытыми/пустыми */ }
}

/* ---------------- Отправка заказа боту ---------------- */
// Защита от двойного заказа: пока предыдущий запрос ещё летит на сервер,
// повторные нажатия "To'ladim" игнорируются. Без этого двойной тап (частая
// вещь на телефоне, особенно при медленном интернете) создавал ДВА заказа.
Let orderInFlight = false;

function sendPaymentInfo() {
  If (orderInFlight) return;
  Const errorEl = document.getElementById("modal-error");
  Let friendUsername = document.getElementById("gift-username").value.trim();

  If (recipientType === "friend") {
    If (!friendUsername) { errorEl.textContent = t("err_username"); errorEl.classList.remove("hidden"); return; }
    If (friendUsername.charAt(0) !== "@") friendUsername = "@" + friendUsername;
  }

  // Юзернейм для "себе" достаём на СЕРВЕРЕ (бот всегда точно знает,
  // кто написал) — клиентский tg.initDataUnsafe не всегда надёжен
  // (кэш вебвью и т.п.), поэтому здесь ничего не проверяем и не блокируем.
  Const item = activeItem;
  Const message = document.getElementById("gift-message").value.trim();
  Const recipient = recipientType === "self" ? "" : friendUsername;

  Const payload = {
    Category: item.kind,
    Recipient: recipient,
    Recipient_type: recipientType,
    Note: message || undefined,
  };

  If (item.kind === "stars") {
    Payload.item_name = item.raw.amount + " звёзд"; payload.price = item.raw.price_uzs; payload.quantity = item.raw.amount;
  } else if (item.kind === "stars_custom") {
    Payload.item_name = item.raw.qty + " звёзд"; payload.price = item.price; payload.quantity = item.raw.qty;
  } else if (item.kind === "premium") {
    Payload.item_name = "Premium — " + item.raw.label; payload.price = item.raw.price_uzs; payload.quantity = 1;
  } else if (item.kind === "simple_gift") {
    Payload.item_name = "Подарок " + item.emoji + " (" + item.raw.star_count + "⭐) x" + giftQty;
    Payload.price = item.raw.price_uzs * giftQty;
    Payload.quantity = giftQty;
    Payload.gift_id = item.raw.id;
  } else if (item.kind === "nft_rent") {
    // БАГ БЫЛ ЗДЕСЬ: цену для аренды не клали в payload вообще, и экран после
    // оформления показывал "0 so'm". Точную сумму (с комиссией сети) всё равно
    // считает сервер, но и здесь она теперь не нулевая.
    Payload.price = item.price * rentDays;
    Payload.item_name = item.raw.name; payload.nft_address = item.raw.nft_address;
    Payload.base_price_per_day_gram = item.raw.base_price_per_day_gram;
    Payload.min_days = item.raw.min_duration_days; payload.max_days = item.raw.max_duration_days;
    Payload.days = rentDays;
  } else if (item.kind === "nft_rent_extend") {
    // Продление: серверу достаточно адреса гифта и числа дней — цену и права
    // на эту аренду он берёт из собственной базы, данным клиента тут не верим.
    Payload.price = item.price * rentDays;
    Payload.item_name = item.raw.item_name;
    Payload.nft_address = item.raw.nft_address;
    Payload.days = rentDays;
  }

  If (recipientType === "friend" && friendUsername) saveRecentRecipient(friendUsername);

  // БЫЛО: tg.sendData(...) — работает ТОЛЬКО если мини-апп открыт через
  // растянутую кнопку клавиатуры ("Do'konni ochish"). Через компактную Menu
  // Button ("Открыть" у поля ввода) sendData() вообще не доходит до бота —
  // это ограничение самого Telegram, не баг. Поэтому теперь заказ уходит
  // обычным HTTP-запросом с подписью initData (её бот проверяет на сервере
  // той же функцией, что и для Tarix/TOP/Profil) — работает одинаково
  // из любой точки входа.
  SubmitOrder(payload);
}

async function submitOrder(payload) {
  Const errorEl = document.getElementById("modal-error");
  Const payBtn = document.querySelector('[onclick="sendPaymentInfo()"]');
  Const base = await getShopApiUrl();

  If (!base || !tg || !tg.initData) {
    OrderInFlight = false;
    If (tg && tg.sendData) {
      // Резервный путь на случай, если публичный API ещё не настроен
      // (SHOP_API_URL пустой) — старый способ хотя бы не роняет заказ совсем.
      // Telegram сам закрывает WebApp после sendData() — это его поведение,
      // мы это не контролируем.
      Tg.sendData(JSON.stringify(payload));
      Tg.close();
    } else {
      Alert("DEMO (Telegram ichida ochish kerak): " + JSON.stringify(payload, null, 2));
    }
    Return;
  }

  ErrorEl.classList.add("hidden");
  OrderInFlight = true;
  Const prevBtnHtml = payBtn ? payBtn.innerHTML : null;
  If (payBtn) {
    PayBtn.disabled = true;
    PayBtn.innerHTML = '<span class="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full align-middle" style="animation: spin .7s linear infinite;"></span>';
  }

  Try {
    // БЫЛО: /public/create_order — бот присылал в ЧАТ вопрос «Всё верно?»,
    // и покупка обрывалась на середине: человек должен был выйти из витрины
    // в переписку. Теперь заказ создаётся сразу, а витрина сама ведёт клиента
    // по этапам (оплата -> проверка -> выполнение -> готово).
    Const res = await fetch(base + "/public/place_order", {
      Method: "POST", headers: { "Content-Type": "application/json" },
      Body: JSON.stringify({ initData: tg.initData, payload: payload }),
    });
    Const data = await res.json();
    If (!res.ok || data.error) {
      ErrorEl.textContent = data.error === "no_username" ? t("cart_err_no_username")
        : data.error === "stars_limit" ? t("cart_err_stars_limit")
        : (data.error || "Xatolik yuz berdi, qayta urinib ko'ring.");
      ErrorEl.classList.remove("hidden");
      Return;
    }
    OpenOrderFlow({ order_id: data.order_id }, {
      Order_id: data.order_id,
      Item_name: data.item_name || payload.item_name,
      Recipient: data.recipient || payload.recipient,
      Price_uzs: data.price_uzs,
      Pay_amount: data.pay_amount,
      Card_number: data.card_number,
      Card_holder: data.card_holder,
    });
  } catch (e) {
    ErrorEl.textContent = "Server bilan bog'lanib bo'lmadi, qayta urinib ko'ring.";
    ErrorEl.classList.remove("hidden");
  } finally {
    OrderInFlight = false;
    If (payBtn) {
      PayBtn.disabled = false;
      PayBtn.innerHTML = prevBtnHtml;
    }
  }
}

function launchSuccessConfetti() {
  Const box = document.getElementById("success-confetti");
  If (!box) return;
  Const colors = ["#10B981", "#D9B45B", "#2AABEE", "#8E8CD8", "#F0DFA0"];
  Let html = "";
  For (let i = 0; i < 20; i++) {
    Const angle = (Math.PI * 2 * i) / 20 + Math.random() * 0.3;
    Const dist = 70 + Math.random() * 60;
    Html += '<span class="confetti-piece" style="--tx:' + Math.round(Math.cos(angle) * dist) +
      'px; --ty:' + Math.round(Math.sin(angle) * dist) + 'px; --rot:' + Math.round((Math.random() - 0.5) * 520) +
      'deg; background:' + colors[i % colors.length] + '; animation-delay:' + Math.round(Math.random() * 120) + 'ms;"></span>';
  }
  Box.innerHTML = html;
}

/* ================= ЖИВОЙ СТАТУС ЗАКАЗА =================
 * Раньше витрина показывала «заказ принят» и на этом заканчивалась: всё
 * остальное (оплата, подтверждение, выполнение) человек видел только в чате
 * бота. Теперь весь путь заказа проходит здесь — экран сам опрашивает сервер
 * и переключает этапы: ждём оплату -> проверяем чек -> выполняется -> готово.
 */
Const FLOW_POLL_MS = 5000;
Let flowOrder = null; // {order_id, cart_id}
Let flowStatus = null; // последний ответ сервера
Let flowSignature = null; // отпечаток последнего отрисованного состояния
Let flowTimer = null;
Let flowTipTimer = null;

Const FLOW_STEP_BY_STATUS = {
  Awaiting_payment: 1, payment_review: 2, paid: 3, fulfilling: 3, completed: 4, rejected: 0,
};

function openOrderFlow(ref, optimistic) {
  FlowOrder = { order_id: ref.order_id || null, cart_id: ref.cart_id || null };
  FlowSignature = null;
  CloseModal();
  Document.getElementById("order-flow-screen").classList.remove("hidden");

  // Первый кадр рисуем сразу из того, что уже знает витрина, чтобы экран не
  // мигал пустотой, пока летит первый запрос статуса.
  If (optimistic) {
    FlowStatus = Object.assign({ status: "awaiting_payment", items: [] }, optimistic);
    RenderOrderFlow();
  }
  PollOrderFlow();
  StartFlowPolling();
}

function closeOrderFlow() {
  StopFlowPolling();
  FlowOrder = null;
  Document.getElementById("order-flow-screen").classList.add("hidden");
  RefreshActiveOrder();
}

function startFlowPolling() {
  StopFlowPolling();
  FlowTimer = setInterval(pollOrderFlow, FLOW_POLL_MS);
}

function stopFlowPolling() {
  If (flowTimer) { clearInterval(flowTimer); flowTimer = null; }
  If (flowTipTimer) { clearInterval(flowTipTimer); flowTipTimer = null; }
}

async function pollOrderFlow() {
  If (!flowOrder) return;
  Const base = await getShopApiUrl();
  Const initData = await waitForInitData();
  If (!base || !initData) return;

  Try {
    Const res = await fetch(base + "/public/order_status", {
      Method: "POST", headers: { "Content-Type": "application/json" },
      Body: JSON.stringify({ initData: initData, order_id: flowOrder.order_id, cart_id: flowOrder.cart_id }),
    });
    Const data = await res.json();
    If (!data.ok) return; // заказ ещё не виден/не найден — попробуем на следующем круге

    // Перерисовываем экран ТОЛЬКО когда что-то реально изменилось: иначе
    // каждые 5 секунд пересобирался бы блок действий — моргала бы анимация,
    // а у человека могло бы "выпрыгнуть" из-под пальца поле или кнопка.
    Const sig = [data.status, data.needs_rent_link, data.price_uzs, data.item_name, data.admin_comment].join("|");
    Const statusChanged = flowSignature !== null && flowSignature !== sig;
    Const first = flowSignature === null;
    FlowSignature = sig;
    FlowStatus = data;
    If (!flowOrder.cart_id && data.cart_id) flowOrder.cart_id = data.cart_id;
    If (statusChanged || first) renderOrderFlow(!first);

    // Заказ дошёл до конца — больше опрашивать нечего
    If (data.status === "completed" || data.status === "rejected") stopFlowPolling();
  } catch (e) { /* сеть моргнула — следующий круг опроса попробует снова */ }
}

/** Кружок этапа: пройденный, текущий (пульсирует) или будущий. */
function flowStepsHTML(step) {
  Const labels = [t("flow_step_created"), t("flow_step_payment"), t("flow_step_doing"), t("flow_step_done")];
  Return labels.map(function(label, i) {
    Const n = i + 1;
    Const done = step > n;
    Const current = step === n;
    Const dot = done
      ? '<span class="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">✓</span>'
      : current
        ? '<span class="w-5 h-5 rounded-full bg-neon-blue text-white text-[10px] font-bold flex items-center justify-center animate-pulse">' + n + '</span>'
        : '<span class="w-5 h-5 rounded-full bg-white/[0.08] text-gray-500 text-[10px] font-bold flex items-center justify-center">' + n + '</span>';
    Const line = i < labels.length - 1
      ? '<span class="flex-1 h-[2px] ' + (step > n ? "bg-emerald-500" : "bg-white/10") + ' mx-1"></span>'
      : "";
    Return '<div class="flex items-center ' + (i < labels.length - 1 ? "flex-1" : "") + '">' +
      '<div class="flex flex-col items-center gap-1">' + dot +
        '<span class="text-[8px] ' + (current ? "text-neon-blue font-semibold" : "text-gray-500") + ' whitespace-nowrap">' + label + '</span>' +
      '</div>' + line +
    '</div>';
  }).join("");
}

Const FLOW_VISUAL = {
  Check: '<div id="success-confetti" class="absolute inset-0"></div>' +
    '<div class="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center relative" style="animation: successPop .5s cubic-bezier(.2,1.4,.4,1) both; box-shadow: 0 0 36px -4px rgba(16,185,129,0.6);">' +
      '<svg width="36" height="36" viewBox="0 0 24 24" fill="none">' +
        '<path d="M4 12.5L9.5 18L20 6" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" ' +
              'stroke-dasharray="26" stroke-dashoffset="26" style="animation: drawCheck .4s ease-out .25s forwards;"/>' +
      '</svg>' +
    '</div>',
  Waiting: '<div class="w-20 h-20 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center relative">' +
      '<span class="absolute inset-0 rounded-full border-2 border-neon-blue/50 pulse-ring"></span>' +
      '<span class="text-3xl">💳</span>' +
    '</div>',
  // Крутящееся кольцо + эмодзи внутри: видно, что процесс идёт
  Spinner: function(emoji) {
    Return '<div class="w-20 h-20 rounded-full flex items-center justify-center relative">' +
        '<span class="absolute inset-0 rounded-full border-[3px] border-white/10 border-t-neon-blue" style="animation: spin 1s linear infinite;"></span>' +
        '<span class="absolute inset-0 rounded-full border-2 border-neon-blue/40 pulse-ring"></span>' +
        '<span class="text-3xl">' + emoji + '</span>' +
      '</div>';
  },
  Failed: '<div class="w-20 h-20 rounded-full bg-red-500/15 border border-red-500/40 flex items-center justify-center">' +
      '<span class="text-3xl">✕</span>' +
    '</div>',
};

function renderOrderFlow(statusChanged) {
  Const s = flowStatus;
  If (!s) return;
  Const visual = document.getElementById("flow-visual");
  Const titleEl = document.getElementById("flow-title");
  Const subEl = document.getElementById("flow-subtitle");
  Const actionEl = document.getElementById("flow-action");
  Const buttonsEl = document.getElementById("flow-buttons");

  Document.getElementById("success-item").textContent = s.item_name || "—";
  Document.getElementById("success-recipient").textContent =
    s.recipient && s.recipient.charAt(0) === "@" ? s.recipient : t("cart_to_self");
  Document.getElementById("success-price").textContent = fmtUZS(s.price_uzs || 0);
  Document.getElementById("flow-steps").innerHTML = flowStepsHTML(FLOW_STEP_BY_STATUS[s.status] || 1);

  If (flowTipTimer) { clearInterval(flowTipTimer); flowTipTimer = null; }

  If (s.status === "completed") {
    Visual.innerHTML = FLOW_VISUAL.check;
    TitleEl.textContent = t("flow_done_title");
    TitleEl.className = "text-[19px] font-bold mb-1 text-emerald-400";
    SubEl.textContent = t("flow_done_sub");
    ActionEl.innerHTML = "";
    ButtonsEl.innerHTML =
      '<button onclick="flowBuyMore()" class="w-full py-3.5 rounded-2xl btn-primary press font-semibold text-white text-sm mb-2.5">' + t("order_success_more") + '</button>' +
      '<button onclick="flowGoTarix()" class="w-full py-3.5 rounded-2xl pill press font-semibold text-sm mb-2.5">' + t("order_success_history") + '</button>' +
      '<button onclick="closeOrderFlow()" class="w-full py-3 text-gray-400 text-xs">' + t("order_success_home") + '</button>';
    LaunchSuccessConfetti();
    If (statusChanged && tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred("success");
    Return;
  }

  If (s.status === "rejected") {
    Visual.innerHTML = FLOW_VISUAL.failed;
    TitleEl.textContent = t("flow_rejected_title");
    TitleEl.className = "text-[19px] font-bold mb-1 text-red-400";
    SubEl.textContent = s.admin_comment || t("flow_rejected_sub");
    ActionEl.innerHTML = "";
    ButtonsEl.innerHTML =
      '<button onclick="flowBuyMore()" class="w-full py-3.5 rounded-2xl btn-primary press font-semibold text-white text-sm mb-2.5">' + t("order_success_more") + '</button>' +
      '<button onclick="flowWriteOperator()" class="w-full py-3.5 rounded-2xl pill press font-semibold text-sm">' + t("flow_write_operator") + '</button>';
    Return;
  }

  TitleEl.className = "text-[19px] font-bold mb-1";

  If (s.status === "awaiting_payment") {
    Visual.innerHTML = FLOW_VISUAL.waiting;
    TitleEl.textContent = t("flow_awaiting_title");
    SubEl.textContent = t("flow_awaiting_sub");
    // Точная сумма к переводу + предупреждение про комиссию банка: если банк
    // удержит её из перевода, на карту придёт меньше и автоподтверждение не
    // сработает — человек должен узнать об этом ДО оплаты, а не после.
    // Блок с точной суммой показываем ВСЕГДА, даже если она совпала с ценой:
    // человек должен видеть, сколько именно перевести, и предупреждение про
    // комиссию банка. Раньше блок появлялся только при уникальной сумме — и
    // без неё предупреждения не было вообще.
    Const exact = s.pay_amount
      ? '<div class="rounded-2xl p-3 mb-3 text-left" style="background: rgba(217,180,91,0.10); border: 1px solid rgba(217,180,91,0.35);">' +
          '<div class="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">' + t("flow_pay_exact") + '</div>' +
          '<div class="text-[19px] font-black text-neon-yellow leading-none mb-2">' + fmtUZS(s.pay_amount) + '</div>' +
          '<div class="text-[11px] text-gray-300 leading-snug">⚠️ ' + t("flow_commission_note") + '</div>' +
        '</div>'
      : "";
    ActionEl.innerHTML =
      '<div class="glass-card rounded-2xl p-3.5 mb-3 text-left">' +
        '<div class="text-[9px] text-gray-500 mb-0.5">' + t("modal_card_label") + '</div>' +
        '<div class="text-[15px] font-mono font-bold text-white tracking-wider mb-1.5">' + (s.card_number || "—") + '</div>' +
        '<div class="flex justify-between items-end">' +
          '<div><div class="text-[9px] text-gray-500">' + t("modal_card_holder_label") + '</div>' +
          '<div class="text-[11px]">' + (s.card_holder || "—") + '</div></div>' +
          '<button onclick="copyActiveCard(\'' + (s.card_number || "") + '\')" class="press bg-neon-blue/15 text-neon-blue px-3 py-1.5 rounded-lg text-[10px] font-semibold">' + t("modal_copy") + '</button>' +
        '</div>' +
      '</div>' +
      exact +
      '<input type="file" id="flow-receipt-input" accept="image/*" class="hidden" onchange="flowSubmitReceipt()" />' +
      '<button onclick="document.getElementById(\'flow-receipt-input\').click()" id="flow-receipt-btn" class="press w-full py-3.5 rounded-2xl btn-primary font-semibold text-white text-sm">📎 ' + t("ao_pay_upload") + '</button>' +
      '<p id="flow-receipt-error" class="hidden text-red-400 text-[11px] mt-2"></p>';
    ButtonsEl.innerHTML =
      '<button onclick="flowCancelOrder()" class="w-full py-3 rounded-2xl pill press text-[12px] text-gray-400 mb-2">' + t("ao_cancel") + '</button>' +
      '<button onclick="closeOrderFlow()" class="w-full py-3 text-gray-400 text-xs">' + t("flow_minimize") + '</button>';
    Return;
  }

  If (s.status === "payment_review") {
    Visual.innerHTML = FLOW_VISUAL.spinner("🔍");
    TitleEl.textContent = t("flow_review_title");
    SubEl.textContent = t("flow_review_sub");
    ActionEl.innerHTML = "";
    // Чек отправлен, но оплату ещё не подтвердили — заказ всё ещё можно
    // отменить самому: денег у продавца пока нет.
    ButtonsEl.innerHTML =
      '<button onclick="flowCancelOrder(false)" class="w-full py-3 rounded-2xl pill press text-[12px] text-gray-400 mb-2">' + t("ao_cancel") + '</button>' +
      '<button onclick="closeOrderFlow()" class="w-full py-3 text-gray-400 text-xs">' + t("flow_minimize") + '</button>';
    Return;
  }

  // paid / fulfilling — «выполняется»: анимация + сменяющиеся пояснения,
  // чтобы ожидание не выглядело как зависший экран
  Visual.innerHTML = FLOW_VISUAL.spinner("⚙️");
  TitleEl.textContent = t("flow_doing_title");
  SubEl.textContent = t("flow_doing_sub");

  Const linkBlock = s.needs_rent_link
    ? '<div class="glass-card rounded-2xl p-3.5 text-left mb-3">' +
        '<div class="text-[12px] font-semibold text-white mb-1">🔗 ' + t("ao_link_title") + '</div>' +
        '<div class="text-[11px] text-gray-400 mb-2.5 leading-snug">' + t("ao_link_hint") + '</div>' +
        '<input id="rent-link-input" type="text" placeholder="tc://..." class="w-full bg-white/[0.04] border border-white/[0.09] rounded-xl px-3 py-2.5 text-[11px] text-white focus:outline-none focus:border-neon-blue/60 mb-2" />' +
        '<p id="rent-link-error" class="hidden text-red-400 text-[11px] mb-2"></p>' +
        '<button onclick="submitRentLink()" id="rent-link-btn" class="press w-full py-3 rounded-xl btn-primary font-semibold text-white text-[13px]">' + t("ao_link_send") + '</button>' +
        // Видео-инструкция лежит в чате бота и к этому моменту уже уехала
        // вверх за другими сообщениями. Кнопка присылает её заново и
        // закрывает витрину — человек сразу попадает на свежее видео.
        '<button onclick="watchRentTutorial(this)" class="press w-full py-2.5 mt-2 rounded-xl pill text-[11px] font-medium text-neon-blue">🎥 ' + t("ao_watch_tutorial") + '</button>' +
      '</div>'
    : "";

  ActionEl.innerHTML =
    LinkBlock +
    '<div class="glass-card rounded-2xl p-3 flex items-center gap-2.5 text-left">' +
      '<span class="w-4 h-4 border-2 border-white/20 border-t-neon-blue rounded-full flex-shrink-0" style="animation: spin .8s linear infinite;"></span>' +
      '<span id="flow-tip" class="text-[11.5px] text-gray-300 transition-opacity duration-300"></span>' +
    '</div>';
  // Заказ оплачен и выполняется. Сам клиент его закрыть не может, но должен
  // иметь выход, если что-то пошло не так — кнопка отправляет просьбу
  // продавцу. Раньше здесь была только «свернуть», и зависший заказ
  // оставалось только терпеть.
  ButtonsEl.innerHTML =
    '<button onclick="flowCancelOrder(true)" class="w-full py-3 rounded-2xl pill press text-[12px] text-gray-400 mb-2">' + t("ao_cancel_request") + '</button>' +
    '<button onclick="closeOrderFlow()" class="w-full py-3 text-gray-400 text-xs">' + t("flow_minimize") + '</button>';

  Const tips = t("flow_tips") || [];
  Const tipEl = document.getElementById("flow-tip");
  Let tipIndex = 0;
  function paintTip() {
    If (!tipEl || !tips.length) return;
    TipEl.style.opacity = 0;
    SetTimeout(function() {
      TipEl.textContent = tips[tipIndex % tips.length];
      TipEl.style.opacity = 1;
      TipIndex++;
    }, 250);
  }
  PaintTip();
  FlowTipTimer = setInterval(paintTip, 3000);
}

/**
 * Сжимает фото чека перед отправкой.
 *
 * Зачем: фото с телефона весит 3-6 МБ, а в base64 — ещё на треть больше.
 * Такой запрос и по мобильному интернету идёт долго, и упирается в лимиты
 * сервера (именно на этом чеки и обрывались с "bad request body"). Для чтения
 * суммы на чеке хватает картинки в 1600px и JPEG-качества 0.8 — это обычно
 * 200-400 КБ, то есть в 10-20 раз меньше.
 *
 * Если браузер по какой-то причине не смог перерисовать картинку (редкий
 * формат, нет памяти) — возвращаем null, и файл уйдёт как есть.
 */
function compressReceipt(file, maxSide, quality) {
  Return new Promise(function(resolve) {
    Let url;
    Try { url = URL.createObjectURL(file); } catch (e) { resolve(null); return; }

    Const img = new Image();
    Img.onload = function() {
      Try {
        Const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        Const w = Math.max(1, Math.round(img.width * scale));
        Const h = Math.max(1, Math.round(img.height * scale));
        Const canvas = document.createElement("canvas");
        Canvas.width = w; canvas.height = h;
        Canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        Const dataUrl = canvas.toDataURL("image/jpeg", quality);
        URL.revokeObjectURL(url);
        Resolve(dataUrl.indexOf(",") > 0 ? dataUrl.split(",")[1] : null);
      } catch (e) {
        URL.revokeObjectURL(url);
        Resolve(null);
      }
    };
    Img.onerror = function() { URL.revokeObjectURL(url); resolve(null); };
    Img.src = url;
  });
}

/** Читает файл как base64 без сжатия — запасной путь. */
function readFileBase64(file) {
  Return new Promise(function(resolve, reject) {
    Const r = new FileReader();
    R.onload = function() { resolve(String(r.result).split(",")[1]); };
    R.onerror = reject;
    R.readAsDataURL(file);
  });
}

/** Готовит чек к отправке: сначала пробуем сжать, иначе — как есть. */
async function receiptToBase64(file) {
  Const compressed = await compressReceipt(file, 1600, 0.8);
  If (compressed) return compressed;
  Return await readFileBase64(file);
}

async function flowSubmitReceipt() {
  Const input = document.getElementById("flow-receipt-input");
  Const btn = document.getElementById("flow-receipt-btn");
  Const errorEl = document.getElementById("flow-receipt-error");
  If (!input || !input.files || !input.files[0] || !flowStatus) return;

  Const file = input.files[0];
  ErrorEl.classList.add("hidden");
  If (file.size > 25 * 1024 * 1024) {
    ErrorEl.textContent = t("ao_err_too_big"); errorEl.classList.remove("hidden"); return;
  }

  Const base = await getShopApiUrl();
  Const initData = await waitForInitData();
  If (!base || !initData) return;

  Const prev = btn.innerHTML;
  Btn.disabled = true;
  Btn.innerHTML = '<span class="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full align-middle" style="animation: spin .7s linear infinite;"></span>';

  Try {
    Const base64 = await receiptToBase64(file);
    Const res = await fetch(base + "/public/submit_receipt", {
      Method: "POST", headers: { "Content-Type": "application/json" },
      Body: JSON.stringify({ initData: initData, order_id: flowStatus.order_id, image_base64: base64 }),
    });
    Const data = await res.json();
    If (data.ok) {
      If (tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred("success");
      PollOrderFlow(); // сразу перерисуем экран в «проверяем оплату»
      StartFlowPolling();
    } else {
      Const reasons = {
        Wrong_status: t("ao_err_wrong_status"), too_big: t("ao_err_too_big"),
        No_image: t("ao_err_no_image"), bad_image: t("ao_err_no_image"), not_found: t("ao_err_not_found"),
      };
      ErrorEl.textContent = reasons[data.error] || (t("ao_err_receipt") + " (" + (data.error || res.status) + ")");
      ErrorEl.classList.remove("hidden");
    }
  } catch (e) {
    ErrorEl.textContent = t("ao_err_network"); errorEl.classList.remove("hidden");
  } finally {
    Btn.disabled = false;
    Btn.innerHTML = prev;
    Input.value = "";
  }
}

function flowCancelOrder(isRequest) {
  If (!flowStatus) return;
  AskConfirm(
    T(isRequest ? "ao_cancel_request_confirm" : "ao_cancel_confirm"),
    async function() {
      Const base = await getShopApiUrl();
      Const initData = await waitForInitData();
      If (!base || !initData) return;
      Try {
        Const res = await fetch(base + "/public/cancel_order", {
          Method: "POST", headers: { "Content-Type": "application/json" },
          Body: JSON.stringify({ initData: initData, order_id: flowStatus.order_id }),
        });
        Const data = await res.json().catch(function() { return {}; });
        If (data && data.requested) {
          If (tg && tg.showAlert) tg.showAlert(t("ao_cancel_requested"));
          Else alert(t("ao_cancel_requested"));
        }
      } catch (e) { /* молча — статус всё равно перечитаем ниже */ }
      PollOrderFlow();
    }
  );
}

function flowWriteOperator() {
  CloseOrderFlow();
  SwitchTab("profil");
}

function flowGoTarix() {
  CloseOrderFlow();
  SwitchTab("tarix");
}

function flowBuyMore() {
  CloseOrderFlow();
  SwitchTab("asosiy");
}

/* ---------------- Профиль / рефералка / условия аренды ---------------- */
async function initProfile() {
  // БАГ БЫЛ ЗДЕСЬ: ждали именно подписанную initData (нужна только для
  // /public/my_orders и /public/my_stats), а initDataUnsafe.user — отдельные,
  // неподписанные данные, которые обычно готовы раньше. Из-за завязки на
  // не тот таймер имя/аватар иногда так и оставались плейсхолдером "—",
  // даже когда сам Telegram уже готов был отдать данные пользователя.
  Const u = await waitForUnsafeUser();
  If (!u) {
    // После ожидания юзера всё ещё нет — редкий случай (например, открыли
    // не из настоящего Telegram-клиента). Тихо оставляем плейсхолдер.
    Return;
  }
  Document.getElementById("profile-name").textContent = u.first_name || "Mijoz";
  Document.getElementById("profile-username").textContent = u.username ? "@" + u.username : "";
  Document.getElementById("profile-id").textContent = "ID: " + u.id;
  Document.getElementById("profile-avatar").textContent = (u.first_name ? u.first_name.charAt(0) : "?").toUpperCase();
}

/* ---------------- API бота-магазина (Tarix/TOP/Profil) ---------------- */
Let shopApiUrl = null;
async function getShopApiUrl() {
  If (shopApiUrl !== null) return shopApiUrl;
  Try {
    Const res = await fetch("/api/config");
    Const data = await res.json();
    ShopApiUrl = data.shop_api_url || "";
  } catch (e) {
    ShopApiUrl = "";
  }
  Return shopApiUrl;
}

Const CATEGORY_EMOJI = { stars: "\u2b50", premium: "\ud83d\udc8e", simple_gift: "\ud83c\udf81", nft_rent: "\ud83d\uddbc" };
Const STATUS_KEY = {
  Awaiting_payment: "status_awaiting_payment", payment_review: "status_payment_review",
  Paid: "status_paid", fulfilling: "status_fulfilling", completed: "status_completed", rejected: "status_rejected",
};

function formatOrderDate(sqlDate) {
  If (!sqlDate) return "";
  // формат из sqlite: "YYYY-MM-DD HH:MM:SS" (UTC) — просто показываем как есть, без пересчёта пояса
  Return sqlDate.replace("T", " ").slice(0, 16);
}

async function renderHistory() {
  Const listEl = document.getElementById("tarix-list");
  Const base = await getShopApiUrl();
  Const initData = await waitForInitData();
  If (!base || !initData) {
    ListEl.innerHTML =
      '<div class="glass-card rounded-[22px] p-6 text-center text-gray-400">' +
      '<p class="text-3xl mb-2">\ud83d\uded2</p><p class="text-sm">' + t("history_open_bot") + '</p></div>';
    Return;
  }
  ListEl.innerHTML = '<div class="text-center text-xs text-gray-500 py-6">' + t("history_loading") + '</div>';

  Try {
    Const res = await fetch(base + "/public/my_orders", {
      Method: "POST", headers: { "Content-Type": "application/json" },
      Body: JSON.stringify({ initData: initData }),
    });
    Const data = await res.json();
    Const orders = data.orders || [];

    If (!orders.length) {
      ListEl.innerHTML =
        '<div class="glass-card rounded-[22px] p-6 text-center text-gray-400">' +
        '<p class="text-3xl mb-2">\ud83d\uded2</p><p class="text-sm">' + t("history_empty") + '</p></div>';
      Return;
    }

    ListEl.innerHTML = orders.map(function(o) {
      Const emoji = CATEGORY_EMOJI[o.category] || "\ud83d\udce6";
      Const statusLabel = t(STATUS_KEY[o.status] || o.status);
      Const statusColor = (o.status === "completed") ? "text-green-400" : (o.status === "rejected") ? "text-red-400" : "text-gray-400";
      Return '<div class="glass-card rounded-2xl p-3.5 flex items-center justify-between gap-2">' +
        '<div class="flex items-center gap-2.5 min-w-0">' +
          '<span class="text-xl flex-shrink-0">' + emoji + '</span>' +
          '<div class="min-w-0">' +
            '<div class="text-xs font-semibold text-white truncate">' + o.item_name + '</div>' +
            '<div class="text-[10px] ' + statusColor + '">' + statusLabel + ' \u00b7 ' + formatOrderDate(o.created_at) + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="text-xs font-bold text-neon-blue flex-shrink-0">' + fmtUZS(o.price_uzs) + '</div>' +
      '</div>';
    }).join("");
  } catch (e) {
    ListEl.innerHTML =
      '<div class="glass-card rounded-[22px] p-6 text-center text-gray-400">' +
      '<p class="text-sm">' + t("history_empty") + '</p></div>';
  }
}

Let currentTopPeriod = "all";
function setTopPeriod(period) {
  CurrentTopPeriod = period;
  ["today","week","month","all"].forEach(function(p) {
    Const btn = document.getElementById("top-period-" + p);
    If (!btn) return;
    Btn.className = p === period
      ? "press px-3.5 py-2 rounded-full pill-gold text-[11px] font-semibold whitespace-nowrap"
      : "press px-3.5 py-2 rounded-full pill text-[11px] whitespace-nowrap";
  });
  RenderLeaderboard(period);
}

/** Небольшой салют вокруг короны 1-го места в рейтинге — чисто декоративно. */
/**
 * Салют с двух сторон подиума — летит от левого и правого края навстречу
 * центру (как на награждении), а не просто разлетается вокруг короны.
 */
function launchConfetti() {
  Const colors = ["#D9B45B", "#2AABEE", "#8E8CD8", "#5AC8FA", "#F0DFA0"];

  Function burst(boxId, dirX) {
    Const box = document.getElementById(boxId);
    If (!box) return;
    Let html = "";
    For (let i = 0; i < 14; i++) {
      // dirX задаёт общее направление (влево/вправо), с разбросом по вертикали
      Const spread = (Math.random() - 0.5) * 70;
      Const dist = 60 + Math.random() * 50;
      Const tx = Math.round(dirX * dist);
      Const ty = Math.round(spread - 30 - Math.random() * 20);
      Const rot = Math.round((Math.random() - 0.5) * 520);
      Const color = colors[i % colors.length];
      Const delay = Math.round(Math.random() * 140);
      Html += '<span class="confetti-piece" style="--tx:' + tx + 'px; --ty:' + ty + 'px; --rot:' + rot + 'deg; background:' + color + '; animation-delay:' + delay + 'ms;"></span>';
    }
    Box.innerHTML = html;
  }

  Burst("podium-confetti-left", 1); // летит вправо, к центру
  Burst("podium-confetti-right", -1); // летит влево, к центру
}

async function renderLeaderboard(period) {
  Const listEl = document.getElementById("top-list");
  Const base = await getShopApiUrl();
  If (!base) {
    ListEl.innerHTML =
      '<div class="glass-card rounded-[22px] p-6 text-center text-gray-400">' +
      '<p class="text-3xl mb-2">\ud83c\udfc6</p><p class="text-sm font-semibold text-white mb-1">' + t("top_forming") + '</p>' +
      '<p class="text-xs">' + t("top_hint") + '</p></div>';
    Return;
  }
  ListEl.innerHTML = '<div class="text-center text-xs text-gray-500 py-6">' + t("history_loading") + '</div>';

  Const myUser = await waitForUnsafeUser();
  Const myId = myUser ? myUser.id : null;

  Try {
    Const res = await fetch(base + "/public/leaderboard?period=" + period);
    Const data = await res.json();
    Const rows = data.leaderboard || [];

    If (!rows.length) {
      ListEl.innerHTML =
        '<div class="glass-card rounded-[22px] p-6 text-center text-gray-400">' +
        '<p class="text-3xl mb-2">\ud83c\udfc6</p><p class="text-sm font-semibold text-white mb-1">' + t("top_forming") + '</p>' +
        '<p class="text-xs">' + t("top_hint") + '</p></div>';
      Return;
    }

    Const initials = function(name) { return (name || "?").trim().charAt(0).toUpperCase(); };

    Function personName(r) {
      Return r.full_name || (r.username ? "@" + r.username : "ID " + r.user_id);
    }

    // Подиум для топ-3: 2 место слева, 1 (приподнятое, с короной) в центре,
    // 3 справа — у каждого места свой цвет авы под цвет медали, не одинаковый
    // градиент для всех, плюс плавное появление при заходе на вкладку.
    Let podiumHtml = "";
    If (rows.length >= 1) {
      Const order = [1, 0, 2].filter(function(i) { return rows[i]; }); // 2-1-3 визуально
      Const AVATAR_BG = {
        0: "background: radial-gradient(circle at 30% 25%, #F3D98A, #D9A93B 70%);",
        1: "background: radial-gradient(circle at 30% 25%, #D7DCE2, #9AA3AD 70%);",
        2: "background: radial-gradient(circle at 30% 25%, #E3A567, #B5713A 70%);",
      };
      Const RING = {
        0: "ring-2 ring-neon-yellow", 1: "ring-2 ring-gray-300/70", 2: "ring-2 ring-amber-700/60",
      };
      Const GLOW = { 0: "0 0 26px -2px rgba(217,180,91,0.65)", 1: "0 0 16px -4px rgba(200,205,212,0.4)", 2: "0 0 16px -4px rgba(181,113,58,0.4)" };
      Const SIZE = { 0: "w-[72px] h-[72px] text-2xl -mt-9", 1: "w-14 h-14 text-lg -mt-7", 2: "w-14 h-14 text-lg -mt-7" };
      // Настоящие блоки пьедестала — разной высоты (1 место выше всех),
      // с крупным номером, как на олимпийском подиуме.
      Const BLOCK_H = { 0: "h-24", 1: "h-16", 2: "h-12" };
      Const BLOCK_BG = {
        0: "background: linear-gradient(180deg, #F3D98A 0%, #C99A3E 100%);",
        1: "background: linear-gradient(180deg, #E3E7EC 0%, #9AA3AD 100%);",
        2: "background: linear-gradient(180deg, #E3A567 0%, #A9713C 100%);",
      };
      Const BLOCK_NUM_COLOR = { 0: "#6b4e11", 1: "#4a5058", 2: "#5c3a17" };
      PodiumHtml =
        '<div class="relative overlay-enter">' +
          '<div id="podium-confetti-left" class="absolute left-2 top-8 w-0 h-0"></div>' +
          '<div id="podium-confetti-right" class="absolute right-2 top-8 w-0 h-0"></div>' +
          '<div class="flex items-end justify-center gap-2.5 pt-1 pb-2">' +
          order.map(function(i, idx) {
            Const r = rows[i];
            Const name = personName(r);
            Const isMe = myId && r.user_id === myId;
            Return '<div class="flex flex-col items-center w-[92px]" style="animation: sheetUp .4s cubic-bezier(.2,.9,.25,1) both; animation-delay:' + (idx * 70) + 'ms;">' +
              (i === 0 ? '<div class="text-2xl mb-1" style="animation: float 2.4s ease-in-out infinite;">👑</div>' : '<div class="h-8"></div>') +
              '<div class="relative z-10">' +
                '<div class="' + SIZE[i] + ' rounded-full ' + RING[i] + ' flex items-center justify-center font-bold text-white' + (isMe ? " outline outline-2 outline-neon-blue outline-offset-2" : "") + '" style="' + AVATAR_BG[i] + ' box-shadow:' + GLOW[i] + ';">' + initials(name) + '</div>' +
              '</div>' +
              '<div class="text-[11.5px] font-semibold text-white mt-2 max-w-[90px] truncate text-center px-1">' + name + '</div>' +
              '<div class="text-[11px] font-bold text-neon-yellow mb-2">' + fmtUZS(r.total_uzs) + '</div>' +
              '<div class="w-full ' + BLOCK_H[i] + ' rounded-t-xl flex items-start justify-center pt-1.5 shadow-[0_-2px_10px_rgba(0,0,0,0.25)]" style="' + BLOCK_BG[i] + '">' +
                '<span class="text-2xl font-black" style="color:' + BLOCK_NUM_COLOR[i] + '">' + (i + 1) + '</span>' +
              '</div>' +
            '</div>';
          }).join("") +
          '</div>' +
        '</div>';
    }

    Const restHtml = rows.slice(3).map(function(r, idx) {
      Const i = idx + 3;
      Const name = personName(r);
      Const isMe = myId && r.user_id === myId;
      Return '<div class="press flex items-center justify-between gap-2 rounded-2xl p-3.5 ' +
        (isMe ? "bg-neon-blue/10 border border-neon-blue/40" : "glass-card") + '">' +
        '<div class="flex items-center gap-3 min-w-0">' +
          '<span class="text-[11px] font-bold text-gray-500 w-6 h-6 rounded-full bg-white/[0.06] flex items-center justify-center flex-shrink-0">' + (i + 1) + '</span>' +
          '<div class="min-w-0">' +
            '<div class="text-xs font-semibold text-white truncate">' + name + (isMe ? ' \u00b7 <span class="text-neon-blue">' + t("top_you") + '</span>' : '') + '</div>' +
            '<div class="text-[10px] text-gray-400">' + r.orders_count + ' ' + t("top_orders_suffix") + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="text-xs font-bold text-neon-yellow flex-shrink-0">' + fmtUZS(r.total_uzs) + '</div>' +
      '</div>';
    }).join("");

    ListEl.innerHTML = podiumHtml + '<div class="space-y-2">' + restHtml + '</div>';
    LaunchConfetti();
  } catch (e) {
    ListEl.innerHTML = '<div class="text-center text-xs text-gray-500 py-6">' + t("top_empty") + '</div>';
  }
}

async function renderProfileStats() {
  Const box = document.getElementById("profile-stats-box");
  Const base = await getShopApiUrl();
  Const initData = await waitForInitData();
  If (!base || !initData) { box.classList.add("hidden"); return; }

  Try {
    Const res = await fetch(base + "/public/my_stats", {
      Method: "POST", headers: { "Content-Type": "application/json" },
      Body: JSON.stringify({ initData: initData }),
    });
    Const stats = await res.json();

    Const catRows = Object.keys(CATEGORY_EMOJI).map(function(cat) {
      Const amount = (stats.by_category || {})[cat] || 0;
      If (!amount) return "";
      Return '<div class="flex justify-between items-center text-xs py-1.5 border-b border-white/5 last:border-0">' +
        '<span class="text-gray-300">' + t("cat_" + cat) + '</span>' +
        '<span class="font-semibold text-white">' + fmtUZS(amount) + '</span></div>';
    }).join("");

    Box.classList.remove("hidden");
    Const hasPurchases = (stats.total_uzs || 0) > 0;
    Box.innerHTML =
      // Крупная сумма как герой блока — раньше "Jami xarid" терялся мелким
      // текстом в строке и выглядел пустым у новых клиентов.
      '<div class="text-center pb-3">' +
        '<div class="text-[10px] text-gray-500 uppercase tracking-wider mb-1">' + t("profile_stats_total") + '</div>' +
        '<div class="text-[26px] font-black text-white leading-none tracking-tight">' + fmtUZS(stats.total_uzs || 0) + '</div>' +
        (stats.rank
          ? '<div class="inline-flex items-center gap-1.5 mt-2.5 pill-gold px-3 py-1 rounded-full text-[10px] font-bold">' +
              '<span>🏆</span><span>' + t("profile_stats_rank") + ' #' + stats.rank + '</span>' +
            '</div>'
          : '<div class="text-[11px] text-gray-500 mt-2">' + t("profile_no_purchases") + '</div>') +
      '</div>' +
      (hasPurchases ? '<div class="pt-3 border-t border-white/[0.08] space-y-0.5">' + catRows + '</div>' : '');
  } catch (e) {
    Box.classList.add("hidden");
  }
}

async function renderRentTerms() {
  Try {
    Const res = await fetch("/api/rent_terms");
    Const d = await res.json();
    Document.getElementById("rent-terms-text").textContent = t("rent_terms")(fmtUZS(d.fee_uzs), fmtUZS(d.refund_uzs));
  } catch (e) { /* тихо игнорируем */ }
}

/* ---------------- Init ---------------- */
/**
 * Тихая диагностика — НЕ показывается пользователю (это была ошибка в
 * прошлый раз с текстом "DEBUG: ..."). Просто один раз отправляет на сервер
 * реальную картину того, что видит этот конкретный телефон: есть ли вообще
 * window.Telegram.WebApp, дождались ли initData/initDataUnsafe.user, сколько
 * это заняло, какая платформа/версия Telegram. Смотрится потом в логах
 * Railway — так можно найти причину точно, а не гадать по скриншотам.
 */
async function sendDiag() {
  Const base = await getShopApiUrl();
  If (!base) return;
  Const t0 = Date.now();
  Const initData = await waitForInitData();
  Const user = await waitForUnsafeUser();
  Try {
    Await fetch(base + "/public/_diag", {
      Method: "POST", headers: { "Content-Type": "application/json" },
      Body: JSON.stringify({
        Tg_exists: !!tg,
        Platform: tg ? tg.platform : null,
        Version: tg ? tg.version : null,
        InitData_len: initData ? initData.length : 0,
        Unsafe_user_exists: !!user,
        Unsafe_user_id: user ? user.id : null,
        Wait_ms: Date.now() - t0,
        Ua: navigator.userAgent,
      }),
    });
  } catch (e) { /* тихо игнорируем — это диагностика, не критично */ }
}

ApplyI18n();
InitProfile();
InitSupportInfo();
InitLiveFeed();
SendDiag();
// Аренды тянем на старте, а не только при заходе на вкладку: если срок
// заканчивается сегодня, человек должен увидеть это сразу.
RenderMyRentals();

/* ---------------- Живая лента заказов ---------------- */
function timeAgoLabel(ts) {
  Const diffMin = Math.max(1, Math.round((Date.now() / 1000 - ts) / 60));
  If (diffMin < 60) return diffMin + " " + t("minutes_ago");
  Const diffH = Math.round(diffMin / 60);
  Return diffH + " " + t("hours_ago");
}

async function initLiveFeed() {
  Let items = [];
  Try {
    Const res = await fetch("/api/live_feed");
    Items = await res.json();
  } catch (e) { return; }

  If (!items.length) return;

  Const bar = document.getElementById("live-feed-bar");
  Const textEl = document.getElementById("live-feed-text");
  Bar.classList.remove("hidden");

  Let i = 0;
  function paint() {
    Const it = items[i % items.length];
    TextEl.style.opacity = 0;
    SetTimeout(function() {
      TextEl.textContent = it.emoji + " " + it.label + " · " + timeAgoLabel(it.ts);
      TextEl.style.opacity = 1;
    }, 250);
    I++;
  }
  Paint();
  SetInterval(paint, 3500);
}

/* ================= Как работает аренда (пошагово) ================= */
function toggleRentHowto() {
  Const box = document.getElementById("rent-howto");
  Const arrow = document.getElementById("howto-arrow");
  Const opening = box.classList.contains("hidden");
  If (opening && !box.innerHTML) {
    Box.innerHTML = (t("howto_steps") || []).map(function(step, i) {
      Return '<div class="glass-card rounded-2xl p-3 flex items-start gap-3" ' +
        'style="animation: sheetUp .3s cubic-bezier(.2,.9,.25,1) both; animation-delay:' + (i * 40) + 'ms;">' +
        '<span class="w-6 h-6 rounded-full bg-neon-blue/15 text-neon-blue text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">' + (i + 1) + '</span>' +
        '<span class="text-[12px] text-gray-300 leading-snug">' + step + '</span>' +
      '</div>';
    }).join("");
  }
  Box.classList.toggle("hidden");
  Arrow.style.transform = opening ? "rotate(180deg)" : "";
}

/* ================= Мои аренды + продление ================= */
Let myRentals = [];

function rentLeftLabel(seconds) {
  If (seconds >= 86400) {
    Const d = Math.floor(seconds / 86400);
    Const h = Math.floor((seconds % 86400) / 3600);
    Return d + " " + t("rent_days_short") + (h ? " " + h + " " + t("rent_hours_short") : "");
  }
  Const h = Math.max(1, Math.floor(seconds / 3600));
  Return h + " " + t("rent_hours_short");
}

async function renderMyRentals() {
  Const box = document.getElementById("my-rentals-box");
  Const listEl = document.getElementById("my-rentals-list");
  If (!box) return;

  Const base = await getShopApiUrl();
  Const initData = await waitForInitData();
  If (!base || !initData) { box.classList.add("hidden"); return; }

  Try {
    Const res = await fetch(base + "/public/my_rentals", {
      Method: "POST", headers: { "Content-Type": "application/json" },
      Body: JSON.stringify({ initData: initData }),
    });
    Const data = await res.json();
    MyRentals = data.rentals || [];
  } catch (e) { box.classList.add("hidden"); return; }

  If (!myRentals.length) { box.classList.add("hidden"); listEl.innerHTML = ""; return; }

  Box.classList.remove("hidden");
  ListEl.innerHTML = myRentals.map(function(r, i) {
    // Меньше суток — подсвечиваем красным: это последний момент продлить,
    // потом подарок просто исчезнет из профиля.
    Const soon = r.seconds_left < 86400;
    Const leftClass = soon ? "text-red-400" : "text-neon-blue";
    Const extendBtn = r.can_extend
      ? '<button data-i="' + i + '" class="rent-extend-btn press pill-gold rounded-xl px-3 py-2 text-[11px] font-bold flex-shrink-0">' + t("rent_extend") + '</button>'
      : "";
    Return '<div class="glass-card rounded-[20px] p-3.5 flex items-center gap-3"' +
      (soon ? ' style="border-color: rgba(248,113,113,0.45);"' : '') + '>' +
      '<div class="min-w-0 flex-1">' +
        '<div class="text-[13px] font-semibold text-white truncate">🖼 ' + r.item_name + '</div>' +
        '<div class="text-[11px] ' + leftClass + ' mt-0.5">' +
          (soon ? "⚠️ " + t("rent_ending_soon") + " · " : "") +
          T("rent_ends_in") + ": " + rentLeftLabel(r.seconds_left) +
        '</div>' +
        (r.price_per_day_uzs
          ? '<div class="text-[10px] text-gray-500 mt-0.5">' + fmtUZS(r.price_per_day_uzs) + ' · 1 ' + t("rent_days_suffix") + '</div>'
          : '') +
      '</div>' +
      ExtendBtn +
    '</div>';
  }).join("");

  Array.prototype.forEach.call(listEl.querySelectorAll(".rent-extend-btn"), function(btn) {
    Btn.addEventListener("click", function() { openExtendModal(myRentals[Number(btn.dataset.i)]); });
  });
}

function openExtendModal(rental) {
  If (!rental) return;
  OpenModal({
    Kind: "nft_rent_extend",
    Title: t("rent_extend_title") + ": " + rental.item_name,
    Price: rental.price_per_day_uzs,
    Emoji: "⏳",
    Raw: rental,
  });
}

/* ================= Активный заказ + ввод ссылки аренды ================= */
Const ORDER_STATUS_KEY = {
  Awaiting_payment: "ao_awaiting_payment",
  Payment_review: "ao_payment_review",
  Paid: "ao_paid",
  Fulfilling: "ao_fulfilling",
};

async function refreshActiveOrder() {
  Const bar = document.getElementById("active-order-bar");
  Const base = await getShopApiUrl();
  Const initData = await waitForInitData();
  If (!base || !initData) { bar.classList.add("hidden"); return; }

  Let active = null;
  Try {
    Const res = await fetch(base + "/public/active_order", {
      Method: "POST", headers: { "Content-Type": "application/json" },
      Body: JSON.stringify({ initData: initData }),
    });
    Const data = await res.json();
    Active = data.active;
  } catch (e) { /* молча — баннер просто не покажем */ }

  If (!active) { bar.classList.add("hidden"); bar.innerHTML = ""; return; }

  Const statusText = t(ORDER_STATUS_KEY[active.status] || "ao_fulfilling");
  Const linkBlock = active.needs_rent_link
    ? '<div class="mt-3 pt-3 border-t border-white/[0.08]">' +
        '<div class="text-[12px] font-semibold text-white mb-1">🔗 ' + t("ao_link_title") + '</div>' +
        '<div class="text-[11px] text-gray-400 mb-2.5 leading-snug">' + t("ao_link_hint") + '</div>' +
        '<input id="rent-link-input" type="text" placeholder="tc://..." class="w-full bg-white/[0.04] border border-white/[0.09] rounded-xl px-3 py-2.5 text-[11px] text-white focus:outline-none focus:border-neon-blue/60 mb-2" />' +
        '<p id="rent-link-error" class="hidden text-red-400 text-[11px] mb-2"></p>' +
        '<button onclick="submitRentLink()" id="rent-link-btn" class="press w-full py-3 rounded-xl btn-primary font-semibold text-white text-[13px] mb-2">' + t("ao_link_send") + '</button>' +
        '<button onclick="watchRentTutorial(this)" class="press w-full py-2.5 rounded-xl pill text-[11px] font-medium text-neon-blue mb-2">🎥 ' + t("ao_watch_tutorial") + '</button>' +
        '<button onclick="openBotForTutorial()" class="press w-full py-2.5 rounded-xl pill text-[11px] font-medium">🎥 ' + t("ao_watch_tutorial") + '</button>' +
      '</div>'
    : "";

  // Оплата прямо в витрине: карта + загрузка чека, без ухода в чат бота
  Const payBlock = active.needs_payment
    ? '<div class="mt-3 pt-3 border-t border-white/[0.08]">' +
        '<div class="text-[12px] font-semibold text-white mb-2">💳 ' + t("ao_pay_title") + '</div>' +
        '<div class="glass-card rounded-xl p-3 mb-2.5">' +
          '<div class="text-[9px] text-gray-500 mb-0.5">' + t("modal_card_label") + '</div>' +
          '<div class="text-[14px] font-mono font-bold text-white tracking-wider mb-1.5">' + (active.card_number || "—") + '</div>' +
          '<div class="flex justify-between items-end">' +
            '<div><div class="text-[9px] text-gray-500">' + t("modal_card_holder_label") + '</div>' +
            '<div class="text-[11px]">' + (active.card_holder || "—") + '</div></div>' +
            '<button onclick="copyActiveCard(\'' + (active.card_number || "") + '\')" class="press bg-neon-blue/15 text-neon-blue px-3 py-1.5 rounded-lg text-[10px] font-semibold">' + t("modal_copy") + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="text-[11px] text-gray-400 mb-2 leading-snug">' + t("ao_pay_hint") + '</div>' +
        '<input type="file" id="receipt-input" accept="image/*" class="hidden" onchange="submitReceipt(' + active.id + ')" />' +
        '<button onclick="document.getElementById(\'receipt-input\').click()" id="receipt-btn" class="press w-full py-3 rounded-xl btn-primary font-semibold text-white text-[13px]">📎 ' + t("ao_pay_upload") + '</button>' +
        '<p id="receipt-error" class="hidden text-red-400 text-[11px] mt-2"></p>' +
      '</div>'
    : "";

  // Кнопка отмены есть на ЛЮБОМ незавершённом заказе, а не только на
  // неоплаченном. До оплаты она отменяет заказ сразу, после оплаты —
  // отправляет продавцу просьбу отменить (сам клиент оплаченный заказ
  // закрыть не может). Без неё зависший заказ нечем было убрать с экрана.
  Const canCancelNow = active.status === "awaiting_payment" || active.status === "payment_review";
  Const canAskCancel = active.status === "paid" || active.status === "fulfilling";
  Const cancelBtn = (canCancelNow || canAskCancel)
    ? '<button onclick="cancelActiveOrder(' + active.id + ', ' + (canAskCancel ? "true" : "false") + ')" class="press mt-3 w-full py-2.5 rounded-xl pill text-[11px] font-medium text-gray-400">' + t(canAskCancel ? "ao_cancel_request" : "ao_cancel") + '</button>'
    : "";

  // Заказ из корзины — показываем все товары списком, иначе человек видел бы
  // только один товар из нескольких и не понял бы, за что общая сумма.
  Const cartItems = active.cart_items || [];
  Const isCart = cartItems.length > 0;
  Const titleLine = isCart
    ? '🛒 ' + t("cart_active_title") + ' · ' + cartItems.length + ' ' + t("cart_items_suffix")
    : active.item_name;
  Const cartItemsBlock = isCart
    ? '<div class="mt-2 pt-2 border-t border-white/[0.08] space-y-1">' +
        CartItems.map(function(it) {
          Return '<div class="flex justify-between gap-2 text-[11px]">' +
            '<span class="text-gray-300 truncate">' + it.item_name + '</span>' +
            '<span class="text-gray-400 flex-shrink-0">' + fmtUZS(it.price_uzs) + '</span>' +
          '</div>';
        }).join("") +
      '</div>'
    : "";

  Bar.classList.remove("hidden");
  Bar.innerHTML =
    '<div class="glass-card rounded-[20px] p-4 overlay-enter" style="border-color: rgba(42,171,238,0.35);">' +
      // Тап по шапке открывает полноэкранный живой статус заказа — там всё:
      // реквизиты, загрузка чека, "выполняется" и финальная галочка.
      '<div class="flex items-center justify-between gap-2 cursor-pointer" onclick="openOrderFlow({order_id: ' + active.id +
        ', cart_id: ' + (active.cart_id ? "'" + active.cart_id + "'" : "null") + '})">' +
        '<div class="min-w-0">' +
          '<div class="text-[10px] text-neon-blue font-bold uppercase tracking-wider mb-0.5">' + t("ao_title") + (isCart ? "" : " #" + active.id) + '</div>' +
          '<div class="text-[13px] font-semibold text-white truncate">' + titleLine + '</div>' +
          '<div class="text-[11px] text-gray-400 mt-0.5">' + statusText + ' ›</div>' +
        '</div>' +
        '<div class="text-[12px] font-bold text-neon-yellow flex-shrink-0">' + fmtUZS(active.price_uzs) + '</div>' +
      '</div>' +
      CartItemsBlock + payBlock + linkBlock + cancelBtn +
    '</div>';
}

async function cancelActiveOrder(orderId, isRequest) {
  AskConfirm(
    T(isRequest ? "ao_cancel_request_confirm" : "ao_cancel_confirm"),
    function() { doCancelActiveOrder(orderId); }
  );
}

async function doCancelActiveOrder(orderId) {
  Const base = await getShopApiUrl();
  Const initData = await waitForInitData();
  If (!base || !initData) return;
  Try {
    Const res = await fetch(base + "/public/cancel_order", {
      Method: "POST", headers: { "Content-Type": "application/json" },
      Body: JSON.stringify({ initData: initData, order_id: orderId }),
    });
    Const data = await res.json().catch(function() { return {}; });
    // Оплаченный заказ отменяет продавец — клиенту честно говорим, что ушёл
    // запрос, а не что заказ уже отменён (иначе он решит, что всё, и уйдёт).
    If (data && data.requested) {
      If (tg && tg.showAlert) tg.showAlert(t("ao_cancel_requested"));
      Else alert(t("ao_cancel_requested"));
    }
  } catch (e) { /* молча — просто обновим баннер ниже */ }
  RefreshActiveOrder();
}

function copyActiveCard(number) {
  Navigator.clipboard.writeText(number);
  If (tg && tg.showAlert) tg.showAlert(t("copied")); else alert(t("copied"));
}

async function submitReceipt(orderId) {
  Const input = document.getElementById("receipt-input");
  Const btn = document.getElementById("receipt-btn");
  Const errorEl = document.getElementById("receipt-error");
  If (!input || !input.files || !input.files[0]) return;

  Const file = input.files[0];
  ErrorEl.classList.add("hidden");
  If (file.size > 25 * 1024 * 1024) {
    ErrorEl.textContent = t("ao_err_too_big"); errorEl.classList.remove("hidden"); return;
  }

  Const base = await getShopApiUrl();
  Const initData = await waitForInitData();
  If (!base || !initData) return;

  Const prev = btn.innerHTML;
  Btn.disabled = true;
  Btn.innerHTML = '<span class="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full align-middle" style="animation: spin .7s linear infinite;"></span>';

  Try {
    Const base64 = await receiptToBase64(file);
    Const res = await fetch(base + "/public/submit_receipt", {
      Method: "POST", headers: { "Content-Type": "application/json" },
      Body: JSON.stringify({ initData: initData, order_id: orderId, image_base64: base64 }),
    });
    Const data = await res.json();
    If (data.ok) {
      If (tg && tg.showAlert) tg.showAlert(t("ao_receipt_sent")); else alert(t("ao_receipt_sent"));
      RefreshActiveOrder();
    } else {
      // Показываем конкретную причину, а не общее "не удалось" —
      // иначе непонятно, что именно исправлять.
      Const reasons = {
        Wrong_status: t("ao_err_wrong_status"),
        Too_big: t("ao_err_too_big"),
        No_image: t("ao_err_no_image"),
        Bad_image: t("ao_err_no_image"),
        Not_found: t("ao_err_not_found"),
      };
      ErrorEl.textContent = reasons[data.error] || (t("ao_err_receipt") + " (" + (data.error || res.status) + ")");
      ErrorEl.classList.remove("hidden");
    }
  } catch (e) {
    ErrorEl.textContent = t("ao_err_network"); errorEl.classList.remove("hidden");
  } finally {
    Btn.disabled = false;
    Btn.innerHTML = prev;
    Input.value = "";
  }
}

function openBotForTutorial() {
  // Открываем чат с ботом, где уже лежит видео-инструкция.
  If (tg && tg.close) tg.close();
}

/**
 * Показать видео-инструкцию «как получить ссылку для аренды».
 *
 * Видео приходит в чат бота, а ссылку человек вводит здесь, в витрине. К
 * моменту, когда инструкция понадобилась, она уже уехала вверх по переписке —
 * искать её там неудобно. Поэтому кнопка просит бота прислать видео заново и
 * закрывает витрину: человек оказывается в чате прямо на свежем сообщении.
 */
async function watchRentTutorial(btn) {
  Const prev = btn ? btn.innerHTML : null;
  If (btn) { btn.disabled = true; btn.innerHTML = "⏳"; }
  Try {
    Const base = await getShopApiUrl();
    Const initData = await waitForInitData();
    If (!base || !initData) return;

    Const res = await fetch(base + "/public/send_rent_tutorial", {
      Method: "POST", headers: { "Content-Type": "application/json" },
      Body: JSON.stringify({ initData: initData }),
    });
    Const data = await res.json().catch(function() { return {}; });
    If (!data.ok) {
      ShowToast(t("ao_err_network"));
      Return;
    }
    If (tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred("success");
    // Закрываем витрину — она открыта поверх чата с ботом, и человек
    // оказывается ровно там, куда только что пришло видео.
    If (tg && tg.close) tg.close();
  } catch (e) {
    ShowToast(t("ao_err_network"));
  } finally {
    If (btn && prev !== null) { btn.disabled = false; btn.innerHTML = prev; }
  }
}

async function submitRentLink() {
  Const input = document.getElementById("rent-link-input");
  Const errorEl = document.getElementById("rent-link-error");
  Const btn = document.getElementById("rent-link-btn");
  If (!input) return;

  Const link = input.value.trim();
  ErrorEl.classList.add("hidden");
  If (!link) { errorEl.textContent = t("ao_err_empty"); errorEl.classList.remove("hidden"); return; }

  Const base = await getShopApiUrl();
  Const initData = await waitForInitData();
  If (!base || !initData) return;

  Const prev = btn.innerHTML;
  Btn.disabled = true;
  Btn.innerHTML = '<span class="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full align-middle" style="animation: spin .7s linear infinite;"></span>';

  Try {
    Const res = await fetch(base + "/public/submit_rent_link", {
      Method: "POST", headers: { "Content-Type": "application/json" },
      Body: JSON.stringify({ initData: initData, link: link }),
    });
    Const data = await res.json();
    If (data.ok) {
      // Реальный успех от backend, а не таймер. Подарок подключён — показываем
      // это на экране статуса и ждём, пока админ отметит заказ выполненным.
      //
      // data.pending — ссылка принята, но подключить прямо сейчас не вышло:
      // почти всегда продавец ещё не подтвердил перевод за аренду, бот сам
      // дожмёт за несколько минут. Это НЕ ошибка, пугать человека нечем —
      // он уже всё сделал правильно, ссылка сохранена.
      If (tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred("success");
      ShowToast(t(data.pending ? "ao_connect_pending" : "ao_connected"));
      If (flowOrder) { pollOrderFlow(); startFlowPolling(); }
      Else openOrderFlow({ order_id: data.order_id });
      RefreshActiveOrder();
    } else if (data.error === "bad_link") {
      ErrorEl.textContent = t("ao_err_bad_link"); errorEl.classList.remove("hidden");
    } else {
      ErrorEl.textContent = t("ao_err_connect"); errorEl.classList.remove("hidden");
    }
  } catch (e) {
    ErrorEl.textContent = t("ao_err_network"); errorEl.classList.remove("hidden");
  } finally {
    Btn.disabled = false;
    Btn.innerHTML = prev;
  }
}

RefreshActiveOrder();
