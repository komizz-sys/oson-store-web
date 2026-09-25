const tg = window.Telegram && window.Telegram.WebApp;
if (tg) { tg.expand(); tg.ready(); }

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
  return new Promise(function(resolve) {
    if (tg && tg.initData) { resolve(tg.initData); return; }
    let waited = 0;
    const iv = setInterval(function() {
      waited += stepMs;
      if (tg && tg.initData) { clearInterval(iv); resolve(tg.initData); }
      else if (waited >= maxWaitMs) { clearInterval(iv); resolve(tg && tg.initData ? tg.initData : ""); }
    }, stepMs);
  });
}

/**
 * Отдельное (и обычно куда более быстрое) ожидание именно initDataUnsafe.user —
 * это НЕподписанные данные, для отображения имени/аватарки в Profil подпись
 * не нужна, поэтому не блокируем это той же долгой проверкой, что my_orders/my_stats.
 */
function waitForUnsafeUser(maxWaitMs = 4000, stepMs = 150) {
  return new Promise(function(resolve) {
    const get = function() { return tg && tg.initDataUnsafe && tg.initDataUnsafe.user; };
    if (get()) { resolve(get()); return; }
    let waited = 0;
    const iv = setInterval(function() {
      waited += stepMs;
      const u = get();
      if (u) { clearInterval(iv); resolve(u); }
      else if (waited >= maxWaitMs) { clearInterval(iv); resolve(null); }
    }, stepMs);
  });
}

/* ---------------- i18n ---------------- */
const I18N = {
  uz: {
    ijara_title: "Gift Arendasi", history_title: "Xaridlar tarixi",
    history_empty: "Hozircha xaridlar tarixi bo'sh.", history_hint: "To'liq tarix - botdagi \"Mening buyurtmalarim\" bo'limida.",
    top_people: " · {n} kishi", top_list: "Ro'yxat", top_gifts: "sovg'a", top_rents: "ijara",
    top_me_first: "Siz 1-o'rindasiz 👑", top_me_in: "Siz TOP-8 dasiz 🔥", top_me_place: "#{rank} o'rin",
    top_me_up: "#{next} o'ringa {amount} qoldi", top_me_out: "TOP-8 ga kirish uchun {amount} qoldi",
    top_me_none: "Siz hali reytingda yo'qsiz", top_me_none_hint: "Birinchi xariddan keyin shu yerda paydo bo'lasiz",
    lang_name: "O'zbekcha", pm_lang: "Til", pm_lang_sub: "Tilni tanlang",
    pm_orders: "Mening buyurtmalarim", pm_orders_sub: "Xaridlar tarixi",
    pm_help: "Yordam", pm_help_sub: "Savollar va muammolar",
    pm_channel: "Kanal", pm_channel_sub: "Yangiliklar va aksiyalar",
    pm_reviews: "Buyurtmalar kanali", pm_reviews_sub: "Bajarilgan buyurtmalar",
    pf_spent: "Jami xarid", pf_rank: "Reyting", pf_rank_none: "Hali yo'q",
    rv_title: "Mijozlar fikri", rv_count: "{n} ta sharh", rv_empty: "Hozircha sharhlar yo'q.",
    rate_title: "Buyurtma qanday bo'ldi?", rate_sub: "Baholang — bu boshqa xaridorlarga yordam beradi",
    rate_labels: ["", "Juda yomon", "Yomon", "O'rtacha", "Yaxshi", "Zo'r! 🔥"],
    rate_ph_good: "Izoh (ixtiyoriy)", rate_ph_bad: "Nima yoqmadi? Yozing — albatta ko'rib chiqamiz",
    rate_send: "Yuborish", rate_thanks: "🙏 Rahmat! Sharhingiz qabul qilindi", rate_err: "Yuborib bo'lmadi, qayta urinib ko'ring",
    pc_title: "Premium'ni olish uchun adminga yozing", pc_hint: "Tugmani bosing — xabar tayyor bo'ladi, faqat yuboring.",
    pc_write: "✍️ Adminga yozish", pc_spam: "🚫 Men spamdaman", pc_spam_done: "✅ Adminga xabar berildi — u sizga bot orqali yozadi",
    pc_spam_hint: "Telegram sizga birinchi yozishni cheklagan bo'lsa, shu tugmani bosing.",
    pc_msg: "Assalomu alaykum! {item} Premium uchun pul to'ladim ✅\nBuyurtma #{id}",
    tut_android: "🤖 Android uchun qo'llanma", tut_ios: "🍏 iPhone uchun qo'llanma",
    relink_btn: "🔄 Qayta ulash", relink_title: "Yangi havola", relink_hint: "Fragment'da ulanmadimi? Yangi havola oling va shu yerga joylang. Havolani nusxalagach Fragment sahifasini yopmang.",
    relink_send: "Qayta ulash", relink_ok: "Yangi havola yuborildi — natija botda",
    up_stars: "💎 Telegram Premium ham oling — profilda status belgisi, katta fayllar va boshqa imtiyozlar.",
    up_premium: "🎁 Profilingizni bezang — noyob sovg'alarni ijaraga oling yoki oddiy sovg'a sotib oling.",
    up_simple_gift: "⭐ Stars ham qulay narxda — do'stlaringizga sovg'a qilish uchun ajoyib.",
    up_nft_rent: "⭐💎 Stars yoki Telegram Premium ham oling — ikkalasi ham qulay narxda.",
    up_go_stars: "⭐ Stars", up_go_premium: "💎 Premium", up_go_gift: "🎁 Sovg'alar", up_go_rent: "🖼 Ijara",
    up_title: "Sizga yoqishi mumkin",
    top_title: "Reyting", top_subtitle: "Eng faol mijozlar", top_forming: "Reyting shakllanmoqda", top_hint: "Birinchi xaridni amalga oshiring!",
    profile_operator: "Operator", profile_channel: "\ud83d\udce2 Bot kanali", profile_orders_channel: "\ud83d\uded2 Savdo/Orderlar",
    nav_main: "Asosiy", nav_rent: "Ijara", nav_history: "Tarix", nav_profile: "Profil",
    modal_to_whom: "Kimga?", modal_to_self: "O'zimga", modal_to_friend: "Do'stimga",
    modal_recipient_label: "Qabul qiluvchi (@username):", modal_message_label: "Xabar (ixtiyoriy):",
    modal_message_placeholder: "Tabrik matni...", modal_rent_days: "Necha kunga?", modal_gift_quantity: "Nechta dona?",
    modal_card_label: "To'lov uchun karta (Uzcard/Humo)", modal_card_holder_label: "Qabul qiluvchi",
    modal_copy: "Nusxalash", modal_paid: "To'ladim", modal_cancel: "Bekor qilish",
    modal_buy: "Sotib olish",
    bal_title: "Mening balansim", bal_history: "Operatsiyalar", bal_topup: "To'ldirish",
    bal_hint: "Balansdan bir bosishda to'lanadi — chek kerak emas.",
    bal_available: "Mavjud mablag'", bal_how_title: "Qanday ishlaydi?",
    bal_step1: "Summani kiriting", bal_step2: "Aniq summani o'tkazing", bal_step3: "Balans avtomatik to'ladi",
    bal_step1_short: "1-qadam: shu kartaga o'tkazing", bal_step2_short: "2-qadam: chekni yuboring — tezroq tekshiramiz",
    bal_note: "🔒 Balansdagi pul faqat do'kondagi xaridlar uchun, naqd pulga qaytarilmaydi.",
    topup_confirm: "Diqqat!\n\nKeyingi qadamda ANIQ summa chiqadi (masalan 50 042) — aynan shuni o'tkazing, shunda balans avtomatik to'ldiriladi.\n\nChekni ham yuboring. Balansdagi pul faqat xaridlarga, qaytarilmaydi.",
    bal_pending_title: "Aynan shu summani o'tkazing", bal_pending_hint: "Aynan shu summa kelsa, balans avtomatik to'ldiriladi. Bank komissiya ushlasa ham — qancha tushsa, shuncha yoziladi.",
    bal_pay: "Balansdan to'lash", bal_pay_short: "Balans yetarli emas",
    bal_err_amount: "Summa {min} dan {max} gacha bo'lishi kerak.",
    bal_empty: "Hozircha operatsiyalar yo'q.",
    bal_sent: "Rekvizitlar chatga ham yuborildi.",
    bal_cancel: "Bekor qilish",
    bal_send_receipt: "📎 To'lov chekini yuborish",
    bal_receipt_sent: "Chek yuborildi — tekshirib, balansga yozamiz.",
    bal_receipt_dup: "Bu chek allaqachon yuborilgan.",
    bal_topped_up: "💼 Balans to'ldirildi: +{amount}",
    bal_err_pending: "Sizda {amount} uchun to'lanmagan so'rov bor. Uni to'lang yoki bekor qilib, yangisini yarating.",
    bal_pay_done: "Bu buyurtma allaqachon to'langan.",
    bal_pay_busy: "Band, bir soniyadan keyin qayta urinib ko'ring.",
    tour4_title: "Balans — eng qulayi",
    tour4_text: "Balansingizni xohlagancha to'ldirib qo'ying va buyurtmalarni bir bosishda to'lang. Bank komissiyasi balansga tushgan summani biroz kamaytiradi, xolos — hech narsa osilib qolmaydi.",
    splash_loading: "YUKLANMOQDA",
    tour_skip: "O'tkazib yuborish",
    tour_next: "Keyingisi",
    tour_start: "Boshladik!",
    tour1_title: "Mahsulotni tanlang",
    tour1_text: "Stars, Premium, sovg'a yoki NFT ijarasi — bo'limni tanlab, kerakligini bosing. Kimga: o'zingizga yoki do'stingizga.",
    tour2_title: "Aniq summani o'tkazing",
    tour2_text: "«Sotib olish» tugmasidan keyin karta raqami va ANIQ summa chiqadi. Aynan shu summani o'tkazing — bir so'm ham kam yoki ko'p emas, aks holda to'lov avtomatik tasdiqlanmaydi.",
    tour3_title: "Chekni yuboring — tamom",
    tour3_text: "To'lov chekini shu yerga yuklang. Buyurtma odatda 3-10 daqiqada bajariladi, holatini shu oynada kuzatib turasiz.",
    modal_friend_start_note: "Do'stingizga tovar yetkazilishi uchun do'stingiz botga 1 marta start bosgan bo'lishi kerak.",
    err_username: "Username kiriting", err_no_username: "Sizda public username yo'q. Telegram sozlamalaridan o'rnating yoki \"Do'stimga\" tanlang.",
    rent_terms: (fee, refund) => "Xizmat haqi: ~" + fee + ". Ijara tugagach ~" + refund + " qaytariladi.",
    copied: "Nusxalandi!", empty: "Hozircha bo'sh.", rent_days_suffix: "kun", rent_from: "dan", rent_btn: "Ijaraga olish",
    modal_preview: "Telegram-da ko'rish",
    sort_recent: "Yangilari", sort_price_asc: "Narx: arzondan qimmatga", sort_price_desc: "Narx: qimmatdan arzonga",
    sort_duration_asc: "Muddat: qisqa", sort_duration_desc: "Muddat: uzun",
    load_more: "Ko'proq ko'rsatish", premium_title: "Telegram Premium olish", premium_subtitle: "O'zingiz yoki yaqiningiz uchun", premium_get_suffix: "olish", premium_cta: "{item} olish",
    custom_amount: "Boshqa miqdor", custom_amount_hint: "O'zingiz kiriting", custom_amount_label: "Nechta Stars?",
    recent_recipient_label: "Yaqinda:", collection_all: "Barcha kolleksiyalar", collection_title: "Kolleksiya bo'yicha filtr",
    live_label: "JONLI", minutes_ago: "daqiqa oldin", hours_ago: "soat oldin",
    status_awaiting_payment: "To'lov kutilmoqda", status_payment_review: "Tekshirilmoqda", status_paid: "To'landi",
    status_fulfilling: "Bajarilmoqda", status_completed: "Bajarildi", status_rejected: "Bekor qilindi",
    cat_stars: "\u2b50 Stars", cat_premium: "\ud83d\udc8e Premium", cat_simple_gift: "\ud83c\udf81 Sovg'a", cat_nft_rent: "\ud83d\uddbc Ijara",
    top_period_today: "Bugun", top_period_week: "Hafta", top_period_month: "Oy", top_period_all: "Hammasi",
    top_orders_suffix: "buyurtma", top_you: "Siz", top_empty: "Bu davrda hali xaridlar yo'q.", badge_popular: "Mashhur", per_star: "so'm / yulduz", profile_no_purchases: "Birinchi xaridni amalga oshiring 🚀",
    howto_title: "🎁 Ijara qanday ishlaydi?",
    howto_steps: ["Gift va ijara muddatini tanlang", "Buyurtmani rasmiylashtiring va to'lovni amalga oshiring", "Admin to'lovni tasdiqlaydi", "Telegram botga tutorial video yuboriladi", "Videoni ko'rib, Telegram'dan shaxsiy havolangizni oling", "Havolani shu yerdagi maydonga joylang", "Havola tekshiriladi va sovg'a ulanadi", "Sovg'a profilingizda ko'rinadi ✅"],
    ao_title: "Aktiv buyurtma", ao_awaiting_payment: "To'lov kutilmoqda", ao_payment_review: "To'lov tekshirilmoqda",
    ao_paid: "To'lov tasdiqlandi", ao_fulfilling: "Bajarilmoqda",
    ao_android_hint: "📱 Android'da: fragment.com'ni <b>Chrome</b>'da oching. Havolani nusxalagach, sahifani <b>yopmang va yangilamang</b> — sovg'a aynan o'sha sahifada ulanadi. Ulanmasa — yangi havola oling va qayta yuboring.",
    ao_link_title: "Keyingi qadam: havolani kiriting", ao_link_hint: "Botga yuborilgan tutorial videodagi ko'rsatma bo'yicha olingan havolani joylang.",
    ao_link_send: "Havolani yuborish", ao_watch_tutorial: "Tutorialni ko'rish (botda)",
    ao_display_video: "Profilda qanday ko'rsatish",
    flow_display_hint: "Sovg'a hisobingizda, lekin profilda o'zi ko'rinmaydi — ko'rsatishni bir marta yoqish kerak. Videoda qanday qilish ko'rsatilgan.",
    ao_connected: "Sovg'a profilingizga ulandi!",
    ao_connect_pending: "Havola saqlandi — sovg'a bir necha daqiqada ulanadi",
    ao_err_empty: "Havolani kiriting", ao_err_bad_link: "Havola noto'g'ri. U tc:// bilan boshlanishi kerak.",
    ao_err_connect: "Ulashda xatolik. Operator tez orada qo'lda ulab beradi.", ao_err_network: "Server bilan bog'lanib bo'lmadi.", ao_cancel: "Buyurtmani bekor qilish", ao_cancel_confirm: "Buyurtma bekor qilinsinmi?", ao_cancel_request: "Bekor qilishni so'rash", ao_cancel_request_confirm: "Buyurtma to'langan. Sotuvchidan bekor qilishni so'raymizmi?", ao_cancel_requested: "📨 So'rov yuborildi. Sotuvchi tez orada ko'rib chiqadi.", ao_pay_title: "To'lovni amalga oshiring", ao_pay_hint: "Kartaga summani o'tkazing va chek skrinshotini shu yerga yuklang.", ao_pay_upload: "Chek skrinshotini yuklash", ao_receipt_sent: "✅ Chek yuborildi! Admin tez orada tekshiradi.", ao_err_too_big: "Fayl juda katta (8 MB gacha).", ao_err_receipt: "Chekni yuborib bo'lmadi, qayta urinib ko'ring.", ao_err_wrong_status: "Bu buyurtma uchun chek allaqachon yuborilgan.", ao_err_no_image: "Rasmni o'qib bo'lmadi. Galereyadan oddiy rasm (JPG/PNG) tanlang.", ao_err_not_found: "Buyurtma topilmadi.", ao_err_duplicate: "Bu chek allaqachon ishlatilgan. Yangi to'lov chekini yuboring.",
    profile_stats_title: "Mening statistikam", profile_stats_rank: "Reyting o'rningiz", profile_stats_total: "Jami xarid",
    history_loading: "Yuklanmoqda...", history_open_bot: "Ochish uchun botni Telegram ichida oching.",
    order_success_title: "Buyurtma muvaffaqiyatli qabul qilindi", order_success_hint: "Tez orada tasdiqlaymiz — natija shu botda yoziladi.",
    order_success_item: "Mahsulot", order_success_recipient: "Qabul qiluvchi", order_success_total: "Summa",
    order_success_history: "Tarixni ko'rish", order_success_more: "Yana xarid qilish", order_success_home: "Asosiy sahifa",
    nav_cart: "Savat", cart_title: "Savat", cart_empty: "Savat bo'sh", cart_empty_hint: "Mahsulot tanlang va \"Savatga\" tugmasini bosing.",
    cart_add: "Savatga", cart_added: "Savatga qo'shildi ✅", cart_buy_now: "Hozir to'lash",
    cart_total: "Jami", cart_pay: "Hammasini to'lash", cart_clear: "Savatni tozalash",
    cart_clear_confirm: "Savatni tozalaymizmi?", cart_to_self: "O'zimga", cart_to: "Kimga",
    cart_items_suffix: "ta mahsulot", cart_go_shop: "Do'konga o'tish",
    cart_pay_hint: "\"Sotib olish\" tugmasini bosing — karta raqami va aniq summa keyingi qadamda chiqadi.",
    cart_err_generic: "Buyurtmani yuborib bo'lmadi, qayta urinib ko'ring.",
    cart_err_no_username: "Sizda public username yo'q. Telegram sozlamalaridan o'rnating yoki \"Do'stimga\" tanlang.",
    cart_err_stars_limit: "Bitta buyurtmada 50 dan 1 000 000 tagacha yulduz olish mumkin. Miqdorni kamaytiring.",
    cart_err_too_many: "Sizda yopilmagan buyurtmalar juda ko'p. Avvalgilarini to'lang yoki bekor qiling.",
    err_banned: "Hisobingiz bloklangan. Savol bo'lsa — operatorga yozing.",
    cart_active_title: "Savat",
    cart_success_hint: "Buyurtmani tasdiqlash uchun bot chatini oching — u yerda \"Tasdiqlash\" tugmasini bosing.",
    flow_step_created: "Qabul qilindi", flow_step_payment: "To'lov", flow_step_doing: "Bajarilmoqda", flow_step_done: "Tayyor",
    flow_awaiting_title: "To'lovni kutyapmiz", flow_awaiting_sub: "Summani kartaga o'tkazing va chek skrinshotini shu yerga yuklang — qolganini shu oynada ko'rasiz.",
    flow_review_title: "To'lov tekshirilmoqda", flow_review_sub: "Odatda bir necha daqiqa. Oyna o'zi yangilanadi — yopmasangiz ham bo'ladi.",
    flow_doing_title: "Buyurtma bajarilmoqda", flow_doing_sub: "Allaqachon ish boshladik. Tayyor bo'lishi bilan shu yerda ko'rasiz.",
    flow_done_title: "Bajarildi!", flow_done_sub: "Buyurtmangiz yakunlandi. Xaridingiz uchun rahmat 🙌",
    flow_rejected_title: "Buyurtma bekor qilindi", flow_rejected_sub: "To'lov tasdiqlanmadi. Operatorga yozing yoki qayta urinib ko'ring.",
    flow_pay_exact: "Aynan shu summani o'tkazing:",
    flow_exact_warn: "Bir so'm ham kam yoki ko'p emas!",
    buy_confirm: "Diqqat!\n\nKeyingi qadamda ANIQ summa chiqadi — aynan shuni o'tkazing, bir so'm ham kam yoki ko'p emas.\n\nAks holda to'lov avtomatik tasdiqlanmaydi va buyurtma kechikadi.",
    flow_commission_note: "Agar bankingiz o'tkazma uchun komissiya olsa — uni summa USTIGA qo'shing. Kartaga aynan shu summa tushishi kerak, aks holda to'lov avtomatik tasdiqlanmaydi.", flow_minimize: "Yopish (do'konga qaytish)", flow_write_operator: "Operatorga yozish",
    flow_tips: ["Qabul qiluvchi tekshirilmoqda…", "Buyurtma tayyorlanmoqda…", "Yetkazib berilmoqda…", "Deyarli tayyor…"],
    rentals_title: "Mening ijaralarim", rentals_empty: "Aktiv ijara yo'q.",
    rent_ends_in: "Tugashiga", rent_days_short: "kun", rent_hours_short: "soat",
    rent_extend: "Uzaytirish", rent_extend_title: "Ijarani uzaytirish", rent_extend_days: "Necha kunga uzaytiramiz?",
    rent_extend_until: "Yangi tugash sanasi", rent_extend_note: "Sovg'a profilingizda qoladi — havolani qayta yuborish shart emas.",
    rent_ending_soon: "Tez orada tugaydi!",
  },
  ru: {
    ijara_title: "Аренда гифтов", history_title: "История покупок",
    history_empty: "Пока пусто.", history_hint: "Полная история - в разделе «Мои заказы» в боте.",
    top_people: " · {n} чел.", top_list: "Список", top_gifts: "подарк.", top_rents: "аренд.",
    top_me_first: "Вы на 1-м месте 👑", top_me_in: "Вы в TOP-8 🔥", top_me_place: "#{rank} место",
    top_me_up: "До #{next} места — {amount}", top_me_out: "До TOP-8 осталось {amount}",
    top_me_none: "Вас пока нет в рейтинге", top_me_none_hint: "Появитесь здесь после первой покупки",
    lang_name: "Русский", pm_lang: "Язык", pm_lang_sub: "Выберите язык",
    pm_orders: "Мои заказы", pm_orders_sub: "История покупок",
    pm_help: "Помощь", pm_help_sub: "Вопросы и проблемы",
    pm_channel: "Канал", pm_channel_sub: "Новости и акции",
    pm_reviews: "Канал заказов", pm_reviews_sub: "Выполненные заказы",
    pf_spent: "Всего куплено", pf_rank: "Рейтинг", pf_rank_none: "Пока нет",
    rv_title: "Отзывы клиентов", rv_count: "{n} отзыв(ов)", rv_empty: "Отзывов пока нет.",
    rate_title: "Как прошёл заказ?", rate_sub: "Оцените — это поможет другим покупателям",
    rate_labels: ["", "Очень плохо", "Плохо", "Нормально", "Хорошо", "Отлично! 🔥"],
    rate_ph_good: "Комментарий (необязательно)", rate_ph_bad: "Что не понравилось? Напишите — обязательно разберёмся",
    rate_send: "Отправить", rate_thanks: "🙏 Спасибо! Отзыв принят", rate_err: "Не удалось отправить, попробуйте ещё раз",
    pc_title: "Чтобы получить Premium, напишите админу", pc_hint: "Нажмите кнопку — сообщение уже будет готово, останется отправить.",
    pc_write: "✍️ Написать админу", pc_spam: "🚫 Я в спаме", pc_spam_done: "✅ Админ уведомлён — он напишет вам через бота",
    pc_spam_hint: "Если Telegram не даёт вам писать первым — нажмите эту кнопку.",
    pc_msg: "Здравствуйте! Оплатил(а) Premium на {item} ✅\nЗаказ #{id}",
    tut_android: "🤖 Инструкция для Android", tut_ios: "🍏 Инструкция для iPhone",
    relink_btn: "🔄 Переподключить", relink_title: "Новая ссылка", relink_hint: "Не подключилось на Fragment? Возьмите новую ссылку и вставьте сюда. Скопировав ссылку, не закрывайте страницу Fragment.",
    relink_send: "Переподключить", relink_ok: "Новая ссылка отправлена — результат придёт в бот",
    up_stars: "💎 Возьмите и Telegram Premium — значок в профиле, большие файлы и другие плюшки.",
    up_premium: "🎁 Украсьте профиль — арендуйте уникальный подарок или купите обычный.",
    up_simple_gift: "⭐ Stars тоже по хорошей цене — отличный подарок друзьям.",
    up_nft_rent: "⭐💎 Загляните и в Stars или Premium — там тоже приятные цены.",
    up_go_stars: "⭐ Stars", up_go_premium: "💎 Premium", up_go_gift: "🎁 Подарки", up_go_rent: "🖼 Аренда",
    up_title: "Вам может понравиться",
    top_title: "Рейтинг", top_subtitle: "Самые активные клиенты", top_forming: "Рейтинг формируется", top_hint: "Сделайте первую покупку!",
    profile_operator: "Оператор", profile_channel: "\ud83d\udce2 Канал бота", profile_orders_channel: "\ud83d\uded2 Заказы/Отзывы",
    nav_main: "Главная", nav_rent: "Аренда", nav_history: "История", nav_profile: "Профиль",
    modal_to_whom: "Кому?", modal_to_self: "Себе", modal_to_friend: "Другу",
    modal_recipient_label: "Получатель (@username):", modal_message_label: "Сообщение (необязательно):",
    modal_message_placeholder: "Текст поздравления...", modal_rent_days: "На сколько дней?", modal_gift_quantity: "Сколько штук?",
    modal_card_label: "Карта для оплаты (Uzcard/Humo)", modal_card_holder_label: "Получатель",
    modal_copy: "Скопировать", modal_paid: "Я оплатил", modal_cancel: "Отмена",
    modal_buy: "Купить",
    bal_title: "Мой баланс", bal_history: "Операции", bal_topup: "Пополнить",
    bal_hint: "С баланса оплата в одно нажатие — без чеков.",
    bal_available: "Доступно", bal_how_title: "Как это работает?",
    bal_step1: "Введите сумму", bal_step2: "Переведите точную сумму", bal_step3: "Баланс пополнится сам",
    bal_step1_short: "Шаг 1: переведите на эту карту", bal_step2_short: "Шаг 2: отправьте чек — так проверим быстрее",
    bal_note: "🔒 Деньги на балансе — только для покупок в магазине, наличными не возвращаются.",
    topup_confirm: "Внимание!\n\nДальше появится ТОЧНАЯ сумма (например 50 042) — переведите именно её, тогда баланс пополнится автоматически.\n\nЧек тоже отправьте. Баланс — только на покупки, не возвращается.",
    bal_pending_title: "Переведите ровно эту сумму", bal_pending_hint: "Когда придёт именно эта сумма, баланс пополнится автоматически. Если банк удержит комиссию — зачислим, сколько дошло.",
    bal_pay: "Оплатить с баланса", bal_pay_short: "На балансе недостаточно",
    bal_err_amount: "Сумма должна быть от {min} до {max}.",
    bal_empty: "Операций пока нет.",
    bal_sent: "Реквизиты продублировал в чат.",
    bal_cancel: "Отменить",
    bal_send_receipt: "📎 Отправить чек об оплате",
    bal_receipt_sent: "Чек отправлен — проверим и зачислим на баланс.",
    bal_receipt_dup: "Этот чек уже присылали.",
    bal_topped_up: "💼 Баланс пополнен: +{amount}",
    bal_err_pending: "У вас уже есть неоплаченное пополнение на {amount}. Оплатите его или отмените и создайте новое.",
    bal_pay_done: "Этот заказ уже оплачен.",
    bal_pay_busy: "Занято, попробуйте через секунду.",
    tour4_title: "Баланс — самый удобный способ",
    tour4_text: "Пополните баланс на любую сумму и оплачивайте заказы в одно нажатие. Комиссия банка просто чуть уменьшит зачисление — и ничего никогда не зависнет.",
    splash_loading: "ЗАГРУЗКА",
    tour_skip: "Пропустить",
    tour_next: "Дальше",
    tour_start: "Начать!",
    tour1_title: "Выберите товар",
    tour1_text: "Stars, Premium, подарок или аренда NFT — откройте раздел и нажмите на нужное. Себе или другу — на ваш выбор.",
    tour2_title: "Переведите точную сумму",
    tour2_text: "После кнопки «Купить» появятся номер карты и ТОЧНАЯ сумма. Переведите именно её — ни больше, ни меньше, иначе оплата не подтвердится автоматически.",
    tour3_title: "Пришлите чек — и всё",
    tour3_text: "Загрузите чек об оплате прямо здесь. Заказ обычно выполняется за 3-10 минут, статус виден в этом же окне.",
    modal_friend_start_note: "Чтобы товар дошёл до друга, он должен хотя бы один раз нажать «Старт» в боте.",
    err_username: "Введите username", err_no_username: "У вас нет публичного username. Установите в настройках Telegram или выберите \"Другу\".",
    rent_terms: (fee, refund) => "Сервисный сбор: ~" + fee + ". После окончания аренды вернётся ~" + refund + ".",
    copied: "Скопировано!", empty: "Пока пусто.", rent_days_suffix: "дн.", rent_from: "от", rent_btn: "Арендовать",
    modal_preview: "Смотреть в Telegram",
    sort_recent: "Новинки", sort_price_asc: "Цена: по возрастанию", sort_price_desc: "Цена: по убыванию",
    sort_duration_asc: "Срок: короче", sort_duration_desc: "Срок: длиннее",
    load_more: "Показать ещё", premium_title: "Оформить Telegram Premium", premium_subtitle: "Себе или близкому человеку", premium_get_suffix: "оформить", premium_cta: "Оформить: {item}",
    custom_amount: "Другое количество", custom_amount_hint: "Введите сами", custom_amount_label: "Сколько звёзд?",
    recent_recipient_label: "Недавнее:", collection_all: "Все коллекции", collection_title: "Фильтр по коллекции",
    live_label: "СЕЙЧАС", minutes_ago: "мин назад", hours_ago: "ч назад",
    status_awaiting_payment: "Ждём оплату", status_payment_review: "Проверяется", status_paid: "Оплачено",
    status_fulfilling: "Выполняется", status_completed: "Выполнено", status_rejected: "Отменено",
    cat_stars: "\u2b50 Stars", cat_premium: "\ud83d\udc8e Premium", cat_simple_gift: "\ud83c\udf81 Подарок", cat_nft_rent: "\ud83d\uddbc Аренда",
    top_period_today: "Сегодня", top_period_week: "Неделя", top_period_month: "Месяц", top_period_all: "Всё время",
    top_orders_suffix: "заказ(ов)", top_you: "Вы", top_empty: "За этот период покупок ещё не было.", badge_popular: "Популярный", per_star: "сум / звезда", profile_no_purchases: "Сделайте первую покупку 🚀",
    howto_title: "🎁 Как работает аренда?",
    howto_steps: ["Выберите подарок и срок аренды", "Оформите заказ и оплатите", "Админ подтверждает оплату", "В Telegram-бот приходит видео-инструкция", "Посмотрите видео и получите свою персональную ссылку", "Вставьте ссылку в поле здесь", "Ссылка проверяется, подарок подключается", "Подарок появляется в вашем профиле ✅"],
    ao_title: "Активный заказ", ao_awaiting_payment: "Ждём оплату", ao_payment_review: "Проверяем оплату",
    ao_paid: "Оплата подтверждена", ao_fulfilling: "Выполняется",
    ao_android_hint: "📱 На Android: открывайте fragment.com в <b>Chrome</b>. Скопировав ссылку, <b>не закрывайте и не обновляйте</b> страницу — подарок подключится именно на ней. Не подключилось — возьмите новую ссылку и отправьте снова.",
    ao_link_title: "Следующий шаг: вставьте ссылку", ao_link_hint: "Вставьте ссылку, полученную по инструкции из видео, которое пришло в бот.",
    ao_link_send: "Отправить ссылку", ao_watch_tutorial: "Посмотреть инструкцию (в боте)",
    ao_display_video: "Как показать в профиле",
    flow_display_hint: "Подарок у вас на аккаунте, но в профиле сам не появится — показ нужно включить один раз. В видео показано, как это сделать.",
    ao_connected: "Подарок подключён к профилю!",
    ao_connect_pending: "Ссылка сохранена — подарок подключится через пару минут",
    ao_err_empty: "Введите ссылку", ao_err_bad_link: "Неверная ссылка. Она должна начинаться с tc://",
    ao_err_connect: "Ошибка подключения. Оператор скоро подключит вручную.", ao_err_network: "Не удалось связаться с сервером.", ao_cancel: "Отменить заказ", ao_cancel_confirm: "Отменить заказ?", ao_cancel_request: "Попросить отменить заказ", ao_cancel_request_confirm: "Заказ уже оплачен. Отправить продавцу просьбу отменить его?", ao_cancel_requested: "📨 Запрос отправлен. Продавец скоро его рассмотрит.", ao_pay_title: "Оплатите заказ", ao_pay_hint: "Переведите сумму на карту и загрузите сюда скриншот чека.", ao_pay_upload: "Загрузить скриншот чека", ao_receipt_sent: "✅ Чек отправлен! Админ скоро проверит.", ao_err_too_big: "Файл слишком большой (до 8 МБ).", ao_err_receipt: "Не удалось отправить чек, попробуйте ещё раз.", ao_err_wrong_status: "Чек по этому заказу уже отправлен.", ao_err_no_image: "Не удалось прочитать изображение. Выберите обычное фото (JPG/PNG).", ao_err_not_found: "Заказ не найден.", ao_err_duplicate: "Этот чек уже использовали. Пришлите чек нового платежа.",
    profile_stats_title: "Моя статистика", profile_stats_rank: "Ваше место в рейтинге", profile_stats_total: "Всего куплено",
    history_loading: "Загрузка...", history_open_bot: "Откройте магазин внутри Telegram, чтобы увидеть историю.",
    order_success_title: "Заказ успешно оформлен", order_success_hint: "Скоро подтвердим — результат придёт в этот же чат.",
    order_success_item: "Товар", order_success_recipient: "Получатель", order_success_total: "Сумма",
    order_success_history: "Смотреть историю", order_success_more: "Купить ещё", order_success_home: "На главную",
    nav_cart: "Корзина", cart_title: "Корзина", cart_empty: "Корзина пуста", cart_empty_hint: "Выберите товар и нажмите «В корзину».",
    cart_add: "В корзину", cart_added: "Добавлено в корзину ✅", cart_buy_now: "Оплатить сейчас",
    cart_total: "Итого", cart_pay: "Оплатить всё", cart_clear: "Очистить корзину",
    cart_clear_confirm: "Очистить корзину?", cart_to_self: "Себе", cart_to: "Кому",
    cart_items_suffix: "товар(ов)", cart_go_shop: "Перейти в магазин",
    cart_pay_hint: "Нажмите «Купить» — номер карты и точная сумма появятся на следующем шаге.",
    cart_err_generic: "Не удалось оформить заказ, попробуйте ещё раз.",
    cart_err_no_username: "У вас нет публичного username. Установите его в настройках Telegram или выберите «Другу».",
    cart_err_stars_limit: "За один заказ можно купить от 50 до 1 000 000 звёзд. Уменьшите количество.",
    cart_err_too_many: "У вас слишком много незакрытых заказов. Оплатите или отмените предыдущие.",
    err_banned: "Ваш аккаунт заблокирован. По вопросам напишите оператору.",
    cart_active_title: "Корзина",
    cart_success_hint: "Откройте чат бота и нажмите «Подтвердить» — после этого придут реквизиты и сумма.",
    flow_step_created: "Оформлен", flow_step_payment: "Оплата", flow_step_doing: "Выполняется", flow_step_done: "Готово",
    flow_awaiting_title: "Ждём оплату", flow_awaiting_sub: "Переведите сумму на карту и загрузите сюда скриншот чека — дальше всё видно в этом окне.",
    flow_review_title: "Проверяем оплату", flow_review_sub: "Обычно это пара минут. Окно обновится само — можно не закрывать.",
    flow_doing_title: "Заказ выполняется", flow_doing_sub: "Уже занимаемся вашим заказом. Как будет готово — увидите здесь.",
    flow_done_title: "Выполнено!", flow_done_sub: "Заказ выполнен. Спасибо за покупку 🙌",
    flow_rejected_title: "Заказ отменён", flow_rejected_sub: "Оплата не подтверждена. Напишите оператору или оформите заново.",
    flow_pay_exact: "Переведите ровно:",
    flow_exact_warn: "Ни сумом больше, ни сумом меньше!",
    buy_confirm: "Внимание!\n\nНа следующем шаге появится ТОЧНАЯ сумма — переведите именно её, ни больше ни меньше.\n\nИначе оплата не подтвердится автоматически и заказ задержится.",
    flow_commission_note: "Если ваш банк берёт комиссию за перевод — добавьте её СВЕРХУ. На карту должна прийти ровно эта сумма, иначе оплата не подтвердится автоматически.", flow_minimize: "Свернуть (вернуться в магазин)", flow_write_operator: "Написать оператору",
    flow_tips: ["Проверяем получателя…", "Готовим заказ…", "Отправляем…", "Почти готово…"],
    rentals_title: "Мои аренды", rentals_empty: "Активных аренд нет.",
    rent_ends_in: "Осталось", rent_days_short: "дн.", rent_hours_short: "ч",
    rent_extend: "Продлить", rent_extend_title: "Продление аренды", rent_extend_days: "На сколько дней продлить?",
    rent_extend_until: "Новая дата окончания", rent_extend_note: "Подарок остаётся в профиле — ссылку заново присылать не нужно.",
    rent_ending_soon: "Скоро закончится!",
  },
  en: {
    ijara_title: "Gift rental", history_title: "Purchase history",
    history_empty: "Nothing here yet.", history_hint: "Full history is in \"My orders\" in the bot chat.",
    top_people: " · {n} people", top_list: "List", top_gifts: "gifts", top_rents: "rentals",
    top_me_first: "You're #1 👑", top_me_in: "You're in the TOP-8 🔥", top_me_place: "#{rank} place",
    top_me_up: "{amount} to reach #{next}", top_me_out: "{amount} to enter the TOP-8",
    top_me_none: "You're not in the rating yet", top_me_none_hint: "You'll appear here after your first purchase",
    lang_name: "English", pm_lang: "Language", pm_lang_sub: "Choose a language",
    pm_orders: "My orders", pm_orders_sub: "Purchase history",
    pm_help: "Help", pm_help_sub: "Questions and issues",
    pm_channel: "Channel", pm_channel_sub: "News and deals",
    pm_reviews: "Orders channel", pm_reviews_sub: "Completed orders",
    pf_spent: "Total spent", pf_rank: "Rating", pf_rank_none: "Not yet",
    rv_title: "Customer reviews", rv_count: "{n} reviews", rv_empty: "No reviews yet.",
    rate_title: "How was your order?", rate_sub: "Rate us — it helps other buyers",
    rate_labels: ["", "Terrible", "Bad", "Okay", "Good", "Excellent! 🔥"],
    rate_ph_good: "Comment (optional)", rate_ph_bad: "What went wrong? Tell us — we'll look into it",
    rate_send: "Send", rate_thanks: "🙏 Thank you! Review received", rate_err: "Couldn't send, please try again",
    pc_title: "Message the admin to get your Premium", pc_hint: "Tap the button — the message is ready, just send it.",
    pc_write: "✍️ Message the admin", pc_spam: "🚫 I'm spam-restricted", pc_spam_done: "✅ Admin notified — they'll message you via the bot",
    pc_spam_hint: "If Telegram doesn't let you message people first, tap this button.",
    pc_msg: "Hi! I've paid for Premium ({item}) ✅\nOrder #{id}",
    tut_android: "🤖 Android guide", tut_ios: "🍏 iPhone guide",
    relink_btn: "🔄 Reconnect", relink_title: "New link", relink_hint: "Didn't connect on Fragment? Get a new link and paste it here. After copying the link, don't close the Fragment page.",
    relink_send: "Reconnect", relink_ok: "New link sent — the result will arrive in the bot",
    up_stars: "💎 Get Telegram Premium too — a profile badge, bigger files and more.",
    up_premium: "🎁 Dress up your profile — rent a unique gift or buy a regular one.",
    up_simple_gift: "⭐ Stars are great value too — a perfect gift for friends.",
    up_nft_rent: "⭐💎 Check out Stars or Premium — great prices there too.",
    up_go_stars: "⭐ Stars", up_go_premium: "💎 Premium", up_go_gift: "🎁 Gifts", up_go_rent: "🖼 Rent",
    up_title: "You might also like",
    top_title: "Rating", top_subtitle: "Most active customers", top_forming: "Rating is forming", top_hint: "Make your first purchase!",
    profile_operator: "Operator", profile_channel: "\ud83d\udce2 Bot channel", profile_orders_channel: "\ud83d\uded2 Orders channel",
    nav_main: "Home", nav_rent: "Rent", nav_history: "History", nav_profile: "Profile",
    modal_to_whom: "For whom?", modal_to_self: "Myself", modal_to_friend: "A friend",
    modal_recipient_label: "Recipient (@username):", modal_message_label: "Message (optional):",
    modal_message_placeholder: "Congratulation text...", modal_rent_days: "For how many days?", modal_gift_quantity: "How many?",
    modal_card_label: "Payment card (Uzcard/Humo)", modal_card_holder_label: "Recipient",
    modal_copy: "Copy", modal_paid: "I've paid", modal_cancel: "Cancel",
    modal_buy: "Buy",
    bal_title: "My balance", bal_history: "Transactions", bal_topup: "Top up",
    bal_hint: "Pay from balance in one tap — no receipts.",
    bal_available: "Available", bal_how_title: "How it works",
    bal_step1: "Enter an amount", bal_step2: "Transfer the exact amount", bal_step3: "Balance fills automatically",
    bal_step1_short: "Step 1: transfer to this card", bal_step2_short: "Step 2: send the receipt — we'll check faster",
    bal_note: "🔒 Balance can only be spent in the shop and is not refundable as cash.",
    topup_confirm: "Heads up!\n\nThe EXACT amount appears next (e.g. 50 042) — send exactly that and your balance tops up automatically.\n\nSend the receipt too. Balance is for purchases only, non-refundable.",
    bal_pending_title: "Transfer exactly this amount", bal_pending_hint: "When this exact amount arrives, your balance is topped up automatically. If the bank takes a fee, we credit what arrives.",
    bal_pay: "Pay from balance", bal_pay_short: "Not enough balance",
    bal_err_amount: "Amount must be between {min} and {max}.",
    bal_empty: "No transactions yet.",
    bal_sent: "Card details also sent to the chat.",
    bal_cancel: "Cancel",
    bal_send_receipt: "📎 Send payment receipt",
    bal_receipt_sent: "Receipt sent — we'll check it and credit your balance.",
    bal_receipt_dup: "This receipt was already submitted.",
    bal_topped_up: "💼 Balance topped up: +{amount}",
    bal_err_pending: "You already have an unpaid top-up for {amount}. Pay it, or cancel it and create a new one.",
    bal_pay_done: "This order is already paid.",
    bal_pay_busy: "Busy, try again in a second.",
    tour4_title: "Balance is the easiest way",
    tour4_text: "Top up your balance with any amount and pay for orders in one tap. A bank fee only lowers what lands on your balance — nothing ever gets stuck.",
    splash_loading: "LOADING",
    tour_skip: "Skip",
    tour_next: "Next",
    tour_start: "Let's go!",
    tour1_title: "Pick what you want",
    tour1_text: "Stars, Premium, a gift or an NFT rental — open a section and tap what you need. For yourself or for a friend.",
    tour2_title: "Send the exact amount",
    tour2_text: "After you tap Buy, the card number and the EXACT amount appear. Send precisely that amount — not a som more or less, otherwise the payment won't confirm automatically.",
    tour3_title: "Upload the receipt — done",
    tour3_text: "Upload your payment receipt right here. Orders are usually completed in 3-10 minutes, and you can follow the status in this window.",
    modal_friend_start_note: "For the gift to reach your friend, they must press Start in the bot at least once.",
    err_username: "Enter a username", err_no_username: "You don't have a public username. Set one in Telegram settings or choose \"A friend\".",
    rent_terms: (fee, refund) => "Service fee: ~" + fee + ". ~" + refund + " is refunded after the rental ends.",
    copied: "Copied!", empty: "Nothing here yet.", rent_days_suffix: "days", rent_from: "from", rent_btn: "Rent",
    modal_preview: "View in Telegram",
    sort_recent: "Newest", sort_price_asc: "Price: low to high", sort_price_desc: "Price: high to low",
    sort_duration_asc: "Duration: shortest", sort_duration_desc: "Duration: longest",
    load_more: "Show more", premium_title: "Get Telegram Premium", premium_subtitle: "For yourself or someone else", premium_get_suffix: "get", premium_cta: "Get {item}",
    custom_amount: "Custom amount", custom_amount_hint: "Enter your own", custom_amount_label: "How many Stars?",
    recent_recipient_label: "Recent:", collection_all: "All collections", collection_title: "Filter by collection",
    live_label: "LIVE", minutes_ago: "min ago", hours_ago: "h ago",
    status_awaiting_payment: "Awaiting payment", status_payment_review: "Under review", status_paid: "Paid",
    status_fulfilling: "In progress", status_completed: "Completed", status_rejected: "Cancelled",
    cat_stars: "\u2b50 Stars", cat_premium: "\ud83d\udc8e Premium", cat_simple_gift: "\ud83c\udf81 Gift", cat_nft_rent: "\ud83d\uddbc Rent",
    top_period_today: "Today", top_period_week: "Week", top_period_month: "Month", top_period_all: "All time",
    top_orders_suffix: "order(s)", top_you: "You", top_empty: "No purchases in this period yet.", badge_popular: "Popular", per_star: "so'm / star", profile_no_purchases: "Make your first purchase 🚀",
    howto_title: "🎁 How does renting work?",
    howto_steps: ["Pick a gift and rental period", "Place the order and pay", "Admin confirms your payment", "A tutorial video is sent to the Telegram bot", "Watch it and get your personal link from Telegram", "Paste the link into the field here", "The link is verified and the gift is connected", "The gift appears on your profile ✅"],
    ao_title: "Active order", ao_awaiting_payment: "Awaiting payment", ao_payment_review: "Checking payment",
    ao_paid: "Payment confirmed", ao_fulfilling: "In progress",
    ao_android_hint: "📱 On Android: open fragment.com in <b>Chrome</b>. After copying the link, <b>don't close or refresh</b> the page — the gift connects on that exact page. Didn't connect? Get a new link and send it again.",
    ao_link_title: "Next step: paste your link", ao_link_hint: "Paste the link you got by following the tutorial video sent to the bot.",
    ao_link_send: "Send link", ao_watch_tutorial: "Watch tutorial (in bot)",
    ao_display_video: "How to display it",
    flow_display_hint: "The gift is on your account, but it won't show on your profile by itself — the display has to be turned on once. The video shows how.",
    ao_connected: "Gift connected to your profile!",
    ao_connect_pending: "Link saved — the gift will connect in a few minutes",
    ao_err_empty: "Enter the link", ao_err_bad_link: "Invalid link. It should start with tc://",
    ao_err_connect: "Connection error. An operator will connect it manually soon.", ao_err_network: "Could not reach the server.", ao_cancel: "Cancel order", ao_cancel_confirm: "Cancel this order?", ao_cancel_request: "Request cancellation", ao_cancel_request_confirm: "This order is already paid. Send the seller a cancellation request?", ao_cancel_requested: "📨 Request sent. The seller will review it shortly.", ao_pay_title: "Pay for your order", ao_pay_hint: "Transfer the amount to the card and upload the receipt screenshot here.", ao_pay_upload: "Upload receipt screenshot", ao_receipt_sent: "✅ Receipt sent! The admin will check it shortly.", ao_err_too_big: "File is too large (max 8 MB).", ao_err_receipt: "Could not send the receipt, please try again.", ao_err_wrong_status: "A receipt for this order was already sent.", ao_err_no_image: "Could not read the image. Pick a regular photo (JPG/PNG).", ao_err_not_found: "Order not found.", ao_err_duplicate: "This receipt was already used. Send the receipt of a new payment.",
    profile_stats_title: "My stats", profile_stats_rank: "Your rank", profile_stats_total: "Total spent",
    history_loading: "Loading...", history_open_bot: "Open the shop inside Telegram to see your history.",
    order_success_title: "Order placed successfully", order_success_hint: "We'll confirm soon — the result will be posted in this chat.",
    order_success_item: "Item", order_success_recipient: "Recipient", order_success_total: "Total",
    order_success_history: "View history", order_success_more: "Buy more", order_success_home: "Home",
    nav_cart: "Cart", cart_title: "Cart", cart_empty: "Your cart is empty", cart_empty_hint: "Pick an item and tap \"Add to cart\".",
    cart_add: "Add to cart", cart_added: "Added to cart ✅", cart_buy_now: "Pay now",
    cart_total: "Total", cart_pay: "Pay for everything", cart_clear: "Clear cart",
    cart_clear_confirm: "Clear the cart?", cart_to_self: "Myself", cart_to: "For",
    cart_items_suffix: "item(s)", cart_go_shop: "Go to shop",
    cart_pay_hint: "Tap \"Buy\" — the card number and the exact amount appear on the next step.",
    cart_err_generic: "Could not place the order, please try again.",
    cart_err_no_username: "You don't have a public username. Set one in Telegram settings or choose \"A friend\".",
    cart_err_stars_limit: "You can buy between 50 and 1,000,000 stars per order. Lower the amount.",
    cart_err_too_many: "You have too many open orders. Pay or cancel the previous ones first.",
    err_banned: "Your account is blocked. Contact the operator if you have questions.",
    cart_active_title: "Cart",
    cart_success_hint: "Open the bot chat and tap \"Confirm\" — payment details will arrive there.",
    flow_step_created: "Placed", flow_step_payment: "Payment", flow_step_doing: "In progress", flow_step_done: "Done",
    flow_awaiting_title: "Waiting for payment", flow_awaiting_sub: "Transfer the amount to the card and upload the receipt here — everything else happens in this window.",
    flow_review_title: "Checking your payment", flow_review_sub: "Usually a couple of minutes. This screen updates by itself.",
    flow_doing_title: "Order in progress", flow_doing_sub: "We're working on it. You'll see the result right here.",
    flow_done_title: "Done!", flow_done_sub: "Your order is complete. Thanks for your purchase 🙌",
    flow_rejected_title: "Order cancelled", flow_rejected_sub: "The payment wasn't confirmed. Contact the operator or order again.",
    flow_pay_exact: "Transfer exactly:",
    flow_exact_warn: "Not a som more, not a som less!",
    buy_confirm: "Heads up!\n\nThe EXACT amount appears on the next step — send precisely that, not a som more or less.\n\nOtherwise the payment won't confirm automatically and your order will be delayed.",
    flow_commission_note: "If your bank charges a transfer fee, add it ON TOP. Exactly this amount must arrive on the card, otherwise the payment won't be confirmed automatically.", flow_minimize: "Minimize (back to shop)", flow_write_operator: "Contact operator",
    flow_tips: ["Checking the recipient…", "Preparing your order…", "Delivering…", "Almost there…"],
    rentals_title: "My rentals", rentals_empty: "No active rentals.",
    rent_ends_in: "Left", rent_days_short: "d", rent_hours_short: "h",
    rent_extend: "Extend", rent_extend_title: "Extend rental", rent_extend_days: "Extend by how many days?",
    rent_extend_until: "New end date", rent_extend_note: "The gift stays on your profile — no need to send the link again.",
    rent_ending_soon: "Ending soon!",
  },
};

let lang = "uz";
function t(key) { return I18N[lang][key] !== undefined ? I18N[lang][key] : key; }

function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach(function(el) {
    const key = el.dataset.i18n;
    const val = t(key);
    if (typeof val === "string") el.textContent = val;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(function(el) {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  if (typeof renderReviewsBanner === "function" && reviewsData) renderReviewsBanner();
  const langVal = document.getElementById("pm-lang-value");
  if (langVal) langVal.textContent = t("lang_name");
  renderRentTerms();
  if (currentTab === "top") renderLeaderboard(currentTopPeriod);
  if (currentTab === "profil") renderProfileStats();
  if (currentTab === "ijara") { renderIjara(); renderMyRentals(); }
  else if (currentTab === "savat") renderCart();
  else renderItems();
}

function setActiveFlagUI() {
  Array.prototype.forEach.call(document.querySelectorAll(".lang-flag"), function(btn) {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
}

function setLang(code) {
  if (!I18N[code]) return;
  lang = code;
  setActiveFlagUI();
  applyI18n();
  if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred("light");
}

Array.prototype.forEach.call(document.querySelectorAll(".lang-flag"), function(btn) {
  btn.addEventListener("click", function() { setLang(btn.dataset.lang); });
});

/* «Til» в профиле: у окна Telegram ровно три кнопки — как раз на три языка. */
function openLangPicker() {
  if (tg && tg.showPopup) {
    tg.showPopup({
      title: t("pm_lang"),
      message: t("pm_lang_sub"),
      buttons: [
        { id: "uz", type: "default", text: "🇺🇿 O'zbekcha" },
        { id: "ru", type: "default", text: "🇷🇺 Русский" },
        { id: "en", type: "default", text: "🇬🇧 English" },
      ],
    }, function(id) { if (id) setLang(id); });
    return;
  }
  const codes = ["uz", "ru", "en"];
  setLang(codes[(codes.indexOf(lang) + 1) % codes.length]);
}
setActiveFlagUI();

/* ---------------- Форматирование ---------------- */
function fmtUZS(n) { return Math.round(n).toLocaleString("ru-RU").replace(/,/g, " ") + " so'm"; }

/* ---------------- Короткое уведомление (тост) ---------------- */
let _toastTimer = null;
function showToast(text) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = text;
  el.classList.remove("hidden");
  el.style.animation = "sheetUp .25s cubic-bezier(.2,.9,.25,1) both";
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(function() { el.classList.add("hidden"); }, 1800);
}

/* ================= КОРЗИНА =================
 * Хранится в localStorage этого устройства: заказ создаётся на сервере только
 * в момент оплаты, поэтому корзина — чисто клиентское "черновое" состояние.
 * Одна строка корзины = один товар с количеством и своим получателем
 * (можно в одном заказе купить звёзды себе и премиум другу).
 */
const CART_KEY = "oson_cart_v1";
const CART_MAX_LINES = 20;
const CART_MAX_QTY = 10;
let cart = [];

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    cart = Array.isArray(parsed) ? parsed.filter(function(l) { return l && l.kind && l.unitPrice > 0; }) : [];
  } catch (e) { cart = []; }  // localStorage может быть недоступен — просто пустая корзина
}

function saveCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) { /* тихо игнорируем */ }
  updateCartBadge();
}

function cartCount() {
  return cart.reduce(function(sum, l) { return sum + l.qty; }, 0);
}

function cartTotal() {
  return cart.reduce(function(sum, l) { return sum + l.unitPrice * l.qty; }, 0);
}

function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (!badge) return;
  const n = cartCount();
  badge.textContent = n > 99 ? "99+" : String(n);
  badge.classList.toggle("hidden", n === 0);
}

/** Одинаковый товар одному и тому же получателю не плодит строки — растёт количество. */
function cartLineKey(line) {
  return [line.kind, line.itemName, line.giftId || "", line.starsAmount || "", line.recipientType, line.recipient || "", line.note || ""].join("|");
}

function addToCart(line) {
  const key = cartLineKey(line);
  const existing = cart.filter(function(l) { return cartLineKey(l) === key; })[0];
  if (existing) {
    existing.qty = Math.min(existing.qty + line.qty, CART_MAX_QTY);
  } else {
    if (cart.length >= CART_MAX_LINES) return false;
    cart.push(line);
  }
  saveCart();
  return true;
}

function cartChangeQty(index, delta) {
  const line = cart[index];
  if (!line) return;
  const next = line.qty + delta;
  if (next < 1) { cartRemove(index); return; }
  if (next > CART_MAX_QTY) return;
  line.qty = next;
  saveCart();
  renderCart();
  if (tg && tg.HapticFeedback) tg.HapticFeedback.selectionChanged();
}

function cartRemove(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
  if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred("light");
}

function clearCart() {
  cart = [];
  saveCart();
  renderCart();
}

/**
 * Кладёт в корзину товар, открытый сейчас в модалке оплаты (со всеми
 * выбранными в ней параметрами: получатель, сообщение, количество подарков).
 */
function addActiveItemToCart() {
  const item = activeItem;
  if (!item) return;
  if (["stars", "stars_custom", "premium", "simple_gift"].indexOf(item.kind) === -1) return;

  const errorEl = document.getElementById("modal-error");
  let friendUsername = document.getElementById("gift-username").value.trim();
  if (recipientType === "friend") {
    if (!friendUsername) { errorEl.textContent = t("err_username"); errorEl.classList.remove("hidden"); return; }
    if (friendUsername.charAt(0) !== "@") friendUsername = "@" + friendUsername;
    saveRecentRecipient(friendUsername);
  }

  const note = document.getElementById("gift-message").value.trim();
  const line = {
    uid: "c" + Date.now() + Math.random().toString(16).slice(2, 6),
    kind: item.kind,
    emoji: item.emoji,
    image: item.image || null,
    qty: 1,
    unitPrice: item.price,
    recipientType: recipientType,
    recipient: recipientType === "friend" ? friendUsername : "",
    note: note,
  };

  if (item.kind === "stars") {
    line.starsAmount = item.raw.amount;
    line.itemName = item.raw.amount + " звёзд";
    line.title = item.raw.amount.toLocaleString("ru-RU").replace(/,/g, " ") + " ⭐️";
  } else if (item.kind === "stars_custom") {
    line.starsAmount = item.raw.qty;
    line.itemName = item.raw.qty + " звёзд";
    line.title = item.raw.qty + " ⭐️";
    line.unitPrice = item.price;
  } else if (item.kind === "premium") {
    line.itemName = "Premium — " + item.raw.label;
    line.title = "💎 " + premiumLabel(item.raw.label);
  } else if (item.kind === "simple_gift") {
    line.giftId = item.raw.id;
    line.itemName = "Подарок " + item.emoji + " (" + item.raw.star_count + "⭐)";
    line.title = item.emoji + " " + item.raw.star_count + "⭐";
    line.qty = giftQty;                 // количество, выбранное в модалке
    line.unitPrice = item.raw.price_uzs;  // цена за ОДНУ штуку
  }

  if (!addToCart(line)) { showToast("🛒 " + t("cart_title") + " — max " + CART_MAX_LINES); return; }

  if (tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred("success");
  closeModal();
  showToast(t("cart_added"));
}

function cartLineLabel(line) {
  if (line.recipientType === "friend" && line.recipient) return line.recipient;
  return t("cart_to_self");
}

function renderCart() {
  const listEl = document.getElementById("cart-list");
  const checkoutEl = document.getElementById("cart-checkout");
  const clearBtn = document.getElementById("cart-clear-btn");
  if (!listEl) return;

  if (!cart.length) {
    listEl.innerHTML =
      '<div class="glass-card rounded-[22px] p-8 text-center text-gray-400">' +
        '<p class="text-3xl mb-2">🛒</p>' +
        '<p class="text-[14px] font-semibold text-white mb-1">' + t("cart_empty") + '</p>' +
        '<p class="text-[12px] mb-4">' + t("cart_empty_hint") + '</p>' +
        '<button onclick="switchTab(\'asosiy\')" class="press pill-gold rounded-xl px-4 py-2 text-[12px] font-semibold">' + t("cart_go_shop") + '</button>' +
      '</div>';
    checkoutEl.classList.add("hidden");
    clearBtn.classList.add("hidden");
    return;
  }

  listEl.innerHTML = cart.map(function(line, i) {
    const iconHTML = line.image
      ? '<img src="' + line.image + '" class="w-12 h-12 rounded-xl object-cover flex-shrink-0" onerror="this.replaceWith(Object.assign(document.createElement(\'div\'),{className:\'w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-xl flex-shrink-0\',textContent:\'' + line.emoji + '\'}))" />'
      : '<div class="w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center text-xl flex-shrink-0">' + line.emoji + '</div>';

    return '<div class="glass-card rounded-[20px] p-3 flex items-center gap-3">' +
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

  document.getElementById("cart-total").textContent = fmtUZS(cartTotal());
  checkoutEl.classList.remove("hidden");
  clearBtn.classList.remove("hidden");

  // Реквизиты в корзине тоже убраны — см. комментарий в openModal().
}

/** Отправка всей корзины одним заказом — одна сумма, один чек. */
let cartOrderInFlight = false;
async function submitCartOrder() {
  if (cartOrderInFlight || !cart.length) return;
  const errorEl = document.getElementById("cart-error");
  const btn = document.getElementById("cart-pay-btn");
  errorEl.classList.add("hidden");

  const base = await getShopApiUrl();
  const initData = await waitForInitData();
  if (!base || !initData) {
    errorEl.textContent = t("history_open_bot");
    errorEl.classList.remove("hidden");
    return;
  }

  const items = cart.map(function(line) {
    return {
      category: line.kind,
      item_name: line.itemName,
      price: line.unitPrice,
      quantity: line.qty,
      stars_amount: line.starsAmount,
      gift_id: line.giftId,
      recipient: line.recipient,
      recipient_type: line.recipientType,
      note: line.note || undefined,
    };
  });

  cartOrderInFlight = true;
  const prev = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full align-middle" style="animation: spin .7s linear infinite;"></span>';

  try {
    const res = await fetch(base + "/public/place_cart_order", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData: initData, items: items }),
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      errorEl.textContent = data.error === "no_username" ? t("cart_err_no_username")
        : data.error === "stars_limit" ? t("cart_err_stars_limit")
        : data.error === "too_many_pending" ? t("cart_err_too_many")
        : data.error === "banned" ? t("err_banned")
        : t("cart_err_generic");
      errorEl.classList.remove("hidden");
      return;
    }
    // Корзина оформлена одним заказом — очищаем её и переходим на экран
    // живого статуса, дальше всё происходит там же, внутри витрины.
    const total = cartTotal();
    const count = cartCount();
    clearCart();
    openOrderFlow({ cart_id: data.cart_id, order_id: data.order_id }, {
      order_id: data.order_id,
      cart_id: data.cart_id,
      item_name: "🛒 " + count + " " + t("cart_items_suffix"),
      recipient: "",
      price_uzs: total,
      pay_amount: data.pay_amount,
      card_number: data.card_number,
      card_holder: data.card_holder,
    });
  } catch (e) {
    errorEl.textContent = t("ao_err_network");
    errorEl.classList.remove("hidden");
  } finally {
    cartOrderInFlight = false;
    btn.disabled = false;
    btn.innerHTML = prev;
  }
}

/**
 * Подтверждение действия. В Telegram лучше спрашивать его нативным
 * showConfirm — обычный window.confirm в WebView клиента может быть
 * заблокирован, и тогда кнопка молча ничего не делала бы.
 */
function askConfirm(text, onYes) {
  if (tg && tg.showConfirm) { tg.showConfirm(text, function(ok) { if (ok) onYes(); }); return; }
  if (confirm(text)) onYes();
}

loadCart();
updateCartBadge();

document.getElementById("cart-clear-btn").addEventListener("click", function() {
  if (!cart.length) return;
  askConfirm(t("cart_clear_confirm"), clearCart);
});

/* ---------------- Загрузка каталога ---------------- */
const catalog = { stars: [], premium: [], simple_gift: [], nft_rent: [] };
let currentCategory = "stars";
let currentTab = "asosiy";
let currentRentSort = "recently_touch";
let currentRentCollection = null;
let currentRentCollectionName = null;

const STARS_MAX_PACKAGE = 150000;

async function loadCatalog(cat, forceReload) {
  if (catalog[cat].length && !forceReload) return catalog[cat];
  const res = await fetch("/api/" + cat);
  if (!res.ok) throw new Error("bad response " + cat);
  let data = await res.json();
  // Пакеты Stars больше 150 000 не показываем: их никто не берёт, а карточки
  // с 10-значными числами ломают сетку. Нужна большая сумма — есть
  // «Boshqa miqdor».
  if (cat === "stars") data = data.filter(function(r) { return r && r.amount <= STARS_MAX_PACKAGE; });
  catalog[cat] = data.map(normalizeItem(cat));
  return catalog[cat];
}

async function fetchRentPage(cursor) {
  let url = "/api/nft_rent?sort_by=" + currentRentSort;
  if (currentRentCollection) url += "&collection_address=" + encodeURIComponent(currentRentCollection);
  if (cursor) url += "&cursor=" + encodeURIComponent(cursor);
  const res = await fetch(url);
  if (!res.ok) throw new Error("bad response nft_rent");
  const data = await res.json();
  const mapped = data.items.map(normalizeItem("nft_rent"));
  return { items: mapped, nextCursor: data.next_cursor };
}

function normalizeItem(cat) {
  return function(raw) {
    if (cat === "stars") return { kind: "stars", title: raw.amount.toLocaleString("ru-RU") + " Stars", price: raw.price_uzs, emoji: "⭐️", raw: raw };
    // title — геттер: прайс хранит «1 месяц», а показываем на выбранном языке,
    // и после смены языка название должно смениться без перезагрузки каталога.
    // В заказ по-прежнему уходит исходный raw.label — по нему бот сверяет цену.
    if (cat === "premium") return { kind: "premium", get title() { return premiumLabel(raw.label); }, price: raw.price_uzs, emoji: "👑", raw: raw };
    if (cat === "simple_gift") return { kind: "simple_gift", title: raw.star_count + "⭐", price: raw.price_uzs, emoji: raw.sticker_emoji || "🎁", image: raw.image_url || null, raw: raw };
    if (cat === "nft_rent") return { kind: "nft_rent", title: raw.name, price: raw.price_per_day_uzs_with_markup, emoji: pickGiftEmoji(raw.name), image: raw.image_url, previewUrl: raw.preview_url, raw: raw };
  };
}

// Фото у API нет, подбираем эмодзи по названию для узнаваемости карточки
function pickGiftEmoji(name) {
  const n = (name || "").toLowerCase();
  if (n.includes("pepe")) return "🐸";
  if (n.includes("cat")) return "🐱";
  if (n.includes("bird")) return "🐦";
  if (n.includes("wine")) return "🍷";
  if (n.includes("hat") || n.includes("cap")) return "🎩";
  if (n.includes("watch")) return "⌚️";
  if (n.includes("ring")) return "💍";
  if (n.includes("bear")) return "🧸";
  if (n.includes("rose") || n.includes("flower")) return "🌹";
  if (n.includes("crown")) return "👑";
  return "🖼";
}

async function renderItems() {
  const grid = document.getElementById("products-grid");
  // Stars — компактные карточки с цифрой, помещается 3 в ряд.
  // Gift — картинка главный герой, ей нужно место: 2 в ряд.
  grid.className = currentCategory === "stars"
    ? "p-4 grid grid-cols-3 gap-3 max-w-sm mx-auto"
    : "p-4 grid grid-cols-2 gap-3 max-w-sm mx-auto";

  if (currentCategory === "premium") { await renderPremiumList(); return; }
  document.getElementById("premium-list").classList.add("hidden");
  grid.classList.remove("hidden");

  grid.innerHTML = skeletonHTML(6, currentCategory === "stars" ? "h-[104px]" : "h-[168px]");
  let items;
  try { items = await loadCatalog(currentCategory); }
  catch (e) { grid.innerHTML = '<p class="col-span-full text-center text-xs text-gray-500 py-8">' + t("empty") + '</p>'; return; }

  if (!items.length) { grid.innerHTML = '<p class="col-span-full text-center text-xs text-gray-500 py-8">' + t("empty") + '</p>'; return; }

  const customCardHTML = currentCategory === "stars"
    ? '<div id="stars-custom-card" class="glass-card press rounded-[20px] p-3 flex flex-col items-center justify-center text-center cursor-pointer min-h-[104px]" style="border-style: dashed;">' +
        '<div class="text-2xl">✏️</div>' +
        '<div class="text-[10px] text-gray-300 mt-1.5 leading-tight">' + t("custom_amount") + '</div>' +
        '<div class="text-[9px] text-gray-500 mt-0.5">' + t("custom_amount_hint") + '</div>' +
      '</div>'
    : "";

  grid.innerHTML = items.map(function(it, i) {
    const isPopularStars = currentCategory === "stars" && it.raw && it.raw.amount === 1000;
    const popularBadge = isPopularStars
      ? '<span class="badge-popular absolute -top-1.5 right-1.5 pill-gold text-[8px] font-bold px-2 py-0.5 rounded-full leading-none z-10">' + t("badge_popular") + '</span>'
      : "";
    const cardBase = '<div data-i="' + i + '" class="product-card glass-card press rounded-[20px] cursor-pointer relative overflow-visible' + (isPopularStars ? " card-popular" : "") + '">';

    // STARS: героем делаем само число, а не одинаковую жёлтую звезду —
    // раньше 15 карточек выглядели идентично, различал только мелкий текст.
    // Плюс показываем цену за 1 звезду: чем больше пакет, тем она ниже,
    // так человек видит выгоду и берёт пакет побольше.
    if (currentCategory === "stars") {
      const amount = it.raw.amount;
      const perStar = Math.round(it.price / amount);
      return cardBase +
        popularBadge +
        '<div class="p-3 flex flex-col items-center text-center">' +
          '<div class="flex items-baseline gap-0.5 mt-1">' +
            '<span class="text-[22px] font-black text-white leading-none tracking-tight">' + amount.toLocaleString("ru-RU").replace(/,/g, " ") + '</span>' +
            ceHTML(CE_STARS, 15, "⭐️") +
          '</div>' +
          '<div class="text-[11px] font-bold text-neon-yellow mt-2">' + fmtUZS(it.price) + '</div>' +
          '<div class="text-[9px] text-gray-500 mt-0.5">' + perStar + " " + t("per_star") + '</div>' +
        '</div>' +
      '</div>';
    }

    // GIFT: картинка — главный герой, ей отдаём всю ширину карточки.
    const iconHTML = it.image
      ? '<img src="' + it.image + '" loading="lazy" class="w-full h-full object-cover animated-gift" onerror="this.style.display=\'none\'; this.nextElementSibling.style.display=\'flex\';" />' +
        '<div class="absolute inset-0 hidden items-center justify-center text-4xl animated-gift">' + it.emoji + '</div>'
      : '<div class="absolute inset-0 flex items-center justify-center text-4xl animated-gift">' + it.emoji + '</div>';
    return cardBase +
      popularBadge +
      '<div class="relative w-full aspect-square rounded-t-[20px] overflow-hidden" style="background: radial-gradient(circle at 50% 35%, rgba(255,255,255,0.07), transparent 70%);">' + iconHTML + '</div>' +
      '<div class="px-2 py-2.5 text-center">' +
        '<div class="text-[10px] text-gray-400 leading-tight">' + it.title + '</div>' +
        '<div class="text-[11px] font-bold text-neon-yellow mt-1">' + fmtUZS(it.price) + '</div>' +
      '</div>' +
    '</div>';
  }).join("") + customCardHTML;

  hydrateCustomEmoji(grid);

  const customCard = document.getElementById("stars-custom-card");
  if (customCard) customCard.addEventListener("click", openCustomStarsModal);

  Array.prototype.forEach.call(grid.querySelectorAll(".product-card"), function(card) {
    card.addEventListener("click", function() { openModal(items[Number(card.dataset.i)]); });
  });

}


/* ---------------- Ijara (аренда) — с догрузкой страниц ---------------- */
let rentNextCursor = null;
let rentLoadingMore = false;

// Карточка аренды в стиле MarketApp: картинка с бейджем срока, название,
// цена + "so'm" + "· N kun", кнопка "Ijaraga olish". Кликается ВСЯ карточка,
// не только кнопка.
function rentCardHTML(it, i) {
  const imgBlock = it.image
    ? '<img src="' + it.image + '" loading="lazy" class="absolute inset-0 w-full h-full object-cover" onerror="this.style.display=\'none\'; this.nextElementSibling.style.display=\'flex\';" />' +
      '<div class="absolute inset-0 hidden items-center justify-center"><span class="text-6xl animated-gift">' + it.emoji + '</span></div>'
    : '<div class="absolute inset-0 flex items-center justify-center"><span class="text-6xl animated-gift">' + it.emoji + '</span></div>';

  const discountBadge = it.raw.discount_per_day > 0
    ? '<span class="absolute top-2 right-2 bg-red-500/80 backdrop-blur text-[10px] font-bold px-2 py-1 rounded-lg text-white">-' + it.raw.discount_per_day + '%</span>'
    : '';

  const numberBadge = it.raw.number
    ? '<span class="text-[11px] text-gray-500 font-mono">#' + it.raw.number + '</span>'
    : '';

  return '<div data-i="' + i + '" class="rent-card glass-card press rounded-[22px] overflow-hidden flex flex-col cursor-pointer">' +
    '<div class="rent-img relative h-44">' +
      imgBlock +
      discountBadge +
      '<span class="absolute bottom-2 right-2 bg-black/50 backdrop-blur-md text-[10px] font-semibold px-2 py-1 rounded-lg text-gray-200 border border-white/10">' +
        t("rent_from") + ' ' + it.raw.min_duration_days + '-' + it.raw.max_duration_days + ' ' + t("rent_days_suffix") +
      '</span>' +
    '</div>' +
    '<div class="p-3.5 flex flex-col gap-1.5">' +
      '<div class="flex items-center justify-between">' +
        '<div class="text-sm font-bold text-white truncate">' + it.title + '</div>' +
        numberBadge +
      '</div>' +
      '<div class="text-sm font-bold text-neon-yellow">' + fmtUZS(it.price) + ' <span class="text-[11px] text-gray-400 font-normal">· 1 ' + t("rent_days_suffix") + '</span></div>' +
      '<button data-i="' + i + '" class="rent-btn press mt-2 w-full py-3 rounded-2xl btn-primary font-semibold text-white text-sm">' + t("rent_btn") + '</button>' +
    '</div>' +
  '</div>';
}

function renderRentGrid() {
  const grid = document.getElementById("ijara-grid");
  const items = catalog.nft_rent;

  grid.innerHTML = items.map(function(it, i) { return rentCardHTML(it, i); }).join("");

  Array.prototype.forEach.call(grid.querySelectorAll(".rent-card"), function(card) {
    card.addEventListener("click", function(e) {
      if (e.target.closest(".rent-btn")) return; // кнопка сама откроет — избегаем двойного триггера
      openModal(items[Number(card.dataset.i)]);
    });
  });
  Array.prototype.forEach.call(grid.querySelectorAll(".rent-btn"), function(btn) {
    btn.addEventListener("click", function() { openModal(items[Number(btn.dataset.i)]); });
  });

  renderLoadMoreButton();
}

function renderLoadMoreButton() {
  const existing = document.getElementById("rent-load-more");
  if (existing) existing.remove();

  if (!rentNextCursor) return;

  const btn = document.createElement("button");
  btn.id = "rent-load-more";
  btn.className = "col-span-2 mt-1 py-3.5 rounded-2xl pill press text-sm font-semibold";
  btn.textContent = t("load_more");
  btn.addEventListener("click", loadMoreRent);
  document.getElementById("ijara-grid").appendChild(btn);
}

async function loadMoreRent() {
  if (rentLoadingMore) return;
  rentLoadingMore = true;
  const btn = document.getElementById("rent-load-more");
  if (btn) { btn.textContent = "..."; btn.disabled = true; }

  try {
    const page = await fetchRentPage(rentNextCursor);
    catalog.nft_rent = catalog.nft_rent.concat(page.items);
    rentNextCursor = page.nextCursor;
    renderRentGrid();
  } catch (e) { /* тихо игнорируем — кнопка просто останется */ }

  rentLoadingMore = false;
}

async function renderIjara(reset) {
  const grid = document.getElementById("ijara-grid");

  if (reset || !catalog.nft_rent.length) {
    grid.innerHTML = skeletonHTML(4, "h-80");
    catalog.nft_rent = [];
    rentNextCursor = null;

    try {
      const page = await fetchRentPage(null);
      catalog.nft_rent = page.items;
      rentNextCursor = page.nextCursor;
    } catch (e) {
      grid.innerHTML = '<p class="col-span-2 text-center text-xs text-gray-500 py-8">' + t("empty") + '</p>';
      return;
    }
  }

  if (!catalog.nft_rent.length) { grid.innerHTML = '<p class="col-span-2 text-center text-xs text-gray-500 py-8">' + t("empty") + '</p>'; return; }
  renderRentGrid();
}

document.getElementById("rent-sort-select").addEventListener("change", function(e) {
  currentRentSort = e.target.value;
  renderIjara(true);
});

/* ---------------- Фильтр по коллекции ---------------- */
let _collectionsCache = null;

document.getElementById("rent-collection-btn").addEventListener("click", openCollectionModal);
document.getElementById("collection-close-btn").addEventListener("click", closeCollectionModal);
document.getElementById("collection-modal").addEventListener("click", function(e) {
  if (e.target === document.getElementById("collection-modal")) closeCollectionModal();
});

async function openCollectionModal() {
  const modal = document.getElementById("collection-modal");
  const content = document.getElementById("collection-content");
  const listEl = document.getElementById("collection-list");

  modal.classList.remove("hidden");
  requestAnimationFrame(function() {
    modal.classList.remove("opacity-0");
    content.classList.remove("translate-y-full");
  });

  if (!_collectionsCache) {
    listEl.innerHTML = skeletonHTML(4, "h-12");
    try {
      const res = await fetch("/api/rent_collections");
      _collectionsCache = await res.json();
    } catch (e) { _collectionsCache = []; }
  }

  paintCollectionList();
}

function paintCollectionList() {
  const listEl = document.getElementById("collection-list");
  const rows = [{ name: t("collection_all"), address: null, image: null }].concat(_collectionsCache || []);

  listEl.innerHTML = rows.map(function(c) {
    const selected = c.address === currentRentCollection;
    const iconHTML = c.image
      ? '<img src="' + c.image + '" alt="" class="w-8 h-8 rounded-lg object-cover flex-shrink-0" onerror="this.replaceWith(Object.assign(document.createElement(\'div\'),{className:\'w-8 h-8 rounded-lg bg-white/10 flex-shrink-0\'}))">'
      : '<div class="w-8 h-8 rounded-lg bg-white/10 flex-shrink-0"></div>';
    return '<div data-address="' + (c.address || "") + '" data-name="' + c.name + '" class="collection-row press flex items-center gap-3 rounded-2xl p-3 cursor-pointer border ' +
      (selected ? "bg-neon-blue/10 border-neon-blue/50" : "bg-white/[0.04] border-white/[0.08]") + '">' +
      iconHTML +
      '<span class="text-sm font-medium text-white flex-1">' + c.name + '</span>' +
      (selected ? '<span class="text-neon-blue text-sm">✓</span>' : '') +
    '</div>';
  }).join("");

  Array.prototype.forEach.call(listEl.querySelectorAll(".collection-row"), function(row) {
    row.addEventListener("click", function() {
      currentRentCollection = row.dataset.address || null;
      currentRentCollectionName = currentRentCollection ? row.dataset.name : null;
      document.getElementById("rent-collection-label").textContent = currentRentCollectionName || t("collection_all");
      closeCollectionModal();
      renderIjara(true);
    });
  });
}

function closeCollectionModal() {
  const modal = document.getElementById("collection-modal");
  const content = document.getElementById("collection-content");
  content.classList.add("translate-y-full");
  modal.classList.add("opacity-0");
  setTimeout(function() { modal.classList.add("hidden"); }, 300);
}

/* ---------------- Premium: список с радио-выбором ---------------- */
let selectedPremiumIndex = 0;

async function renderPremiumList() {
  document.getElementById("products-grid").classList.add("hidden");
  const container = document.getElementById("premium-list");
  container.classList.remove("hidden");
  // Крупный эмодзи в шапке лежит прямо в index.html — оживляем его здесь,
  // когда экран Premium впервые показан.
  hydrateCustomEmoji(container);

  const optionsEl = document.getElementById("premium-options");
  optionsEl.innerHTML = skeletonHTML(3, "h-16");

  let items;
  try { items = await loadCatalog("premium"); }
  catch (e) { optionsEl.innerHTML = '<p class="text-center text-xs text-gray-500 py-8">' + t("empty") + '</p>'; return; }

  if (!items.length) { optionsEl.innerHTML = '<p class="text-center text-xs text-gray-500 py-8">' + t("empty") + '</p>'; return; }
  if (selectedPremiumIndex >= items.length) selectedPremiumIndex = 0;

  function paint() {
    // "Популярный" — на тариф с самым долгим сроком (обычно 12 месяцев).
    // Если совпадений несколько (напр. "12 месяцев" и "12 месяцев как подарок"),
    // помечаем только первый по списку, чтобы бейдж не задублировался.
    const durationOf = function(title) {
      const m = /^(\d+)/.exec(title || "");
      return m ? parseInt(m[1], 10) : 0;
    };
    const maxDuration = Math.max.apply(null, items.map(function(it) { return durationOf(it.title); }));
    let popularMarked = false;

    optionsEl.innerHTML = items.map(function(it, i) {
      const selected = i === selectedPremiumIndex;
      const isPopular = !popularMarked && maxDuration > 0 && durationOf(it.title) === maxDuration;
      if (isPopular) popularMarked = true;
      const popularBadge = isPopular
        ? '<span class="badge-popular absolute -top-2 right-3 pill-gold text-[9px] font-bold px-2 py-0.5 rounded-full leading-none">' + t("badge_popular") + '</span>'
        : "";
      return '<div data-i="' + i + '" class="premium-option press flex items-center justify-between gap-3 rounded-2xl p-4 cursor-pointer border relative ' +
        (selected ? "bg-neon-blue/10 border-neon-blue/50" : (isPopular ? "bg-white/[0.04] card-popular" : "bg-white/[0.04] border-white/[0.08]")) + '">' +
        popularBadge +
        '<div class="flex items-center gap-3 min-w-0">' +
          '<span class="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ' + (selected ? "border-neon-blue" : "border-gray-600") + '">' +
            (selected ? '<span class="w-2.5 h-2.5 rounded-full bg-neon-blue"></span>' : "") +
          '</span>' +
          ceHTML(CE_PREMIUM, 20, "💎") +
          '<span class="text-[13.5px] font-semibold text-white leading-tight">' + it.title + '</span>' +
        '</div>' +
        '<span class="text-[13.5px] font-bold text-neon-yellow flex-shrink-0">' + fmtUZS(it.price) + '</span>' +
      '</div>';
    }).join("");

    hydrateCustomEmoji(optionsEl);

    Array.prototype.forEach.call(optionsEl.querySelectorAll(".premium-option"), function(row) {
      row.addEventListener("click", function() {
        selectedPremiumIndex = Number(row.dataset.i);
        paint();
        updatePremiumCta();
      });
    });
  }

  function updatePremiumCta() {
    const btn = document.getElementById("premium-cta-btn");
    const it = items[selectedPremiumIndex];
    btn.textContent = t("premium_cta").replace("{item}", it.title);
    btn.onclick = function() { openModal(it); };
  }

  paint();
  updatePremiumCta();
}

function skeletonHTML(n, heightClass) {
  let out = "";
  for (let i = 0; i < n; i++) out += '<div class="skeleton rounded-2xl ' + heightClass + '"></div>';
  return out;
}

function setCategory(cat) {
  currentCategory = cat;
  Array.prototype.forEach.call(document.querySelectorAll(".cat-btn"), function(btn) {
    btn.className = "cat-btn press px-4 py-2 rounded-full pill text-xs whitespace-nowrap";
  });
  document.getElementById("cat-" + cat).className = "cat-btn press px-4 py-2 rounded-full pill-gold text-xs font-semibold whitespace-nowrap";
  renderItems();
}

function switchTab(tab) {
  currentTab = tab;
  ["asosiy","ijara","savat","tarix","top","profil"].forEach(function(x) {
    document.getElementById("view-" + x).classList.add("view-hidden");
  });
  document.getElementById("view-" + tab).classList.remove("view-hidden");
  Array.prototype.forEach.call(document.querySelectorAll(".nav-btn"), function(btn) {
    btn.classList.remove("text-neon-blue"); btn.classList.add("text-gray-500");
  });
  document.getElementById("tab-" + tab).classList.remove("text-gray-500");
  document.getElementById("tab-" + tab).classList.add("text-neon-blue");
  if (tab === "ijara") { renderIjara(); renderMyRentals(); }
  if (tab === "savat") renderCart();
  if (tab === "tarix") renderHistory();
  if (tab === "top") renderLeaderboard(currentTopPeriod);
  if (tab === "profil") { initProfile(); renderProfileStats(); loadBalance(); }
}

/* ---------------- Модалка оплаты ---------------- */
let activeItem = null;
let recipientType = "self";
let rentDays = 1;

const modal = document.getElementById("payment-modal");
const modalContent = document.getElementById("payment-content");

function setRecipient(type) {
  recipientType = type;
  const btnSelf = document.getElementById("rec-self");
  const btnFriend = document.getElementById("rec-friend");
  const userField = document.getElementById("username-field");
  const activeCls = "flex-1 py-1.5 rounded-lg bg-white/10 font-semibold text-xs text-white shadow-inner";
  const inactiveCls = "flex-1 py-1.5 rounded-lg text-gray-400 font-semibold text-xs";

  if (type === "self") {
    btnSelf.className = activeCls; btnFriend.className = inactiveCls;
    userField.classList.add("hidden");
  } else {
    btnFriend.className = activeCls; btnSelf.className = inactiveCls;
    userField.classList.remove("hidden");
    showRecentRecipientChip();
  }
  document.getElementById("modal-error").classList.add("hidden");
}

function showRecentRecipientChip() {
  let recent = null;
  try { recent = localStorage.getItem("oson_last_recipient"); } catch (e) { /* недоступно — просто не покажем чип */ }

  const chip = document.getElementById("recent-recipient-chip");
  const btn = document.getElementById("recent-recipient-btn");
  if (!recent) { chip.classList.add("hidden"); return; }

  btn.textContent = recent;
  btn.onclick = function() { document.getElementById("gift-username").value = recent; };
  chip.classList.remove("hidden");
}

function saveRecentRecipient(username) {
  try { localStorage.setItem("oson_last_recipient", username); } catch (e) { /* тихо игнорируем */ }
}

function stepDays(delta) {
  if (!activeItem) return;
  let min, max;
  if (activeItem.kind === "nft_rent") {
    min = activeItem.raw.min_duration_days; max = activeItem.raw.max_duration_days;
  } else if (activeItem.kind === "nft_rent_extend") {
    min = activeItem.raw.min_days; max = activeItem.raw.max_days;
  } else {
    return;
  }
  const next = rentDays + delta;
  if (next < min || next > max) return;
  rentDays = next;
  document.getElementById("days-value").textContent = rentDays;
  document.getElementById("modal-price").textContent = fmtUZS(activeItem.price * rentDays);
  if (activeItem.kind === "nft_rent_extend") updateExtendUntilLabel();
}

/** Показывает, до какой даты сдвинется аренда при выбранном числе дней. */
function updateExtendUntilLabel() {
  const el = document.getElementById("extend-note");
  if (!el || !activeItem || activeItem.kind !== "nft_rent_extend") return;
  const ends = new Date(String(activeItem.raw.ends_at).replace(" ", "T") + "Z");
  const newEnds = new Date(ends.getTime() + rentDays * 86400000);
  el.innerHTML = t("rent_extend_note") +
    '<br><span class="text-white font-semibold">' + t("rent_extend_until") + ": " +
    newEnds.toISOString().slice(0, 10) + '</span>';
}

const GIFT_QTY_MAX = 10;
let giftQty = 1;
function stepGiftQty(delta) {
  if (!activeItem || activeItem.kind !== "simple_gift") return;
  const next = giftQty + delta;
  if (next < 1 || next > GIFT_QTY_MAX) return;
  giftQty = next;
  document.getElementById("gift-qty-value").textContent = giftQty;
  document.getElementById("modal-price").textContent = fmtUZS(activeItem.price * giftQty);
}

// Пределы одного заказа звёзд — столько принимает Fragment/MarketApp
// (их ошибка: "400: {'detail': '50 - 1,000,000'}"). Те же числа проверяются
// на сервере: здесь это удобство, там — защита.
const STARS_MIN = 50;
const STARS_MAX = 1000000;

let _starsRateCache = null;
async function openCustomStarsModal() {
  if (!_starsRateCache) {
    const res = await fetch("/api/stars_rate");
    _starsRateCache = await res.json();
  }
  const rate = _starsRateCache.rate_uzs_per_star;
  const qty = 50;
  openModal({
    kind: "stars_custom",
    title: t("custom_amount"),
    price: rate * qty,
    emoji: "✏️",
    raw: { rate: rate, qty: qty, min: _starsRateCache.min_stars || 50 },
  });
}

async function openModal(item) {
  activeItem = item;
  if (item.kind === "nft_rent") rentDays = item.raw.min_duration_days;
  else if (item.kind === "nft_rent_extend") rentDays = item.raw.min_days || 1;
  else rentDays = 1;

  document.getElementById("modal-title").textContent = item.title + (item.raw && item.raw.number ? " #" + item.raw.number : "");
  const emojiEl = document.getElementById("modal-emoji");
  if (item.image) {
    const bigClass = item.kind === "nft_rent" ? "w-24 h-24" : "w-10 h-10";
    emojiEl.className = "rounded-2xl overflow-hidden flex-shrink-0 animated-gift";
    emojiEl.innerHTML = '<img src="' + item.image + '" class="' + bigClass + ' rounded-2xl object-cover" onerror="this.parentElement.textContent=\'' + item.emoji + '\';" />';
  } else {
    emojiEl.className = "text-4xl animated-gift";
    // У Stars и Premium вместо обычного символа — анимированный эмодзи
    // Telegram; если он не загрузится, на его месте останется тот же символ.
    const ceId = (item.kind === "stars" || item.kind === "stars_custom") ? CE_STARS
               : (item.kind === "premium" ? CE_PREMIUM : null);
    if (ceId) {
      emojiEl.innerHTML = ceHTML(ceId, 40, item.emoji);
      hydrateCustomEmoji(emojiEl);
    } else {
      emojiEl.textContent = item.emoji;
    }
  }
  const isRentLike = item.kind === "nft_rent" || item.kind === "nft_rent_extend";
  document.getElementById("modal-price").textContent = fmtUZS(isRentLike ? item.price * rentDays : item.price);
  confirmedExactAmount = false;   // предупреждение про точную сумму — раз на товар
  document.getElementById("gift-message").value = "";
  document.getElementById("gift-username").value = "";
  document.getElementById("modal-error").classList.add("hidden");
  setRecipient("self");

  // Продление: получателя выбирать не нужно — подарок уже у клиента в профиле
  const isExtend = item.kind === "nft_rent_extend";
  document.getElementById("recipient-field").classList.toggle("hidden", isExtend);
  if (isExtend) document.getElementById("username-field").classList.add("hidden");
  const extendNote = document.getElementById("extend-note");
  extendNote.classList.toggle("hidden", !isExtend);
  if (isExtend) updateExtendUntilLabel();

  // "В корзину" — только для обычных товаров: у аренды свой срок и комиссия сети
  const addCartBtn = document.getElementById("add-to-cart-btn");
  const cartable = ["stars", "stars_custom", "premium", "simple_gift"].indexOf(item.kind) !== -1;
  addCartBtn.classList.toggle("hidden", !cartable);

  document.getElementById("rent-days-field").classList.toggle("hidden", !isRentLike);
  if (isRentLike) document.getElementById("days-value").textContent = rentDays;

  document.getElementById("gift-quantity-field").classList.toggle("hidden", item.kind !== "simple_gift");

  // Поздравление имеет смысл только у обычного подарка — оно уходит вместе с
  // ним. У звёзд и премиума текст отправить некуда, а поле сбивало с толку.
  document.getElementById("message-field").classList.toggle("hidden", item.kind !== "simple_gift");
  if (item.kind === "simple_gift") {
    giftQty = 1;
    document.getElementById("gift-qty-value").textContent = giftQty;
    document.getElementById("modal-price").textContent = fmtUZS(item.price * giftQty);
  }

  const starsCustomField = document.getElementById("stars-custom-field");
  const starsCustomInput = document.getElementById("stars-custom-input");
  starsCustomField.classList.toggle("hidden", item.kind !== "stars_custom");
  if (item.kind === "stars_custom") {
    starsCustomInput.value = item.raw.qty || STARS_MIN;
    starsCustomInput.oninput = function() {
      let qty = parseInt(starsCustomInput.value, 10);
      if (isNaN(qty) || qty < STARS_MIN) qty = STARS_MIN;
      // Fragment больше миллиона за раз не продаёт — не даём набрать сумму,
      // которую потом невозможно будет выполнить. Поле поправляем прямо на
      // экране, чтобы человек видел, на чём его ограничили.
      if (qty > STARS_MAX) {
        qty = STARS_MAX;
        starsCustomInput.value = STARS_MAX;
      }
      item.raw.qty = qty;
      item.price = qty * item.raw.rate;
      document.getElementById("modal-price").textContent = fmtUZS(item.price);
    };
  }

  const previewBtn = document.getElementById("preview-gift-btn");
  if (item.kind === "nft_rent" && item.previewUrl) {
    previewBtn.classList.remove("hidden");
    previewBtn.onclick = function() {
      if (tg && tg.openTelegramLink) tg.openTelegramLink(item.previewUrl);
      else window.open(item.previewUrl, "_blank");
    };
  } else {
    previewBtn.classList.add("hidden");
    previewBtn.onclick = null;
  }

  // Реквизитов в карточке товара больше нет: человек видел карту ДО заказа,
  // платил по ней, а потом жал кнопку — и бот заводил ЕЩЁ один заказ с новой
  // суммой. Отсюда и брались "10 заказов на один чек". Теперь карта и точная
  // сумма показываются только на экране уже созданного заказа.

  if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred("light");
  modal.classList.remove("hidden");
  requestAnimationFrame(function() {
    modal.classList.remove("opacity-0");
    modalContent.classList.remove("translate-y-full");
  });
}

function closeModal() {
  if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); // убрать клавиатуру
  modalContent.classList.add("translate-y-full");
  modal.classList.add("opacity-0");
  setTimeout(function() { modal.classList.add("hidden"); }, 300);
}

// Клик по затемнённому фону вокруг шторки — тоже закрывает
modal.addEventListener("click", function(e) {
  if (e.target === modal) closeModal();
});

/* ---------------- Свайп вниз для закрытия шторки ---------------- */
(function enableSwipeToDismiss() {
  const handle = document.getElementById("sheet-handle");
  let startY = 0, currentY = 0, dragging = false;

  function onStart(y) {
    dragging = true;
    startY = y;
    currentY = y;
    modalContent.style.transition = "none";
  }
  function onMove(y) {
    if (!dragging) return;
    currentY = y;
    const delta = Math.max(0, currentY - startY);
    modalContent.style.transform = "translateY(" + delta + "px)";
  }
  function onEnd() {
    if (!dragging) return;
    dragging = false;
    modalContent.style.transition = "";
    const delta = currentY - startY;
    modalContent.style.transform = "";
    if (delta > 90) {
      closeModal();
    }
  }

  handle.addEventListener("touchstart", function(e) { onStart(e.touches[0].clientY); }, { passive: true });
  handle.addEventListener("touchmove", function(e) { onMove(e.touches[0].clientY); }, { passive: true });
  handle.addEventListener("touchend", onEnd);

  // На всякий случай (десктоп/тестирование) — те же события мышью
  handle.addEventListener("mousedown", function(e) { onStart(e.clientY); });
  document.addEventListener("mousemove", function(e) { if (dragging) onMove(e.clientY); });
  document.addEventListener("mouseup", onEnd);
})();

let _paymentInfoCache = null;
async function getPaymentInfo() {
  if (_paymentInfoCache) return _paymentInfoCache;
  const res = await fetch("/api/payment_info");
  _paymentInfoCache = await res.json();
  return _paymentInfoCache;
}

function copyCard() {
  getPaymentInfo().then(function(p) {
    navigator.clipboard.writeText((p.card_number || "").replace(/\s/g, ""));
    if (tg && tg.showAlert) tg.showAlert(t("copied")); else alert(t("copied"));
  });
}

function openTgUsername(username) {
  if (!username) return;
  if (tg && tg.openTelegramLink) tg.openTelegramLink("https://t.me/" + username);
  else window.open("https://t.me/" + username, "_blank");
}

async function initSupportInfo() {
  try {
    const res = await fetch("/api/support_info");
    const info = await res.json();

    if (info.operator_username) {
      document.getElementById("operator-handle").textContent = "@" + info.operator_username;
      document.getElementById("row-operator").onclick = function() { openTgUsername(info.operator_username); };
    }
    if (info.channel_username) {
      const row = document.getElementById("row-channel");
      row.classList.remove("hidden"); row.classList.add("flex");
      document.getElementById("channel-handle").textContent = "@" + info.channel_username;
      row.onclick = function() { openTgUsername(info.channel_username); };
    }
    if (info.orders_channel_username) {
      const row = document.getElementById("row-orders");
      row.classList.remove("hidden"); row.classList.add("flex");
      document.getElementById("orders-handle").textContent = "@" + info.orders_channel_username;
      row.onclick = function() { openTgUsername(info.orders_channel_username); };
    }
  } catch (e) { /* тихо игнорируем — строки просто останутся скрытыми/пустыми */ }
}

/* ---------------- Отправка заказа боту ---------------- */
// Защита от двойного заказа: пока предыдущий запрос ещё летит на сервер,
// повторные нажатия "To'ladim" игнорируются. Без этого двойной тап (частая
// вещь на телефоне, особенно при медленном интернете) создавал ДВА заказа.
let orderInFlight = false;
// Показали ли уже предупреждение про точную сумму по текущему товару.
let confirmedExactAmount = false;

function sendPaymentInfo() {
  if (orderInFlight) return;

  // Предупреждение ДО оформления. Именно на этом шаге теряются деньги:
  // человек переводит круглое число вместо выданной суммы, автоподтверждение
  // не срабатывает, заказ зависает. Один экран здесь дешевле, чем разбор
  // каждого такого платежа вручную.
  if (!confirmedExactAmount) {
    if (tg && tg.showPopup) {
      // ВАЖНО: колбэк срабатывает и когда окно просто закрыли (кнопкой «назад»
      // или свайпом) — тогда id приходит пустым. Без этой проверки человек,
      // который передумал, всё равно получал оформленный заказ.
      tg.showPopup(
        {
          message: t("buy_confirm"),
          buttons: [
            { id: "go", type: "default", text: t("modal_buy") },
            { id: "no", type: "cancel" },
          ],
        },
        function(pressed) {
          if (pressed !== "go") return;
          confirmedExactAmount = true;
          sendPaymentInfo();
        }
      );
      return;
    }
    if (tg && tg.showConfirm) {
      tg.showConfirm(t("buy_confirm"), function(ok) {
        if (!ok) return;
        confirmedExactAmount = true;
        sendPaymentInfo();
      });
      return;
    }
    // Совсем старый клиент Telegram: окна нет — показываем предупреждение
    // прямо в карточке и ждём второго нажатия.
    confirmedExactAmount = true;
    const warnEl = document.getElementById("modal-error");
    if (warnEl) {
      warnEl.textContent = t("flow_exact_warn");
      warnEl.classList.remove("hidden");
    }
    return;
  }

  const errorEl = document.getElementById("modal-error");
  let friendUsername = document.getElementById("gift-username").value.trim();

  if (recipientType === "friend") {
    if (!friendUsername) { errorEl.textContent = t("err_username"); errorEl.classList.remove("hidden"); return; }
    if (friendUsername.charAt(0) !== "@") friendUsername = "@" + friendUsername;
  }

  // Юзернейм для "себе" достаём на СЕРВЕРЕ (бот всегда точно знает,
  // кто написал) — клиентский tg.initDataUnsafe не всегда надёжен
  // (кэш вебвью и т.п.), поэтому здесь ничего не проверяем и не блокируем.
  const item = activeItem;
  const message = document.getElementById("gift-message").value.trim();
  const recipient = recipientType === "self" ? "" : friendUsername;

  const payload = {
    category: item.kind,
    recipient: recipient,
    recipient_type: recipientType,
    note: message || undefined,
  };

  if (item.kind === "stars") {
    payload.item_name = item.raw.amount + " звёзд"; payload.price = item.raw.price_uzs; payload.quantity = item.raw.amount;
  } else if (item.kind === "stars_custom") {
    payload.item_name = item.raw.qty + " звёзд"; payload.price = item.price; payload.quantity = item.raw.qty;
  } else if (item.kind === "premium") {
    payload.item_name = "Premium — " + item.raw.label; payload.price = item.raw.price_uzs; payload.quantity = 1;
  } else if (item.kind === "simple_gift") {
    payload.item_name = "Подарок " + item.emoji + " (" + item.raw.star_count + "⭐) x" + giftQty;
    payload.price = item.raw.price_uzs * giftQty;
    payload.quantity = giftQty;
    payload.gift_id = item.raw.id;
  } else if (item.kind === "nft_rent") {
    // БАГ БЫЛ ЗДЕСЬ: цену для аренды не клали в payload вообще, и экран после
    // оформления показывал "0 so'm". Точную сумму (с комиссией сети) всё равно
    // считает сервер, но и здесь она теперь не нулевая.
    payload.price = item.price * rentDays;
    payload.item_name = item.raw.name; payload.nft_address = item.raw.nft_address;
    payload.base_price_per_day_gram = item.raw.base_price_per_day_gram;
    payload.min_days = item.raw.min_duration_days; payload.max_days = item.raw.max_duration_days;
    payload.days = rentDays;
  } else if (item.kind === "nft_rent_extend") {
    // Продление: серверу достаточно адреса гифта и числа дней — цену и права
    // на эту аренду он берёт из собственной базы, данным клиента тут не верим.
    payload.price = item.price * rentDays;
    payload.item_name = item.raw.item_name;
    payload.nft_address = item.raw.nft_address;
    payload.days = rentDays;
  }

  if (recipientType === "friend" && friendUsername) saveRecentRecipient(friendUsername);

  // БЫЛО: tg.sendData(...) — работает ТОЛЬКО если мини-апп открыт через
  // растянутую кнопку клавиатуры ("Do'konni ochish"). Через компактную Menu
  // Button ("Открыть" у поля ввода) sendData() вообще не доходит до бота —
  // это ограничение самого Telegram, не баг. Поэтому теперь заказ уходит
  // обычным HTTP-запросом с подписью initData (её бот проверяет на сервере
  // той же функцией, что и для Tarix/TOP/Profil) — работает одинаково
  // из любой точки входа.
  submitOrder(payload);
}

async function submitOrder(payload) {
  const errorEl = document.getElementById("modal-error");
  const payBtn = document.querySelector('[onclick="sendPaymentInfo()"]');
  const base = await getShopApiUrl();

  if (!base || !tg || !tg.initData) {
    orderInFlight = false;
    if (tg && tg.sendData) {
      // Резервный путь на случай, если публичный API ещё не настроен
      // (SHOP_API_URL пустой) — старый способ хотя бы не роняет заказ совсем.
      // Telegram сам закрывает WebApp после sendData() — это его поведение,
      // мы это не контролируем.
      tg.sendData(JSON.stringify(payload));
      tg.close();
    } else {
      alert("DEMO (Telegram ichida ochish kerak): " + JSON.stringify(payload, null, 2));
    }
    return;
  }

  errorEl.classList.add("hidden");
  orderInFlight = true;
  const prevBtnHtml = payBtn ? payBtn.innerHTML : null;
  if (payBtn) {
    payBtn.disabled = true;
    payBtn.innerHTML = '<span class="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full align-middle" style="animation: spin .7s linear infinite;"></span>';
  }

  try {
    // БЫЛО: /public/create_order — бот присылал в ЧАТ вопрос «Всё верно?»,
    // и покупка обрывалась на середине: человек должен был выйти из витрины
    // в переписку. Теперь заказ создаётся сразу, а витрина сама ведёт клиента
    // по этапам (оплата -> проверка -> выполнение -> готово).
    const res = await fetch(base + "/public/place_order", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData: tg.initData, payload: payload }),
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      errorEl.textContent = data.error === "no_username" ? t("cart_err_no_username")
        : data.error === "stars_limit" ? t("cart_err_stars_limit")
        : data.error === "too_many_pending" ? t("cart_err_too_many")
        : data.error === "banned" ? t("err_banned")
        : (data.error || "Xatolik yuz berdi, qayta urinib ko'ring.");
      errorEl.classList.remove("hidden");
      return;
    }
    openOrderFlow({ order_id: data.order_id }, {
      order_id: data.order_id,
      item_name: data.item_name || payload.item_name,
      recipient: data.recipient || payload.recipient,
      price_uzs: data.price_uzs,
      pay_amount: data.pay_amount,
      card_number: data.card_number,
      card_holder: data.card_holder,
    });
  } catch (e) {
    errorEl.textContent = "Server bilan bog'lanib bo'lmadi, qayta urinib ko'ring.";
    errorEl.classList.remove("hidden");
  } finally {
    orderInFlight = false;
    if (payBtn) {
      payBtn.disabled = false;
      payBtn.innerHTML = prevBtnHtml;
    }
  }
}

function launchSuccessConfetti() {
  const box = document.getElementById("success-confetti");
  if (!box) return;
  const colors = ["#10B981", "#D9B45B", "#2AABEE", "#8E8CD8", "#F0DFA0"];
  let html = "";
  for (let i = 0; i < 20; i++) {
    const angle = (Math.PI * 2 * i) / 20 + Math.random() * 0.3;
    const dist = 70 + Math.random() * 60;
    html += '<span class="confetti-piece" style="--tx:' + Math.round(Math.cos(angle) * dist) +
      'px; --ty:' + Math.round(Math.sin(angle) * dist) + 'px; --rot:' + Math.round((Math.random() - 0.5) * 520) +
      'deg; background:' + colors[i % colors.length] + '; animation-delay:' + Math.round(Math.random() * 120) + 'ms;"></span>';
  }
  box.innerHTML = html;
}

/* ================= ЖИВОЙ СТАТУС ЗАКАЗА =================
 * Раньше витрина показывала «заказ принят» и на этом заканчивалась: всё
 * остальное (оплата, подтверждение, выполнение) человек видел только в чате
 * бота. Теперь весь путь заказа проходит здесь — экран сам опрашивает сервер
 * и переключает этапы: ждём оплату -> проверяем чек -> выполняется -> готово.
 */
const FLOW_POLL_MS = 5000;
let flowOrder = null;      // {order_id, cart_id}
let flowStatus = null;     // последний ответ сервера
let flowSignature = null;  // отпечаток последнего отрисованного состояния
let flowTimer = null;
let flowTipTimer = null;

const FLOW_STEP_BY_STATUS = {
  awaiting_payment: 1, payment_review: 2, paid: 3, fulfilling: 3, completed: 4, rejected: 0,
};

function openOrderFlow(ref, optimistic) {
  flowOrder = { order_id: ref.order_id || null, cart_id: ref.cart_id || null };
  flowSignature = null;
  closeModal();
  document.getElementById("order-flow-screen").classList.remove("hidden");

  // Первый кадр рисуем сразу из того, что уже знает витрина, чтобы экран не
  // мигал пустотой, пока летит первый запрос статуса.
  if (optimistic) {
    flowStatus = Object.assign({ status: "awaiting_payment", items: [] }, optimistic);
    renderOrderFlow();
  }
  pollOrderFlow();
  startFlowPolling();
}

function closeOrderFlow() {
  stopFlowPolling();
  flowOrder = null;
  document.getElementById("order-flow-screen").classList.add("hidden");
  refreshActiveOrder();
}

function startFlowPolling() {
  stopFlowPolling();
  flowTimer = setInterval(pollOrderFlow, FLOW_POLL_MS);
}

function stopFlowPolling() {
  if (flowTimer) { clearInterval(flowTimer); flowTimer = null; }
  if (flowTipTimer) { clearInterval(flowTipTimer); flowTipTimer = null; }
}

async function pollOrderFlow() {
  if (!flowOrder) return;
  const base = await getShopApiUrl();
  const initData = await waitForInitData();
  if (!base || !initData) return;

  try {
    const res = await fetch(base + "/public/order_status", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData: initData, order_id: flowOrder.order_id, cart_id: flowOrder.cart_id }),
    });
    const data = await res.json();
    if (!data.ok) return;  // заказ ещё не виден/не найден — попробуем на следующем круге

    // Перерисовываем экран ТОЛЬКО когда что-то реально изменилось: иначе
    // каждые 5 секунд пересобирался бы блок действий — моргала бы анимация,
    // а у человека могло бы "выпрыгнуть" из-под пальца поле или кнопка.
    const sig = [data.status, data.needs_rent_link, data.price_uzs, data.item_name, data.admin_comment].join("|");
    const statusChanged = flowSignature !== null && flowSignature !== sig;
    const first = flowSignature === null;
    flowSignature = sig;
    flowStatus = data;
    if (!flowOrder.cart_id && data.cart_id) flowOrder.cart_id = data.cart_id;
    if (statusChanged || first) renderOrderFlow(!first);

    // Заказ дошёл до конца — больше опрашивать нечего
    if (data.status === "completed" || data.status === "rejected") stopFlowPolling();
  } catch (e) { /* сеть моргнула — следующий круг опроса попробует снова */ }
}

/** Кружок этапа: пройденный, текущий (пульсирует) или будущий. */
function flowStepsHTML(step) {
  const labels = [t("flow_step_created"), t("flow_step_payment"), t("flow_step_doing"), t("flow_step_done")];
  return labels.map(function(label, i) {
    const n = i + 1;
    const done = step > n;
    const current = step === n;
    const dot = done
      ? '<span class="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">✓</span>'
      : current
        ? '<span class="w-5 h-5 rounded-full bg-neon-blue text-white text-[10px] font-bold flex items-center justify-center animate-pulse">' + n + '</span>'
        : '<span class="w-5 h-5 rounded-full bg-white/[0.08] text-gray-500 text-[10px] font-bold flex items-center justify-center">' + n + '</span>';
    const line = i < labels.length - 1
      ? '<span class="flex-1 h-[2px] ' + (step > n ? "bg-emerald-500" : "bg-white/10") + ' mx-1"></span>'
      : "";
    return '<div class="flex items-center ' + (i < labels.length - 1 ? "flex-1" : "") + '">' +
      '<div class="flex flex-col items-center gap-1">' + dot +
        '<span class="text-[8px] ' + (current ? "text-neon-blue font-semibold" : "text-gray-500") + ' whitespace-nowrap">' + label + '</span>' +
      '</div>' + line +
    '</div>';
  }).join("");
}

const FLOW_VISUAL = {
  check: '<div id="success-confetti" class="absolute inset-0"></div>' +
    '<div class="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center relative" style="animation: successPop .5s cubic-bezier(.2,1.4,.4,1) both; box-shadow: 0 0 36px -4px rgba(16,185,129,0.6);">' +
      '<svg width="36" height="36" viewBox="0 0 24 24" fill="none">' +
        '<path d="M4 12.5L9.5 18L20 6" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" ' +
              'stroke-dasharray="26" stroke-dashoffset="26" style="animation: drawCheck .4s ease-out .25s forwards;"/>' +
      '</svg>' +
    '</div>',
  waiting: '<div class="w-20 h-20 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center relative">' +
      '<span class="absolute inset-0 rounded-full border-2 border-neon-blue/50 pulse-ring"></span>' +
      '<span class="text-3xl">💳</span>' +
    '</div>',
  // Крутящееся кольцо + эмодзи внутри: видно, что процесс идёт
  spinner: function(emoji) {
    return '<div class="w-20 h-20 rounded-full flex items-center justify-center relative">' +
        '<span class="absolute inset-0 rounded-full border-[3px] border-white/10 border-t-neon-blue" style="animation: spin 1s linear infinite;"></span>' +
        '<span class="absolute inset-0 rounded-full border-2 border-neon-blue/40 pulse-ring"></span>' +
        '<span class="text-3xl">' + emoji + '</span>' +
      '</div>';
  },
  failed: '<div class="w-20 h-20 rounded-full bg-red-500/15 border border-red-500/40 flex items-center justify-center">' +
      '<span class="text-3xl">✕</span>' +
    '</div>',
};

function renderOrderFlow(statusChanged) {
  const s = flowStatus;
  if (!s) return;
  const visual = document.getElementById("flow-visual");
  const titleEl = document.getElementById("flow-title");
  const subEl = document.getElementById("flow-subtitle");
  const actionEl = document.getElementById("flow-action");
  const buttonsEl = document.getElementById("flow-buttons");

  document.getElementById("success-item").textContent = displayItemName(s.item_name, s.category) || "—";
  document.getElementById("success-recipient").textContent =
    s.recipient && s.recipient.charAt(0) === "@" ? s.recipient : t("cart_to_self");
  document.getElementById("success-price").textContent = fmtUZS(s.price_uzs || 0);
  document.getElementById("flow-steps").innerHTML = flowStepsHTML(FLOW_STEP_BY_STATUS[s.status] || 1);

  if (flowTipTimer) { clearInterval(flowTipTimer); flowTipTimer = null; }

  if (s.status === "completed") {
    visual.innerHTML = FLOW_VISUAL.check;
    titleEl.textContent = t("flow_done_title");
    titleEl.className = "text-[19px] font-bold mb-1 text-emerald-400";
    subEl.textContent = t("flow_done_sub");
    // У аренды «готово» — это ещё не конец: подарок лежит на аккаунте, но на
    // профиле сам не появится, показ нужно включить руками на Fragment.
    // Поэтому сразу даём инструкцию, не дожидаясь вопроса в поддержку.
    const isRent = s.category === "nft_rent" || s.category === "nft_rent_extend";
    // Порядок: оценка → (для аренды) как показать подарок → допродажа.
    // Инструкция по аренде важнее рекламы, поэтому она выше.
    actionEl.innerHTML = (s.reviewed === false ? rateBoxHTML() : "") + (isRent
      ? '<div class="glass-card rounded-2xl p-3 mb-3 text-left text-[11.5px] text-gray-300 leading-snug">' +
          '⚠️ ' + t("flow_display_hint") +
        '</div>'
      : "") + upsellHTML(s.category);
    buttonsEl.innerHTML =
      (isRent
        ? '<div class="mb-2.5">' + tutorialButtonsHTML(true) + '</div>'
        : "") +
      '<button onclick="flowBuyMore()" class="w-full py-3.5 rounded-2xl ' + (isRent ? "pill" : "btn-primary") + ' press font-semibold text-white text-sm mb-2.5">' + t("order_success_more") + '</button>' +
      '<button onclick="flowGoTarix()" class="w-full py-3.5 rounded-2xl pill press font-semibold text-sm mb-2.5">' + t("order_success_history") + '</button>' +
      '<button onclick="closeOrderFlow()" class="w-full py-3 text-gray-400 text-xs">' + t("order_success_home") + '</button>';
    launchSuccessConfetti();
    if (statusChanged && tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred("success");
    return;
  }

  if (s.status === "rejected") {
    visual.innerHTML = FLOW_VISUAL.failed;
    titleEl.textContent = t("flow_rejected_title");
    titleEl.className = "text-[19px] font-bold mb-1 text-red-400";
    subEl.textContent = s.admin_comment || t("flow_rejected_sub");
    actionEl.innerHTML = "";
    buttonsEl.innerHTML =
      '<button onclick="flowBuyMore()" class="w-full py-3.5 rounded-2xl btn-primary press font-semibold text-white text-sm mb-2.5">' + t("order_success_more") + '</button>' +
      '<button onclick="flowWriteOperator()" class="w-full py-3.5 rounded-2xl pill press font-semibold text-sm">' + t("flow_write_operator") + '</button>';
    return;
  }

  titleEl.className = "text-[19px] font-bold mb-1";

  if (s.status === "awaiting_payment") {
    visual.innerHTML = FLOW_VISUAL.waiting;
    titleEl.textContent = t("flow_awaiting_title");
    subEl.textContent = t("flow_awaiting_sub");
    // Точная сумма к переводу + предупреждение про комиссию банка: если банк
    // удержит её из перевода, на карту придёт меньше и автоподтверждение не
    // сработает — человек должен узнать об этом ДО оплаты, а не после.
    // Блок с точной суммой показываем ВСЕГДА, даже если она совпала с ценой:
    // человек должен видеть, сколько именно перевести, и предупреждение про
    // комиссию банка. Раньше блок появлялся только при уникальной сумме — и
    // без неё предупреждения не было вообще.
    // Точная сумма — САМОЕ важное на этом экране. Раньше она была мельче
    // номера карты, люди её проскакивали и переводили круглое число: заказ
    // не подтверждался автоматически, а продавец разбирал это руками.
    const exact = s.pay_amount
      ? '<div class="rounded-2xl p-4 mb-3 text-center" style="background: rgba(217,180,91,0.14); border: 2px solid rgba(217,180,91,0.55);">' +
          '<div class="text-[11px] text-neon-yellow uppercase tracking-wider font-bold mb-1">⚠️ ' + t("flow_pay_exact") + '</div>' +
          '<div class="text-[30px] font-black text-neon-yellow leading-none mb-1 tracking-tight">' + fmtUZS(s.pay_amount) + '</div>' +
          '<div class="text-[11px] text-neon-yellow/90 font-semibold mb-2">' + t("flow_exact_warn") + '</div>' +
          '<div class="text-[11px] text-gray-300 leading-snug text-left">' + t("flow_commission_note") + '</div>' +
        '</div>'
      : "";
    actionEl.innerHTML =
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
      // Оплата с баланса — первой кнопкой, если денег хватает: это самый
      // быстрый и единственный способ заплатить РОВНО, без возни с чеком.
      (balanceData && balanceData.balance >= (s.pay_amount || s.price_uzs || 0)
        ? '<button onclick="payFromBalance(this, ' + s.order_id + ')" class="press w-full py-3.5 rounded-2xl btn-primary font-semibold text-white text-sm mb-2">💼 ' +
            t("bal_pay") + ' · ' + fmtUZS(balanceData.balance) + '</button>'
        : "") +
      '<input type="file" id="flow-receipt-input" accept="image/*" class="hidden" onchange="flowSubmitReceipt()" />' +
      '<button onclick="document.getElementById(\'flow-receipt-input\').click()" id="flow-receipt-btn" class="press w-full py-3.5 rounded-2xl ' +
        ((balanceData && balanceData.balance >= (s.pay_amount || s.price_uzs || 0)) ? "pill" : "btn-primary") +
        ' font-semibold text-white text-sm">📎 ' + t("ao_pay_upload") + '</button>' +
      '<p id="flow-receipt-error" class="hidden text-red-400 text-[11px] mt-2"></p>';
    buttonsEl.innerHTML =
      '<button onclick="flowCancelOrder()" class="w-full py-3 rounded-2xl pill press text-[12px] text-gray-400 mb-2">' + t("ao_cancel") + '</button>' +
      '<button onclick="closeOrderFlow()" class="w-full py-3 text-gray-400 text-xs">' + t("flow_minimize") + '</button>';
    return;
  }

  if (s.status === "payment_review") {
    visual.innerHTML = FLOW_VISUAL.spinner("🔍");
    titleEl.textContent = t("flow_review_title");
    subEl.textContent = t("flow_review_sub");
    actionEl.innerHTML = "";
    // Чек отправлен, но оплату ещё не подтвердили — заказ всё ещё можно
    // отменить самому: денег у продавца пока нет.
    buttonsEl.innerHTML =
      '<button onclick="flowCancelOrder(false)" class="w-full py-3 rounded-2xl pill press text-[12px] text-gray-400 mb-2">' + t("ao_cancel") + '</button>' +
      '<button onclick="closeOrderFlow()" class="w-full py-3 text-gray-400 text-xs">' + t("flow_minimize") + '</button>';
    return;
  }

  // paid / fulfilling — «выполняется»: анимация + сменяющиеся пояснения,
  // чтобы ожидание не выглядело как зависший экран
  visual.innerHTML = FLOW_VISUAL.spinner("⚙️");
  titleEl.textContent = t("flow_doing_title");
  subEl.textContent = t("flow_doing_sub");

  const linkBlock = s.needs_rent_link
    ? '<div class="glass-card rounded-2xl p-3.5 text-left mb-3">' +
        '<div class="text-[12px] font-semibold text-white mb-1">🔗 ' + t("ao_link_title") + '</div>' +
        '<div class="text-[11px] text-gray-400 mb-2.5 leading-snug">' + t("ao_link_hint") + '</div>' +
        androidLinkHintHTML() +
        '<input id="rent-link-input" type="text" placeholder="tc://..." class="w-full bg-white/[0.04] border border-white/[0.09] rounded-xl px-3 py-2.5 text-[11px] text-white focus:outline-none focus:border-neon-blue/60 mb-2" />' +
        '<p id="rent-link-error" class="hidden text-red-400 text-[11px] mb-2"></p>' +
        '<button onclick="submitRentLink()" id="rent-link-btn" class="press w-full py-3 rounded-xl btn-primary font-semibold text-white text-[13px]">' + t("ao_link_send") + '</button>' +
        // Видео-инструкция лежит в чате бота и к этому моменту уже уехала
        // вверх за другими сообщениями. Кнопка присылает её заново и
        // закрывает витрину — человек сразу попадает на свежее видео.
        '<div class="mt-2">' + tutorialButtonsHTML(false, true) + '</div>' +
      '</div>'
    : "";

  const premiumBlock = s.category === "premium"
    ? premiumContactHTML(s.order_id || (flowOrder && flowOrder.order_id), s.item_name)
    : "";

  actionEl.innerHTML =
    premiumBlock +
    linkBlock +
    '<div class="glass-card rounded-2xl p-3 flex items-center gap-2.5 text-left">' +
      '<span class="w-4 h-4 border-2 border-white/20 border-t-neon-blue rounded-full flex-shrink-0" style="animation: spin .8s linear infinite;"></span>' +
      '<span id="flow-tip" class="text-[11.5px] text-gray-300 transition-opacity duration-300"></span>' +
    '</div>';
  // Заказ оплачен и выполняется. Сам клиент его закрыть не может, но должен
  // иметь выход, если что-то пошло не так — кнопка отправляет просьбу
  // продавцу. Раньше здесь была только «свернуть», и зависший заказ
  // оставалось только терпеть.
  buttonsEl.innerHTML =
    '<button onclick="flowCancelOrder(true)" class="w-full py-3 rounded-2xl pill press text-[12px] text-gray-400 mb-2">' + t("ao_cancel_request") + '</button>' +
    '<button onclick="closeOrderFlow()" class="w-full py-3 text-gray-400 text-xs">' + t("flow_minimize") + '</button>';

  const tips = t("flow_tips") || [];
  const tipEl = document.getElementById("flow-tip");
  let tipIndex = 0;
  function paintTip() {
    if (!tipEl || !tips.length) return;
    tipEl.style.opacity = 0;
    setTimeout(function() {
      tipEl.textContent = tips[tipIndex % tips.length];
      tipEl.style.opacity = 1;
      tipIndex++;
    }, 250);
  }
  paintTip();
  flowTipTimer = setInterval(paintTip, 3000);
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
  return new Promise(function(resolve) {
    let url;
    try { url = URL.createObjectURL(file); } catch (e) { resolve(null); return; }

    const img = new Image();
    img.onload = function() {
      try {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        URL.revokeObjectURL(url);
        resolve(dataUrl.indexOf(",") > 0 ? dataUrl.split(",")[1] : null);
      } catch (e) {
        URL.revokeObjectURL(url);
        resolve(null);
      }
    };
    img.onerror = function() { URL.revokeObjectURL(url); resolve(null); };
    img.src = url;
  });
}

/** Читает файл как base64 без сжатия — запасной путь. */
function readFileBase64(file) {
  return new Promise(function(resolve, reject) {
    const r = new FileReader();
    r.onload = function() { resolve(String(r.result).split(",")[1]); };
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

/** Готовит чек к отправке: сначала пробуем сжать, иначе — как есть. */
async function receiptToBase64(file) {
  const compressed = await compressReceipt(file, 1600, 0.8);
  if (compressed) return compressed;
  return await readFileBase64(file);
}

async function flowSubmitReceipt() {
  const input = document.getElementById("flow-receipt-input");
  const btn = document.getElementById("flow-receipt-btn");
  const errorEl = document.getElementById("flow-receipt-error");
  if (!input || !input.files || !input.files[0] || !flowStatus) return;

  const file = input.files[0];
  errorEl.classList.add("hidden");
  if (file.size > 25 * 1024 * 1024) {
    errorEl.textContent = t("ao_err_too_big"); errorEl.classList.remove("hidden"); return;
  }

  const base = await getShopApiUrl();
  const initData = await waitForInitData();
  if (!base || !initData) return;

  const prev = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full align-middle" style="animation: spin .7s linear infinite;"></span>';

  try {
    const base64 = await receiptToBase64(file);
    const res = await fetch(base + "/public/submit_receipt", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData: initData, order_id: flowStatus.order_id, image_base64: base64 }),
    });
    const data = await res.json();
    if (data.ok) {
      if (tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred("success");
      pollOrderFlow();          // сразу перерисуем экран в «проверяем оплату»
      startFlowPolling();
    } else {
      const reasons = {
        wrong_status: t("ao_err_wrong_status"), too_big: t("ao_err_too_big"),
        no_image: t("ao_err_no_image"), bad_image: t("ao_err_no_image"), not_found: t("ao_err_not_found"),
        duplicate_receipt: t("ao_err_duplicate"), banned: t("err_banned"),
      };
      errorEl.textContent = reasons[data.error] || (t("ao_err_receipt") + " (" + (data.error || res.status) + ")");
      errorEl.classList.remove("hidden");
    }
  } catch (e) {
    errorEl.textContent = t("ao_err_network"); errorEl.classList.remove("hidden");
  } finally {
    btn.disabled = false;
    btn.innerHTML = prev;
    input.value = "";
  }
}

function flowCancelOrder(isRequest) {
  if (!flowStatus) return;
  askConfirm(
    t(isRequest ? "ao_cancel_request_confirm" : "ao_cancel_confirm"),
    async function() {
      const base = await getShopApiUrl();
      const initData = await waitForInitData();
      if (!base || !initData) return;
      try {
        const res = await fetch(base + "/public/cancel_order", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ initData: initData, order_id: flowStatus.order_id }),
        });
        const data = await res.json().catch(function() { return {}; });
        if (data && data.requested) {
          if (tg && tg.showAlert) tg.showAlert(t("ao_cancel_requested"));
          else alert(t("ao_cancel_requested"));
        }
      } catch (e) { /* молча — статус всё равно перечитаем ниже */ }
      pollOrderFlow();
    }
  );
}

function flowWriteOperator() {
  closeOrderFlow();
  switchTab("profil");
}

function flowGoTarix() {
  closeOrderFlow();
  switchTab("tarix");
}

/* Допродажа на экране «Bajarildi»: что предложить после покупки.
   Раньше это было отдельным сообщением бота в чате — терялось среди
   инструкций. Здесь человек видит предложение в момент, когда он доволен,
   и одной кнопкой попадает прямо в нужный раздел. */
const UPSELL = {
  stars:       { text: "up_stars",       go: [["premium", "up_go_premium"]] },
  premium:     { text: "up_premium",     go: [["ijara", "up_go_rent"], ["simple_gift", "up_go_gift"]] },
  simple_gift: { text: "up_simple_gift", go: [["stars", "up_go_stars"]] },
  nft_rent:    { text: "up_nft_rent",    go: [["stars", "up_go_stars"], ["premium", "up_go_premium"]] },
};

function upsellHTML(category) {
  const u = UPSELL[category];
  if (!u) return "";
  return '<div class="rounded-2xl p-3.5 mb-3 text-left" style="background:linear-gradient(135deg,rgba(42,171,238,0.12),rgba(142,140,216,0.10));border:1px solid rgba(42,171,238,0.3)">' +
      '<div class="text-[10px] font-bold uppercase tracking-wider text-neon-blue mb-1">' + t("up_title") + '</div>' +
      '<div class="text-[12.5px] text-gray-200 leading-snug mb-2.5">' + t(u.text) + '</div>' +
      '<div class="flex gap-2">' +
        u.go.map(function(g) {
          return '<button onclick="flowGoCategory(\'' + g[0] + '\')" class="press flex-1 py-2.5 rounded-xl pill-gold text-[12px] font-bold">' + t(g[1]) + '</button>';
        }).join("") +
      '</div>' +
    '</div>';
}

function flowGoCategory(target) {
  closeOrderFlow();
  if (target === "ijara") { switchTab("ijara"); return; }
  switchTab("asosiy");
  setCategory(target);
  window.scrollTo(0, 0);
}

function flowBuyMore() {
  closeOrderFlow();
  switchTab("asosiy");
}

/* ---------------- Профиль / рефералка / условия аренды ---------------- */
async function initProfile() {
  // БАГ БЫЛ ЗДЕСЬ: ждали именно подписанную initData (нужна только для
  // /public/my_orders и /public/my_stats), а initDataUnsafe.user — отдельные,
  // неподписанные данные, которые обычно готовы раньше. Из-за завязки на
  // не тот таймер имя/аватар иногда так и оставались плейсхолдером "—",
  // даже когда сам Telegram уже готов был отдать данные пользователя.
  const u = await waitForUnsafeUser();
  if (!u) {
    // После ожидания юзера всё ещё нет — редкий случай (например, открыли
    // не из настоящего Telegram-клиента). Тихо оставляем плейсхолдер.
    return;
  }
  document.getElementById("profile-name").textContent =
    [u.first_name, u.last_name].filter(Boolean).join(" ") || "Mijoz";
  document.getElementById("profile-username").textContent = u.username ? "@" + u.username : "";
  document.getElementById("profile-id").textContent = "ID: " + u.id;
  const ava = document.getElementById("profile-avatar");
  ava.textContent = (Array.from(u.first_name || "?")[0] || "?").toUpperCase();
  // photo_url Telegram отдаёт не всегда (зависит от клиента и настроек
  // приватности) — нет фото, остаётся буква.
  if (u.photo_url && /^https:\/\//.test(u.photo_url)) {
    const img = document.createElement("img");
    img.alt = "";
    img.onerror = function() { img.remove(); };
    img.src = u.photo_url;
    ava.appendChild(img);
  }
}

/* ---------------- API бота-магазина (Tarix/TOP/Profil) ---------------- */
let shopApiUrl = null;
async function getShopApiUrl() {
  if (shopApiUrl !== null) return shopApiUrl;
  try {
    const res = await fetch("/api/config");
    const data = await res.json();
    shopApiUrl = data.shop_api_url || "";
  } catch (e) {
    shopApiUrl = "";
  }
  return shopApiUrl;
}

/* ---------------- \u0410\u043d\u0438\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0435 (\u043f\u0440\u0435\u043c\u0438\u0430\u043b\u044c\u043d\u044b\u0435) \u044d\u043c\u043e\u0434\u0437\u0438 Telegram ----------------
   \u0412 Telegram \u0442\u0430\u043a\u043e\u0439 \u044d\u043c\u043e\u0434\u0437\u0438 \u2014 \u044d\u0442\u043e \u043d\u0435 \u0441\u0438\u043c\u0432\u043e\u043b, \u0430 id (5375583215157280942).
   \u0412 \u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0438 \u0431\u043e\u0442 \u0443\u043c\u0435\u0435\u0442 \u0435\u0433\u043e \u043f\u043e\u043a\u0430\u0437\u0430\u0442\u044c, \u0430 \u0432\u0438\u0442\u0440\u0438\u043d\u0430 \u2014 \u043e\u0431\u044b\u0447\u043d\u0430\u044f \u0432\u0435\u0431-\u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0430, \u0438
   \u0431\u0440\u0430\u0443\u0437\u0435\u0440 \u043f\u0440\u043e \u044d\u0442\u043e\u0442 id \u043d\u0438\u0447\u0435\u0433\u043e \u043d\u0435 \u0437\u043d\u0430\u0435\u0442. \u041f\u043e\u044d\u0442\u043e\u043c\u0443 \u0441\u0430\u043c \u0444\u0430\u0439\u043b \u044d\u043c\u043e\u0434\u0437\u0438 \u043e\u0442\u0434\u0430\u0451\u0442 \u0431\u043e\u0442
   (/public/emoji/<id>), \u0430 \u0437\u0434\u0435\u0441\u044c \u043c\u044b \u0435\u0433\u043e \u0440\u0430\u0437\u0432\u043e\u0440\u0430\u0447\u0438\u0432\u0430\u0435\u043c: webm \u2014 \u0432 <video>,
   \u043a\u0430\u0440\u0442\u0438\u043d\u043a\u0443 \u2014 \u0432 <img>, tgs (Lottie) \u2014 \u043f\u043b\u0435\u0435\u0440\u043e\u043c.

   \u0413\u043b\u0430\u0432\u043d\u043e\u0435 \u043f\u0440\u0430\u0432\u0438\u043b\u043e: \u043f\u043e\u043a\u0430 \u0444\u0430\u0439\u043b \u043d\u0435 \u043f\u0440\u0438\u0448\u0451\u043b \u2014 \u0438 \u0435\u0441\u043b\u0438 \u043d\u0435 \u043f\u0440\u0438\u0434\u0451\u0442 \u0432\u043e\u0432\u0441\u0435 \u2014 \u043d\u0430 \u043c\u0435\u0441\u0442\u0435
   \u044d\u043c\u043e\u0434\u0437\u0438 \u0441\u0442\u043e\u0438\u0442 \u043e\u0431\u044b\u0447\u043d\u044b\u0439 \u0441\u0438\u043c\u0432\u043e\u043b. \u0412\u0438\u0442\u0440\u0438\u043d\u0430 \u043d\u0435 \u0434\u043e\u043b\u0436\u043d\u0430 \u0432\u044b\u0433\u043b\u044f\u0434\u0435\u0442\u044c \u0441\u043b\u043e\u043c\u0430\u043d\u043d\u043e\u0439 \u0438\u0437-\u0437\u0430
   \u0443\u043a\u0440\u0430\u0448\u0435\u043d\u0438\u044f.                                                               */
const CE_STARS = "5375583215157280942";
const CE_PREMIUM = "5375333763456729352";

const _ceCache = {};
const _ceAnims = [];
let _ceLottiePromise = null;
let _ceObserver = null;

function ceLoad(id) {
  if (_ceCache[id]) return _ceCache[id];
  _ceCache[id] = (async function() {
    const base = await getShopApiUrl();
    const res = await fetch(base + "/public/emoji/" + id);
    if (!res.ok) throw new Error("emoji " + res.status);
    const ct = (res.headers.get("content-type") || "").toLowerCase();
    if (ct.indexOf("json") !== -1) return { kind: "lottie", data: await res.json() };
    const url = URL.createObjectURL(await res.blob());
    return { kind: ct.indexOf("video") !== -1 ? "video" : "image", url: url };
  })().catch(function(e) {
    // \u041d\u0435 \u0437\u0430\u043f\u043e\u043c\u0438\u043d\u0430\u0435\u043c \u043d\u0435\u0443\u0434\u0430\u0447\u0443 \u043d\u0430\u0432\u0441\u0435\u0433\u0434\u0430: \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0430\u044f \u043f\u0435\u0440\u0435\u0440\u0438\u0441\u043e\u0432\u043a\u0430 \u043f\u043e\u043f\u0440\u043e\u0431\u0443\u0435\u0442 \u0441\u043d\u043e\u0432\u0430.
    delete _ceCache[id];
    throw e;
  });
  return _ceCache[id];
}

/* \u0417\u0430\u0433\u043b\u0443\u0448\u043a\u0430 \u0432 \u0440\u0430\u0437\u043c\u0435\u0442\u043a\u0435. fallback \u2014 \u043e\u0431\u044b\u0447\u043d\u044b\u0439 \u044d\u043c\u043e\u0434\u0437\u0438, \u043a\u043e\u0442\u043e\u0440\u044b\u0439 \u0432\u0438\u0434\u043d\u043e \u0441\u0440\u0430\u0437\u0443. */
function ceHTML(id, sizePx, fallback) {
  return '<span class="ce" data-ce-id="' + id + '" data-ce-size="' + sizePx + '" ' +
    'style="display:inline-flex;align-items:center;justify-content:center;' +
    'width:' + sizePx + 'px;height:' + sizePx + 'px;font-size:' + Math.round(sizePx * 0.9) + 'px;' +
    'line-height:1;vertical-align:middle;">' + fallback + '</span>';
}

function ceLottieLib() {
  if (_ceLottiePromise) return _ceLottiePromise;
  _ceLottiePromise = new Promise(function(resolve, reject) {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie_svg.min.js";
    s.onload = function() { resolve(window.lottie); };
    s.onerror = function() { _ceLottiePromise = null; reject(new Error("lottie")); };
    document.head.appendChild(s);
  });
  return _ceLottiePromise;
}

/* \u042d\u043c\u043e\u0434\u0437\u0438 \u0437\u0430 \u043f\u0440\u0435\u0434\u0435\u043b\u0430\u043c\u0438 \u044d\u043a\u0440\u0430\u043d\u0430 \u043d\u0435 \u043a\u0440\u0443\u0442\u0438\u043c: \u043d\u0430 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0435 \u0438\u0445 \u0431\u044b\u0432\u0430\u0435\u0442 \u043f\u043e\u043b\u0442\u043e\u0440\u0430 \u0434\u0435\u0441\u044f\u0442\u043a\u0430,
   \u0438 \u043e\u0434\u043d\u043e\u0432\u0440\u0435\u043c\u0435\u043d\u043d\u0430\u044f \u0430\u043d\u0438\u043c\u0430\u0446\u0438\u044f \u0432\u0441\u0435\u0445 \u0437\u0430\u043c\u0435\u0442\u043d\u043e \u0433\u0440\u0435\u0435\u0442 \u0442\u0435\u043b\u0435\u0444\u043e\u043d. */
function ceObserver() {
  if (_ceObserver) return _ceObserver;
  if (typeof IntersectionObserver === "undefined") return null;
  _ceObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(en) {
      const el = en.target;
      if (en.isIntersecting) {
        if (el._ceAnim) el._ceAnim.play();
        else if (el.play) { const p = el.play(); if (p && p.catch) p.catch(function() {}); }
      } else {
        if (el._ceAnim) el._ceAnim.pause();
        else if (el.pause) el.pause();
      }
    });
  }, { rootMargin: "120px" });
  return _ceObserver;
}

function hydrateCustomEmoji(root) {
  // \u0412\u0438\u0442\u0440\u0438\u043d\u0430 \u043f\u043e\u0441\u0442\u043e\u044f\u043d\u043d\u043e \u043f\u0435\u0440\u0435\u0440\u0438\u0441\u043e\u0432\u044b\u0432\u0430\u0435\u0442 \u0441\u043f\u0438\u0441\u043a\u0438 \u0447\u0435\u0440\u0435\u0437 innerHTML \u2014 Lottie-\u043f\u043b\u0435\u0435\u0440\u044b \u043e\u0442
  // \u0432\u044b\u0431\u0440\u043e\u0448\u0435\u043d\u043d\u044b\u0445 \u043a\u0430\u0440\u0442\u043e\u0447\u0435\u043a \u043d\u0430\u0434\u043e \u0433\u0430\u0441\u0438\u0442\u044c, \u0438\u043d\u0430\u0447\u0435 \u043e\u043d\u0438 \u043f\u0440\u043e\u0434\u043e\u043b\u0436\u0430\u044e\u0442 \u0441\u0447\u0438\u0442\u0430\u0442\u044c \u043a\u0430\u0434\u0440\u044b.
  for (let i = _ceAnims.length - 1; i >= 0; i--) {
    if (!_ceAnims[i].el.isConnected) {
      try { _ceAnims[i].anim.destroy(); } catch (e) {}
      _ceAnims.splice(i, 1);
    }
  }

  const scope = root || document;
  Array.prototype.forEach.call(scope.querySelectorAll(".ce[data-ce-id]"), function(span) {
    if (span.dataset.ceDone === "1") return;
    span.dataset.ceDone = "1";
    const id = span.dataset.ceId;
    const size = Number(span.dataset.ceSize) || 20;

    ceLoad(id).then(function(em) {
      if (!span.isConnected) return;
      if (em.kind === "video") {
        const v = document.createElement("video");
        v.src = em.url;
        v.loop = true; v.autoplay = true; v.muted = true; v.playsInline = true;
        // \u0410\u0442\u0440\u0438\u0431\u0443\u0442\u044b \u0434\u0443\u0431\u043b\u0438\u0440\u0443\u0435\u043c \u0441\u0442\u0440\u043e\u043a\u043e\u0439: \u0431\u0435\u0437 \u043d\u0438\u0445 iOS \u043e\u0442\u043a\u0430\u0437\u044b\u0432\u0430\u0435\u0442\u0441\u044f \u043f\u0440\u043e\u0438\u0433\u0440\u044b\u0432\u0430\u0442\u044c
        // \u0432\u0438\u0434\u0435\u043e \u0431\u0435\u0437 \u0437\u0432\u0443\u043a\u0430 \u0432 \u0444\u043e\u043d\u0435 \u0438 \u0440\u0430\u0437\u0432\u043e\u0440\u0430\u0447\u0438\u0432\u0430\u0435\u0442 \u0435\u0433\u043e \u043d\u0430 \u0432\u0435\u0441\u044c \u044d\u043a\u0440\u0430\u043d.
        v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.setAttribute("loop", "");
        v.style.width = size + "px"; v.style.height = size + "px"; v.style.objectFit = "contain";
        span.innerHTML = ""; span.appendChild(v);
        const p = v.play(); if (p && p.catch) p.catch(function() {});
        const ob = ceObserver(); if (ob) ob.observe(v);
      } else if (em.kind === "image") {
        const img = document.createElement("img");
        img.src = em.url;
        img.style.width = size + "px"; img.style.height = size + "px"; img.style.objectFit = "contain";
        span.innerHTML = ""; span.appendChild(img);
      } else {
        ceLottieLib().then(function(lottie) {
          if (!lottie || !span.isConnected) return;
          const box = document.createElement("div");
          box.style.width = size + "px"; box.style.height = size + "px";
          span.innerHTML = ""; span.appendChild(box);
          const anim = lottie.loadAnimation({
            container: box, renderer: "svg", loop: true, autoplay: true, animationData: em.data,
          });
          box._ceAnim = anim;
          _ceAnims.push({ el: box, anim: anim });
          const ob = ceObserver(); if (ob) ob.observe(box);
        }).catch(function() {});
      }
    }).catch(function() {
      // \u041c\u043e\u043b\u0447\u0430 \u043e\u0441\u0442\u0430\u0451\u043c\u0441\u044f \u043d\u0430 \u043e\u0431\u044b\u0447\u043d\u043e\u043c \u044d\u043c\u043e\u0434\u0437\u0438-\u0437\u0430\u0433\u043b\u0443\u0448\u043a\u0435.
    });
  });
}

const CATEGORY_EMOJI = { stars: "\u2b50", premium: "\ud83d\udc8e", simple_gift: "\ud83c\udf81", nft_rent: "\ud83d\uddbc" };
const STATUS_KEY = {
  awaiting_payment: "status_awaiting_payment", payment_review: "status_payment_review",
  paid: "status_paid", fulfilling: "status_fulfilling", completed: "status_completed", rejected: "status_rejected",
};

function formatOrderDate(sqlDate) {
  if (!sqlDate) return "";
  // формат из sqlite: "YYYY-MM-DD HH:MM:SS" (UTC) — просто показываем как есть, без пересчёта пояса
  return sqlDate.replace("T", " ").slice(0, 16);
}

async function renderHistory() {
  const listEl = document.getElementById("tarix-list");
  const base = await getShopApiUrl();
  const initData = await waitForInitData();
  if (!base || !initData) {
    listEl.innerHTML =
      '<div class="glass-card rounded-[22px] p-6 text-center text-gray-400">' +
      '<p class="text-3xl mb-2">\ud83d\uded2</p><p class="text-sm">' + t("history_open_bot") + '</p></div>';
    return;
  }
  listEl.innerHTML = '<div class="text-center text-xs text-gray-500 py-6">' + t("history_loading") + '</div>';

  try {
    const res = await fetch(base + "/public/my_orders", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData: initData }),
    });
    const data = await res.json();
    const orders = data.orders || [];

    if (!orders.length) {
      listEl.innerHTML =
        '<div class="glass-card rounded-[22px] p-6 text-center text-gray-400">' +
        '<p class="text-3xl mb-2">\ud83d\uded2</p><p class="text-sm">' + t("history_empty") + '</p></div>';
      return;
    }

    listEl.innerHTML = orders.map(function(o) {
      const emoji = CATEGORY_EMOJI[o.category] || "\ud83d\udce6";
      const statusLabel = t(STATUS_KEY[o.status] || o.status);
      const statusColor = (o.status === "completed") ? "text-green-400" : (o.status === "rejected") ? "text-red-400" : "text-gray-400";
      return '<div class="glass-card rounded-2xl p-3.5 flex items-center justify-between gap-2">' +
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
    listEl.innerHTML =
      '<div class="glass-card rounded-[22px] p-6 text-center text-gray-400">' +
      '<p class="text-sm">' + t("history_empty") + '</p></div>';
  }
}

let currentTopPeriod = "all";
function setTopPeriod(period) {
  currentTopPeriod = period;
  ["today","week","month","all"].forEach(function(p) {
    const btn = document.getElementById("top-period-" + p);
    if (btn) btn.classList.toggle("active", p === period);
  });
  if (tg && tg.HapticFeedback) tg.HapticFeedback.selectionChanged();
  renderLeaderboard(period);
}

/** Небольшой салют вокруг короны 1-го места в рейтинге — чисто декоративно. */
/**
 * Салют с двух сторон подиума — летит от левого и правого края навстречу
 * центру (как на награждении), а не просто разлетается вокруг короны.
 */
function launchConfetti() {
  const colors = ["#D9B45B", "#2AABEE", "#8E8CD8", "#5AC8FA", "#F0DFA0"];

  function burst(boxId, dirX) {
    const box = document.getElementById(boxId);
    if (!box) return;
    let html = "";
    for (let i = 0; i < 14; i++) {
      // dirX задаёт общее направление (влево/вправо), с разбросом по вертикали
      const spread = (Math.random() - 0.5) * 70;
      const dist = 60 + Math.random() * 50;
      const tx = Math.round(dirX * dist);
      const ty = Math.round(spread - 30 - Math.random() * 20);
      const rot = Math.round((Math.random() - 0.5) * 520);
      const color = colors[i % colors.length];
      const delay = Math.round(Math.random() * 140);
      html += '<span class="confetti-piece" style="--tx:' + tx + 'px; --ty:' + ty + 'px; --rot:' + rot + 'deg; background:' + color + '; animation-delay:' + delay + 'ms;"></span>';
    }
    box.innerHTML = html;
  }

  burst("podium-confetti-left", 1);   // летит вправо, к центру
  burst("podium-confetti-right", -1); // летит влево, к центру
}

function escHTML(v) {
  return String(v == null ? "" : v).replace(/[&<>"']/g, function(c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

/* Аватарка: сразу видна буква на цветном фоне, а фото из Telegram плавно
   проявляется поверх, если оно есть. Нет фото — просто остаётся буква. */
function topAvatarHTML(r, px, bg, base) {
  const name = (r.full_name || r.username || "?").trim();
  const letter = escHTML((Array.from(name)[0] || "?").toUpperCase());
  return '<div class="top-ava" style="width:' + px + 'px;height:' + px + 'px;font-size:' + Math.round(px * 0.4) + 'px;background:' + bg + ';">' +
    '<span>' + letter + '</span>' +
    (base ? '<img src="' + base + '/public/avatar/' + Number(r.user_id) + '" alt="" loading="lazy" onload="this.classList.add(\'ok\')" onerror="this.remove()">' : '') +
  '</div>';
}

function topPersonName(r) {
  return r.full_name || (r.username ? "@" + r.username : "ID " + r.user_id);
}

/* Что человек покупал: «1 000 ⭐ · 2 sovg'a · 1 premium» — живее, чем «3 заказа». */
function topBreakdown(r) {
  const parts = [];
  if (r.stars) parts.push(Number(r.stars).toLocaleString("ru-RU").replace(/,/g, " ") + " ⭐");
  if (r.gifts) parts.push(r.gifts + " " + t("top_gifts"));
  if (r.premium) parts.push(r.premium + " premium");
  if (r.rents) parts.push(r.rents + " " + t("top_rents"));
  return parts.length ? parts.join(" · ") : r.orders_count + " " + t("top_orders_suffix");
}

async function renderLeaderboard(period) {
  const listEl = document.getElementById("top-list");
  const meEl = document.getElementById("top-me");
  const peopleEl = document.getElementById("top-people");
  const emptyHTML =
    '<div class="glass-card rounded-[22px] p-6 text-center text-gray-400">' +
    '<p class="text-3xl mb-2">🏆</p><p class="text-sm font-semibold text-white mb-1">' + t("top_forming") + '</p>' +
    '<p class="text-xs">' + t("top_hint") + '</p></div>';

  const base = await getShopApiUrl();
  if (!base) { listEl.innerHTML = emptyHTML; meEl.classList.add("hidden"); return; }
  listEl.innerHTML = '<div class="skeleton h-[300px] mb-3"></div>' + skeletonHTML(3, "h-[60px] mb-2");

  const myUser = await waitForUnsafeUser();
  const myId = myUser ? myUser.id : null;

  let rows = [], totalPeople = 0;
  try {
    const res = await fetch(base + "/public/leaderboard?period=" + period);
    const data = await res.json();
    rows = data.leaderboard || [];
    totalPeople = data.total_people || 0;
  } catch (e) {
    listEl.innerHTML = '<div class="text-center text-xs text-gray-500 py-6">' + t("top_empty") + '</div>';
    return;
  }
  // Пока грузилось, человек мог переключить период — старый ответ не рисуем.
  if (period !== currentTopPeriod) return;

  peopleEl.textContent = totalPeople ? t("top_people").replace("{n}", totalPeople) : "";
  if (!rows.length) { listEl.innerHTML = emptyHTML; renderTopMe(period, rows); return; }

  const AVA_BG = {
    0: "radial-gradient(circle at 30% 25%, #F3D98A, #B8862F 75%)",
    1: "radial-gradient(circle at 30% 25%, #E6EAEE, #8C96A1 75%)",
    2: "radial-gradient(circle at 30% 25%, #EBB07A, #9C5F2C 75%)",
  };
  const MEDAL = { 0: "🥇", 1: "🥈", 2: "🥉" };
  const AVA_PX = { 0: 76, 1: 58, 2: 58 };

  // 2 — 1 — 3: первое место в центре и выше всех
  const order = [1, 0, 2].filter(function(i) { return rows[i]; });
  let sparks = "";
  for (let k = 0; k < 9; k++) {
    sparks += '<span class="top-spark" style="left:' + (8 + Math.round(Math.random() * 84)) + '%;top:' +
      (6 + Math.round(Math.random() * 55)) + '%;animation-delay:' + (Math.random() * 2.6).toFixed(2) + 's"></span>';
  }
  const podiumHTML =
    '<div class="top-stage mb-4">' +
      '<div class="top-beam"></div>' + sparks +
      '<div id="podium-confetti-left" class="absolute left-3 top-24 w-0 h-0"></div>' +
      '<div id="podium-confetti-right" class="absolute right-3 top-24 w-0 h-0"></div>' +
      '<div class="relative flex items-end justify-center gap-2">' +
      order.map(function(i, idx) {
        const r = rows[i];
        const isMe = myId && r.user_id === myId;
        return '<div class="pod-col" style="animation: sheetUp .45s cubic-bezier(.2,.9,.25,1) both; animation-delay:' + (idx * 90) + 'ms;">' +
          (i === 0 ? '<div class="pod-crown">👑</div>' : '') +
          // Медаль — снаружи кольца: кольцо у 1-го места вращается, и медаль
          // крутилась бы вместе с ним.
          '<div class="relative">' +
            '<div class="pod-ring r' + (i + 1) + '"' + (isMe ? ' style="box-shadow:0 0 0 2px #2AABEE"' : '') + '>' +
              topAvatarHTML(r, AVA_PX[i], AVA_BG[i], base) +
            '</div>' +
            '<span class="pod-medal">' + MEDAL[i] + '</span>' +
          '</div>' +
          '<div class="text-[12px] font-bold text-white mt-2 w-full truncate text-center px-1">' + escHTML(topPersonName(r)) + '</div>' +
          '<div class="text-[11.5px] font-extrabold mt-0.5 ' + (i === 0 ? "text-neon-yellow" : "text-gray-300") + '" style="font-variant-numeric:tabular-nums">' + fmtUZS(r.total_uzs) + '</div>' +
          '<div class="pod-block b' + (i + 1) + '" style="animation-delay:' + (150 + idx * 90) + 'ms"><span class="pod-num">' + (i + 1) + '</span></div>' +
        '</div>';
      }).join("") +
      '</div>' +
    '</div>';

  const restHTML = rows.slice(3).map(function(r, idx) {
    const isMe = myId && r.user_id === myId;
    return '<div class="top-row' + (isMe ? " me" : "") + '" style="animation-delay:' + (idx * 50) + 'ms">' +
      '<span class="top-rank">' + (idx + 4) + '</span>' +
      topAvatarHTML(r, 38, "linear-gradient(135deg, #2AABEE, #7B7FE0)", base) +
      '<div class="min-w-0 flex-1">' +
        '<div class="text-[13px] font-semibold text-white truncate">' + escHTML(topPersonName(r)) +
          (isMe ? ' <span class="text-neon-blue">· ' + t("top_you") + '</span>' : '') + '</div>' +
        '<div class="text-[10.5px] text-gray-400 truncate mt-0.5">' + escHTML(topBreakdown(r)) + '</div>' +
      '</div>' +
      '<span class="top-amt">' + fmtUZS(r.total_uzs) + '</span>' +
    '</div>';
  }).join("");

  listEl.innerHTML = podiumHTML +
    (restHTML ? '<div class="text-[10px] font-bold text-gray-500 uppercase tracking-[0.16em] mb-2 px-1">' + t("top_list") + '</div>' +
      '<div class="space-y-2">' + restHTML + '</div>' : '');
  launchConfetti();
  renderTopMe(period, rows);
}

/* Полоска «где я» внизу TOP: место, и сколько осталось до следующего —
   даёт повод купить ещё, в отличие от сухого номера. */
async function renderTopMe(period, rows) {
  const el = document.getElementById("top-me");
  const base = await getShopApiUrl();
  const initData = await waitForInitData();
  if (!base || !initData) { el.classList.add("hidden"); return; }
  let me;
  try {
    const res = await fetch(base + "/public/leaderboard_me", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData: initData, period: period }),
    });
    me = await res.json();
  } catch (e) { el.classList.add("hidden"); return; }
  if (period !== currentTopPeriod || !me || !me.ok) { if (!me || !me.ok) el.classList.add("hidden"); return; }

  const u = await waitForUnsafeUser();
  const self = { user_id: u ? u.id : 0, full_name: u ? u.first_name : "?", username: u ? u.username : "" };
  const topSize = me.top_size || 8;
  let title, sub = "", progress = null, right = "";

  if (!me.rank) {
    title = t("top_me_none");
    sub = t("top_me_none_hint");
    right = "—";
  } else {
    right = fmtUZS(me.total_uzs);
    if (me.rank === 1) {
      title = t("top_me_first");
    } else {
      title = (me.rank <= topSize ? t("top_me_in") + " · " : "") + t("top_me_place").replace("{rank}", me.rank);
      let target, label;
      if (me.rank > topSize && rows.length >= topSize) {
        target = rows[topSize - 1].total_uzs;
        label = t("top_me_out");
      } else {
        target = me.next_total_uzs;
        label = t("top_me_up").replace("{next}", me.rank - 1);
      }
      if (target) {
        const gap = Math.max(1, target - me.total_uzs + 1);
        sub = label.replace("{amount}", fmtUZS(gap));
        progress = Math.max(6, Math.min(100, Math.round(me.total_uzs / target * 100)));
      }
    }
  }
  el.innerHTML =
    '<div class="text-[13px] font-extrabold text-neon-blue w-8 text-center flex-shrink-0">' + (me.rank ? "#" + me.rank : "—") + '</div>' +
    topAvatarHTML(self, 36, "linear-gradient(135deg, #2AABEE, #7B7FE0)", "") +
    '<div class="min-w-0 flex-1">' +
      '<div class="text-[12.5px] font-bold text-white truncate">' + escHTML(title) + '</div>' +
      (sub ? '<div class="text-[10.5px] text-gray-400 leading-snug mt-0.5">' + escHTML(sub) + '</div>' : '') +
      (progress !== null ? '<div class="top-me-bar"><i style="width:' + progress + '%"></i></div>' : '') +
    '</div>' +
    '<span class="top-amt">' + right + '</span>';
  el.classList.remove("hidden");
}

async function renderProfileStats() {
  const box = document.getElementById("profile-stats-box");
  const base = await getShopApiUrl();
  const initData = await waitForInitData();
  if (!base || !initData) { box.classList.add("hidden"); return; }

  try {
    const res = await fetch(base + "/public/my_stats", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData: initData }),
    });
    const stats = await res.json();
    box.innerHTML =
      '<div class="pf-tile">' +
        '<div class="pf-tile-label"><span>🛍</span><span>' + t("pf_spent") + '</span></div>' +
        '<div class="pf-tile-val">' + fmtUZS(stats.total_uzs || 0) + '</div>' +
      '</div>' +
      // Плитка рейтинга ведёт в TOP — там видно, сколько до следующего места.
      '<div class="pf-tile press cursor-pointer" onclick="switchTab(\'top\')">' +
        '<div class="pf-tile-label"><span>🏆</span><span>' + t("pf_rank") + '</span></div>' +
        '<div class="pf-tile-val ' + (stats.rank ? "text-neon-yellow" : "") + '">' +
          (stats.rank ? "#" + stats.rank : '<span class="text-[14px] text-gray-400 font-bold">' + t("pf_rank_none") + '</span>') +
        '</div>' +
      '</div>';
    box.classList.remove("hidden");
  } catch (e) {
    box.classList.add("hidden");
  }
}

async function renderRentTerms() {
  try {
    const res = await fetch("/api/rent_terms");
    const d = await res.json();
    document.getElementById("rent-terms-text").textContent = t("rent_terms")(fmtUZS(d.fee_uzs), fmtUZS(d.refund_uzs));
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
  const base = await getShopApiUrl();
  if (!base) return;
  const t0 = Date.now();
  const initData = await waitForInitData();
  const user = await waitForUnsafeUser();
  try {
    await fetch(base + "/public/_diag", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tg_exists: !!tg,
        platform: tg ? tg.platform : null,
        version: tg ? tg.version : null,
        initData_len: initData ? initData.length : 0,
        unsafe_user_exists: !!user,
        unsafe_user_id: user ? user.id : null,
        wait_ms: Date.now() - t0,
        ua: navigator.userAgent,
      }),
    });
  } catch (e) { /* тихо игнорируем — это диагностика, не критично */ }
}


/* ---------------- Баланс ----------------

Баланс появился из-за банковской комиссии. Клиент отправляет 50 000, а на
карту приходит 49 559 — для заказа это провал (сумма не совпала, заказ висит),
а для баланса просто зачисление на 49 559. Дальше заказы оплачиваются с
баланса точно и мгновенно, без чеков и без сверок.
*/
let balanceData = null;

async function loadBalance() {
  const base = await getShopApiUrl();
  const initData = await waitForInitData();
  if (!base || !initData) return null;
  try {
    const res = await fetch(base + "/public/balance", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData: initData }),
    });
    balanceData = await res.json();
    renderBalance();
    return balanceData;
  } catch (e) { return null; }
}

let lastBalanceShown = null;

function renderBalance() {
  const d = balanceData;
  if (!d) return;
  const amountEl = document.getElementById("bal-amount");
  if (amountEl) amountEl.textContent = fmtUZS(d.balance || 0);

  // Плашка в шапке — она видна с любой вкладки, и именно по ней человек
  // понимает, что деньги дошли.
  const chip = document.getElementById("bal-chip-amount");
  if (chip) chip.textContent = fmtUZS(d.balance || 0);

  const chipBox = document.getElementById("bal-chip");
  if (chipBox && lastBalanceShown !== null && lastBalanceShown !== d.balance) {
    // Подсвечиваем ТОЛЬКО реальное изменение, а не каждый опрос.
    chipBox.classList.remove("bal-changed");
    void chipBox.offsetWidth;
    chipBox.classList.add("bal-changed");
    if (d.balance > lastBalanceShown) {
      if (tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred("success");
      showToast(t("bal_topped_up").replace("{amount}", fmtUZS(d.balance - lastBalanceShown)));
    }
  }
  lastBalanceShown = d.balance;

  const pend = document.getElementById("bal-pending");
  if (pend) {
    const area = document.getElementById("bal-topup-area");
    if (area) area.classList.toggle("hidden", !!d.pending_topup);
    if (d.pending_topup) {
      pend.classList.remove("hidden");
      document.getElementById("bal-pending-amount").textContent = fmtUZS(d.pending_topup.expected);
      document.getElementById("bal-pending-card").textContent = d.card_number || "—";
    } else {
      pend.classList.add("hidden");
    }
  }
}

/*
Автообновление баланса.

Зачем: деньги зачисляются на стороне бота — по SMS или когда владелец нажал
кнопку под чеком. Витрина об этом никак не узнает, и раньше человек видел
старую сумму, пока не закроет и не откроет мини-апп заново. Он думает, что
платёж не дошёл, и идёт писать оператору.

Опрашиваем раз в 15 секунд и ТОЛЬКО пока витрина на экране: в свёрнутом
приложении это просто трата батареи и запросов.
*/
const BALANCE_POLL_MS = 15000;
let balancePollTimer = null;

function startBalancePolling() {
  if (balancePollTimer) return;
  balancePollTimer = setInterval(function() {
    if (document.hidden) return;
    loadBalance();
  }, BALANCE_POLL_MS);
}

document.addEventListener("visibilitychange", function() {
  // Вернулся в витрину — обновляем сразу, не дожидаясь следующего опроса.
  if (!document.hidden) loadBalance();
});

function openBalanceHistory() {
  const box = document.getElementById("bal-history");
  if (!box) return;
  if (!box.classList.contains("hidden")) { box.classList.add("hidden"); return; }

  const items = (balanceData && balanceData.history) || [];
  box.innerHTML = items.length
    ? items.map(function(h) {
        const plus = h.delta_uzs > 0;
        return '<div class="flex justify-between items-center text-[11.5px]">' +
          '<span class="text-gray-400 truncate mr-2">' + (h.reason || "") + '</span>' +
          '<span class="font-semibold whitespace-nowrap ' + (plus ? "text-emerald-400" : "text-gray-300") + '">' +
            (plus ? "+" : "−") + fmtUZS(Math.abs(h.delta_uzs)) +
          '</span></div>';
      }).join("")
    : '<div class="text-[11.5px] text-gray-500">' + t("bal_empty") + '</div>';
  box.classList.remove("hidden");
}

function confirmTopup() {
  return new Promise(function(resolve) {
    if (tg && tg.showPopup) {
      // Колбэк приходит и при простом закрытии окна (id пустой) — поэтому
      // проверяем именно нашу кнопку, как и в окне перед покупкой.
      tg.showPopup(
        {
          message: t("topup_confirm"),
          buttons: [
            { id: "go", type: "default", text: t("bal_topup") },
            { id: "no", type: "cancel" },
          ],
        },
        function(pressed) { resolve(pressed === "go"); }
      );
      return;
    }
    if (tg && tg.showConfirm) {
      tg.showConfirm(t("topup_confirm"), function(ok) { resolve(!!ok); });
      return;
    }
    resolve(window.confirm(t("topup_confirm")));
  });
}

function setTopupAmount(v) {
  const input = document.getElementById("bal-input");
  if (!input) return;
  input.value = v;
  Array.prototype.forEach.call(document.querySelectorAll(".bal-quick"), function(b) {
    b.classList.toggle("active", b.textContent.replace(/\s/g, "") === String(v));
  });
  if (tg && tg.HapticFeedback) tg.HapticFeedback.selectionChanged();
}

async function createTopup(btn) {
  const input = document.getElementById("bal-input");
  const errorEl = document.getElementById("bal-error");
  if (!input) return;
  errorEl.classList.add("hidden");

  const amount = parseInt(input.value, 10);
  const min = (balanceData && balanceData.min_uzs) || 5000;
  const max = (balanceData && balanceData.max_uzs) || 10000000;
  if (isNaN(amount) || amount < min || amount > max) {
    errorEl.textContent = t("bal_err_amount").replace("{min}", fmtUZS(min)).replace("{max}", fmtUZS(max));
    errorEl.classList.remove("hidden");
    return;
  }

  // Предупреждение ДО заявки — то же окно, что перед покупкой. Главное, что
  // человек должен вынести: без чека деньги не зачислятся, и баланс не
  // возвращается. Иначе переводят, молчат и потом пишут оператору.
  if (!(await confirmTopup())) return;

  const base = await getShopApiUrl();
  const initData = await waitForInitData();
  if (!base || !initData) return;

  const prev = btn ? btn.innerHTML : null;
  if (btn) { btn.disabled = true; btn.innerHTML = "⏳"; }
  try {
    const res = await fetch(base + "/public/create_topup", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData: initData, amount: amount }),
    });
    const data = await res.json();
    if (!data.ok) {
      if (data.error === "already_pending") {
        // Заявка уже есть. Подменять её сумму молча нельзя — человек
        // переведёт то, что просил, а совпадёт оно ни с чем.
        errorEl.textContent = t("bal_err_pending").replace("{amount}", fmtUZS(data.expected));
        errorEl.classList.remove("hidden");
        await loadBalance();
        return;
      }
      errorEl.textContent = data.error === "banned" ? t("err_banned") : t("bal_err_amount")
        .replace("{min}", fmtUZS(min)).replace("{max}", fmtUZS(max));
      errorEl.classList.remove("hidden");
      return;
    }
    input.value = "";
    Array.prototype.forEach.call(document.querySelectorAll(".bal-quick"), function(b) { b.classList.remove("active"); });
    if (tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred("success");
    showToast(t("bal_sent"));
    await loadBalance();
  } catch (e) {
    errorEl.textContent = t("ao_err_network");
    errorEl.classList.remove("hidden");
  } finally {
    if (btn && prev !== null) { btn.disabled = false; btn.innerHTML = prev; }
  }
}

async function sendTopupReceipt() {
  const input = document.getElementById("bal-receipt-input");
  const btn = document.getElementById("bal-receipt-btn");
  const errorEl = document.getElementById("bal-receipt-error");
  const file = input && input.files && input.files[0];
  if (!file) return;
  errorEl.classList.add("hidden");

  const base = await getShopApiUrl();
  const initData = await waitForInitData();
  if (!base || !initData) return;

  const prev = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full align-middle" style="animation: spin .7s linear infinite;"></span>';

  try {
    // Сжимаем тем же способом, что и чек по заказу: фото с телефона весит
    // несколько мегабайт, а для чтения суммы хватает 1600px.
    const compressed = await compressReceipt(file, 1600, 0.8);
    const b64 = compressed || (await new Promise(function(resolve) {
      const r = new FileReader();
      r.onload = function() { resolve(r.result); };
      r.onerror = function() { resolve(null); };
      r.readAsDataURL(file);
    }));
    if (!b64) { errorEl.textContent = t("ao_err_network"); errorEl.classList.remove("hidden"); return; }

    const res = await fetch(base + "/public/topup_receipt", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData: initData, image_base64: b64 }),
    });
    const data = await res.json().catch(function() { return {}; });
    if (!data.ok) {
      errorEl.textContent =
        data.error === "duplicate_receipt" ? t("bal_receipt_dup")
        : data.error === "no_topup" ? t("bal_err_pending").replace("{amount}", "")
        : t("ao_err_network");
      errorEl.classList.remove("hidden");
      return;
    }
    if (tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred("success");
    showToast(t("bal_receipt_sent"));
  } catch (e) {
    errorEl.textContent = t("ao_err_network");
    errorEl.classList.remove("hidden");
  } finally {
    btn.disabled = false;
    btn.innerHTML = prev;
    input.value = "";
  }
}

async function cancelTopup(btn) {
  const base = await getShopApiUrl();
  const initData = await waitForInitData();
  if (!base || !initData) return;
  if (btn) btn.disabled = true;
  try {
    await fetch(base + "/public/cancel_topup", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData: initData }),
    });
    await loadBalance();
  } catch (e) {
    showToast(t("ao_err_network"));
  } finally {
    if (btn) btn.disabled = false;
  }
}

async function payFromBalance(btn, orderId) {
  const base = await getShopApiUrl();
  const initData = await waitForInitData();
  if (!base || !initData) return;

  const prev = btn ? btn.innerHTML : null;
  if (btn) { btn.disabled = true; btn.innerHTML = "⏳"; }
  try {
    const res = await fetch(base + "/public/pay_from_balance", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData: initData, order_id: orderId }),
    });
    const data = await res.json();
    if (!data.ok) {
      // Баланс мог устареть: деньги потрачены в другом окне, или заказ уже
      // оплачен. В обоих случаях перечитываем состояние, чтобы кнопка не
      // показывала того, чего уже нет.
      showToast(
        data.error === "insufficient" ? t("bal_pay_short")
        : data.error === "wrong_status" ? t("bal_pay_done")
        : data.error === "busy" ? t("bal_pay_busy")
        : t("ao_err_network")
      );
      await loadBalance();
      pollOrderFlow();
      return;
    }
    if (tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred("success");
    balanceData = null;
    loadBalance();
    pollOrderFlow();
    refreshActiveOrder();
  } catch (e) {
    showToast(t("ao_err_network"));
  } finally {
    if (btn && prev !== null) { btn.disabled = false; btn.innerHTML = prev; }
  }
}

/* ---------------- Заставка и обучение ----------------

Заставка закрывает пустой чёрный экран, который Telegram показывает, пока
поднимается мини-апп. Правила простые:
- показываем не меньше MIN (иначе моргнёт и будет выглядеть как глюк);
- убираем не позже MAX, даже если что-то не догрузилось — держать человека
  перед логотипом дольше трёх секунд означает потерять его.
*/
const SPLASH_MIN_MS = 1100;
const SPLASH_MAX_MS = 2600;
const splashStartedAt = Date.now();
let splashHidden = false;

function hideSplash() {
  if (splashHidden) return;
  splashHidden = true;
  const el = document.getElementById("splash");
  if (!el) return;
  el.classList.add("splash-done");
  setTimeout(function() {
    el.remove();
    maybeStartTour();
  }, 520);
}

function scheduleSplashHide() {
  const waited = Date.now() - splashStartedAt;
  setTimeout(hideSplash, Math.max(0, SPLASH_MIN_MS - waited));
}

// Страховка: что бы ни случилось с сетью или видео, заставка уйдёт.
setTimeout(hideSplash, SPLASH_MAX_MS);

/* ---- Обучение для новых покупателей ---- */
const TOUR_KEY = "oson_tour_done_v1";
const TOUR_STEPS = [
  { emoji: "🛍", title: "tour1_title", text: "tour1_text" },
  { emoji: "💳", title: "tour2_title", text: "tour2_text" },
  { emoji: "✅", title: "tour3_title", text: "tour3_text" },
  { emoji: "💼", title: "tour4_title", text: "tour4_text" },
];
let tourStep = 0;

function tourAlreadySeen() {
  try { return localStorage.getItem(TOUR_KEY) === "1"; }
  catch (e) { return true; }  // нет доступа к хранилищу — лучше не показывать
}

function markTourSeen() {
  try { localStorage.setItem(TOUR_KEY, "1"); } catch (e) { /* не страшно */ }
}

function maybeStartTour() {
  if (tourAlreadySeen()) return;
  tourStep = 0;
  renderTour();
  const el = document.getElementById("tour");
  if (el) el.classList.remove("hidden");
}

function renderTour() {
  const step = TOUR_STEPS[tourStep];
  if (!step) return;
  document.getElementById("tour-emoji").textContent = step.emoji;
  document.getElementById("tour-title").textContent = t(step.title);
  document.getElementById("tour-text").textContent = t(step.text);
  document.getElementById("tour-step-label").textContent = (tourStep + 1) + " / " + TOUR_STEPS.length;
  document.getElementById("tour-next").textContent =
    tourStep === TOUR_STEPS.length - 1 ? t("tour_start") : t("tour_next");
  document.getElementById("tour-dots").innerHTML = TOUR_STEPS.map(function(_, i) {
    return '<span class="rounded-full transition-all" style="width:' + (i === tourStep ? 20 : 6) +
      'px;height:6px;background:' + (i === tourStep ? "#D9B45B" : "rgba(255,255,255,.18)") + '"></span>';
  }).join("");
  const card = document.getElementById("tour-card");
  if (card) { card.style.animation = "none"; void card.offsetWidth; card.style.animation = ""; }
}

function tourNext() {
  if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred("light");
  if (tourStep < TOUR_STEPS.length - 1) { tourStep++; renderTour(); return; }
  closeTour();
}

function closeTour() {
  markTourSeen();
  const el = document.getElementById("tour");
  if (el) el.classList.add("hidden");
}

applyI18n();
initProfile();
initSupportInfo();
initLiveFeed();
sendDiag();
loadBalance();          // нужен для кнопки «Оплатить с баланса» на экране заказа
startBalancePolling();  // и чтобы зачисление было видно без перезахода
// Каталог отрисован — заставку можно убирать (но не раньше SPLASH_MIN_MS).
scheduleSplashHide();
// Аренды тянем на старте, а не только при заходе на вкладку: если срок
// заканчивается сегодня, человек должен увидеть это сразу.
renderMyRentals();

/* ---------------- Живая лента заказов ---------------- */
function timeAgoLabel(ts) {
  const diffMin = Math.max(1, Math.round((Date.now() / 1000 - ts) / 60));
  if (diffMin < 60) return diffMin + " " + t("minutes_ago");
  const diffH = Math.round(diffMin / 60);
  return diffH + " " + t("hours_ago");
}

async function initLiveFeed() {
  let items = [];
  try {
    const res = await fetch("/api/live_feed");
    items = await res.json();
  } catch (e) { return; }

  if (!items.length) return;

  const bar = document.getElementById("live-feed-bar");
  const textEl = document.getElementById("live-feed-text");
  bar.classList.remove("hidden");

  let i = 0;
  function paint() {
    const it = items[i % items.length];
    textEl.style.opacity = 0;
    setTimeout(function() {
      textEl.textContent = it.emoji + " " + it.label + " · " + timeAgoLabel(it.ts);
      textEl.style.opacity = 1;
    }, 250);
    i++;
  }
  paint();
  setInterval(paint, 3500);
}

/* ================= Как работает аренда (пошагово) ================= */
function toggleRentHowto() {
  const box = document.getElementById("rent-howto");
  const arrow = document.getElementById("howto-arrow");
  const opening = box.classList.contains("hidden");
  if (opening && !box.innerHTML) {
    box.innerHTML = (t("howto_steps") || []).map(function(step, i) {
      return '<div class="glass-card rounded-2xl p-3 flex items-start gap-3" ' +
        'style="animation: sheetUp .3s cubic-bezier(.2,.9,.25,1) both; animation-delay:' + (i * 40) + 'ms;">' +
        '<span class="w-6 h-6 rounded-full bg-neon-blue/15 text-neon-blue text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">' + (i + 1) + '</span>' +
        '<span class="text-[12px] text-gray-300 leading-snug">' + step + '</span>' +
      '</div>';
    }).join("");
  }
  box.classList.toggle("hidden");
  arrow.style.transform = opening ? "rotate(180deg)" : "";
}

/* ================= Мои аренды + продление ================= */
let myRentals = [];

function rentLeftLabel(seconds) {
  if (seconds >= 86400) {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    return d + " " + t("rent_days_short") + (h ? " " + h + " " + t("rent_hours_short") : "");
  }
  const h = Math.max(1, Math.floor(seconds / 3600));
  return h + " " + t("rent_hours_short");
}

async function renderMyRentals() {
  const box = document.getElementById("my-rentals-box");
  const listEl = document.getElementById("my-rentals-list");
  if (!box) return;

  const base = await getShopApiUrl();
  const initData = await waitForInitData();
  if (!base || !initData) { box.classList.add("hidden"); return; }

  try {
    const res = await fetch(base + "/public/my_rentals", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData: initData }),
    });
    const data = await res.json();
    myRentals = data.rentals || [];
  } catch (e) { box.classList.add("hidden"); return; }

  if (!myRentals.length) { box.classList.add("hidden"); listEl.innerHTML = ""; return; }

  box.classList.remove("hidden");
  listEl.innerHTML = myRentals.map(function(r, i) {
    // Меньше суток — подсвечиваем красным: это последний момент продлить,
    // потом подарок просто исчезнет из профиля.
    const soon = r.seconds_left < 86400;
    const leftClass = soon ? "text-red-400" : "text-neon-blue";
    const extendBtn = r.can_extend
      ? '<button data-i="' + i + '" class="rent-extend-btn press pill-gold rounded-xl px-3 py-2 text-[11px] font-bold flex-shrink-0">' + t("rent_extend") + '</button>'
      : "";
    return '<div class="glass-card rounded-[20px] p-3.5"' +
      (soon ? ' style="border-color: rgba(248,113,113,0.45);"' : '') + '>' +
      '<div class="flex items-center gap-3">' +
      '<div class="min-w-0 flex-1">' +
        '<div class="text-[13px] font-semibold text-white truncate">🖼 ' + escHTML(r.item_name) + '</div>' +
        '<div class="text-[11px] ' + leftClass + ' mt-0.5">' +
          (soon ? "⚠️ " + t("rent_ending_soon") + " · " : "") +
          t("rent_ends_in") + ": " + rentLeftLabel(r.seconds_left) +
        '</div>' +
        (r.price_per_day_uzs
          ? '<div class="text-[10px] text-gray-500 mt-0.5">' + fmtUZS(r.price_per_day_uzs) + ' · 1 ' + t("rent_days_suffix") + '</div>'
          : '') +
      '</div>' +
      '<div class="flex flex-col gap-1.5 flex-shrink-0">' + extendBtn +
        '<button onclick="toggleRelink(' + i + ')" class="press pill rounded-xl px-3 py-2 text-[11px] font-semibold text-neon-blue">' + t("relink_btn") + '</button>' +
      '</div>' +
      '</div>' +
      // Раскрывается по «Qayta ulash»: ссылка на Fragment живёт, пока открыта
      // выдавшая её страница, и на Android часто умирает — новая ссылка лечит.
      '<div id="relink-box-' + i + '" class="relink-box hidden mt-3 pt-3 border-t border-white/[0.08]">' +
        '<div class="text-[12px] font-semibold text-white mb-1">🔗 ' + t("relink_title") + '</div>' +
        '<div class="text-[11px] text-gray-400 mb-2.5 leading-snug">' + t("relink_hint") + '</div>' +
        '<input type="text" placeholder="tc://..." class="w-full bg-white/[0.04] border border-white/[0.09] rounded-xl px-3 py-2.5 text-[11px] text-white focus:outline-none focus:border-neon-blue/60 mb-2" />' +
        '<p class="relink-error hidden text-red-400 text-[11px] mb-2"></p>' +
        '<button onclick="submitRelink(' + i + ', this)" class="press w-full py-3 rounded-xl btn-primary font-semibold text-white text-[13px] mb-2">' + t("relink_send") + '</button>' +
        tutorialButtonsHTML(false, true) +
      '</div>' +
    '</div>';
  }).join("");

  Array.prototype.forEach.call(listEl.querySelectorAll(".rent-extend-btn"), function(btn) {
    btn.addEventListener("click", function() { openExtendModal(myRentals[Number(btn.dataset.i)]); });
  });
}

function openExtendModal(rental) {
  if (!rental) return;
  openModal({
    kind: "nft_rent_extend",
    title: t("rent_extend_title") + ": " + rental.item_name,
    price: rental.price_per_day_uzs,
    emoji: "⏳",
    raw: rental,
  });
}

/* ================= Активный заказ + ввод ссылки аренды ================= */
const ORDER_STATUS_KEY = {
  awaiting_payment: "ao_awaiting_payment",
  payment_review: "ao_payment_review",
  paid: "ao_paid",
  fulfilling: "ao_fulfilling",
};

async function refreshActiveOrder() {
  const bar = document.getElementById("active-order-bar");
  const base = await getShopApiUrl();
  const initData = await waitForInitData();
  if (!base || !initData) { bar.classList.add("hidden"); return; }

  let active = null;
  try {
    const res = await fetch(base + "/public/active_order", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData: initData }),
    });
    const data = await res.json();
    active = data.active;
  } catch (e) { /* молча — баннер просто не покажем */ }

  if (!active) { bar.classList.add("hidden"); bar.innerHTML = ""; return; }

  const statusText = t(ORDER_STATUS_KEY[active.status] || "ao_fulfilling");
  const linkBlock = active.needs_rent_link
    ? '<div class="mt-3 pt-3 border-t border-white/[0.08]">' +
        '<div class="text-[12px] font-semibold text-white mb-1">🔗 ' + t("ao_link_title") + '</div>' +
        '<div class="text-[11px] text-gray-400 mb-2.5 leading-snug">' + t("ao_link_hint") + '</div>' +
        androidLinkHintHTML() +
        '<input id="rent-link-input" type="text" placeholder="tc://..." class="w-full bg-white/[0.04] border border-white/[0.09] rounded-xl px-3 py-2.5 text-[11px] text-white focus:outline-none focus:border-neon-blue/60 mb-2" />' +
        '<p id="rent-link-error" class="hidden text-red-400 text-[11px] mb-2"></p>' +
        '<button onclick="submitRentLink()" id="rent-link-btn" class="press w-full py-3 rounded-xl btn-primary font-semibold text-white text-[13px] mb-2">' + t("ao_link_send") + '</button>' +
        // Кнопка одна. Раньше их было две с ОДИНАКОВОЙ подписью: первая
        // присылала видео, вторая просто закрывала витрину — человек жал
        // наугад и в половине случаев оставался без инструкции.
        tutorialButtonsHTML(false, true) +
      '</div>'
    : "";

  // Оплата прямо в витрине: карта + загрузка чека, без ухода в чат бота
  const payBlock = active.needs_payment
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
  const canCancelNow = active.status === "awaiting_payment" || active.status === "payment_review";
  const canAskCancel = active.status === "paid" || active.status === "fulfilling";
  const cancelBtn = (canCancelNow || canAskCancel)
    ? '<button onclick="cancelActiveOrder(' + active.id + ', ' + (canAskCancel ? "true" : "false") + ')" class="press mt-3 w-full py-2.5 rounded-xl pill text-[11px] font-medium text-gray-400">' + t(canAskCancel ? "ao_cancel_request" : "ao_cancel") + '</button>'
    : "";

  // Заказ из корзины — показываем все товары списком, иначе человек видел бы
  // только один товар из нескольких и не понял бы, за что общая сумма.
  const cartItems = active.cart_items || [];
  const isCart = cartItems.length > 0;
  const titleLine = isCart
    ? '🛒 ' + t("cart_active_title") + ' · ' + cartItems.length + ' ' + t("cart_items_suffix")
    : escHTML(displayItemName(active.item_name, active.category));
  const cartItemsBlock = isCart
    ? '<div class="mt-2 pt-2 border-t border-white/[0.08] space-y-1">' +
        cartItems.map(function(it) {
          return '<div class="flex justify-between gap-2 text-[11px]">' +
            '<span class="text-gray-300 truncate">' + it.item_name + '</span>' +
            '<span class="text-gray-400 flex-shrink-0">' + fmtUZS(it.price_uzs) + '</span>' +
          '</div>';
        }).join("") +
      '</div>'
    : "";

  bar.classList.remove("hidden");
  bar.innerHTML =
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
      cartItemsBlock + payBlock +
      // Premium после оплаты — сразу видно, как связаться с админом.
      ((active.category === "premium" && (active.status === "paid" || active.status === "fulfilling"))
        ? '<div class="mt-3">' + premiumContactHTML(active.id, active.item_name) + '</div>' : "") +
      linkBlock + cancelBtn +
    '</div>';
}

async function cancelActiveOrder(orderId, isRequest) {
  askConfirm(
    t(isRequest ? "ao_cancel_request_confirm" : "ao_cancel_confirm"),
    function() { doCancelActiveOrder(orderId); }
  );
}

async function doCancelActiveOrder(orderId) {
  const base = await getShopApiUrl();
  const initData = await waitForInitData();
  if (!base || !initData) return;
  try {
    const res = await fetch(base + "/public/cancel_order", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData: initData, order_id: orderId }),
    });
    const data = await res.json().catch(function() { return {}; });
    // Оплаченный заказ отменяет продавец — клиенту честно говорим, что ушёл
    // запрос, а не что заказ уже отменён (иначе он решит, что всё, и уйдёт).
    if (data && data.requested) {
      if (tg && tg.showAlert) tg.showAlert(t("ao_cancel_requested"));
      else alert(t("ao_cancel_requested"));
    }
  } catch (e) { /* молча — просто обновим баннер ниже */ }
  refreshActiveOrder();
}

function copyActiveCard(number) {
  navigator.clipboard.writeText(number);
  if (tg && tg.showAlert) tg.showAlert(t("copied")); else alert(t("copied"));
}

async function submitReceipt(orderId) {
  const input = document.getElementById("receipt-input");
  const btn = document.getElementById("receipt-btn");
  const errorEl = document.getElementById("receipt-error");
  if (!input || !input.files || !input.files[0]) return;

  const file = input.files[0];
  errorEl.classList.add("hidden");
  if (file.size > 25 * 1024 * 1024) {
    errorEl.textContent = t("ao_err_too_big"); errorEl.classList.remove("hidden"); return;
  }

  const base = await getShopApiUrl();
  const initData = await waitForInitData();
  if (!base || !initData) return;

  const prev = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full align-middle" style="animation: spin .7s linear infinite;"></span>';

  try {
    const base64 = await receiptToBase64(file);
    const res = await fetch(base + "/public/submit_receipt", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData: initData, order_id: orderId, image_base64: base64 }),
    });
    const data = await res.json();
    if (data.ok) {
      if (tg && tg.showAlert) tg.showAlert(t("ao_receipt_sent")); else alert(t("ao_receipt_sent"));
      refreshActiveOrder();
    } else {
      // Показываем конкретную причину, а не общее "не удалось" —
      // иначе непонятно, что именно исправлять.
      const reasons = {
        wrong_status: t("ao_err_wrong_status"),
        too_big: t("ao_err_too_big"),
        no_image: t("ao_err_no_image"),
        bad_image: t("ao_err_no_image"),
        not_found: t("ao_err_not_found"),
        banned: t("err_banned"),
      };
      errorEl.textContent = reasons[data.error] || (t("ao_err_receipt") + " (" + (data.error || res.status) + ")");
      errorEl.classList.remove("hidden");
    }
  } catch (e) {
    errorEl.textContent = t("ao_err_network"); errorEl.classList.remove("hidden");
  } finally {
    btn.disabled = false;
    btn.innerHTML = prev;
    input.value = "";
  }
}

/**
 * Показать видео-инструкцию «как получить ссылку для аренды».
 *
 * Видео приходит в чат бота, а ссылку человек вводит здесь, в витрине. К
 * моменту, когда инструкция понадобилась, она уже уехала вверх по переписке —
 * искать её там неудобно. Поэтому кнопка просит бота прислать видео заново и
 * закрывает витрину: человек оказывается в чате прямо на свежем сообщении.
 */
/* Две кнопки инструкции: Android и iPhone. Кнопка телефона, с которого
   человек сидит, — первой и яркой; вторая — на случай, если определили не так
   (или он помогает другу с другого телефона). */
function tutorialButtonsHTML(big, muted) {
  const android = isAndroidClient();
  const order = android ? ["android", "ios"] : ["ios", "android"];
  return order.map(function(pf, i) {
    // muted — когда рядом уже есть главная кнопка (например «Qayta ulash»):
    // тогда обе инструкции второстепенные, чтобы не было двух ярких подряд.
    const primary = i === 0 && !muted;
    const cls = primary
      ? "btn-primary text-white font-semibold " + (big ? "py-3.5 text-sm rounded-2xl" : "py-3 text-[12px] rounded-xl")
      : "pill text-neon-blue font-medium " + (big ? "py-3 text-[12px] rounded-2xl" : "py-2.5 text-[11px] rounded-xl");
    return '<button onclick="watchRentTutorial(this)" data-platform="' + pf + '" class="press w-full ' + cls + (i ? " mt-2" : "") + '">' +
      t(pf === "android" ? "tut_android" : "tut_ios") + '</button>';
  }).join("");
}

/* «Qayta ulash» у действующей аренды: поле для новой ссылки прямо в карточке. */
function toggleRelink(i) {
  const el = document.getElementById("relink-box-" + i);
  if (!el) return;
  const open = el.classList.contains("hidden");
  Array.prototype.forEach.call(document.querySelectorAll(".relink-box"), function(b) { b.classList.add("hidden"); });
  if (open) {
    el.classList.remove("hidden");
    const inp = el.querySelector("input");
    if (inp) inp.focus();
  }
}

async function submitRelink(i, btn) {
  const r = myRentals[i];
  const box = document.getElementById("relink-box-" + i);
  if (!r || !box) return;
  const input = box.querySelector("input");
  const errEl = box.querySelector(".relink-error");
  const link = (input.value || "").trim();
  errEl.classList.add("hidden");
  if (!/^(tc:\/\/|https?:\/\/|t\.me\/)\S+$/i.test(link)) {
    errEl.textContent = t("ao_err_bad_link"); errEl.classList.remove("hidden"); return;
  }
  const base = await getShopApiUrl();
  const initData = await waitForInitData();
  if (!base || !initData) return;
  const prev = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full align-middle" style="animation: spin .7s linear infinite;"></span>';
  try {
    const res = await fetch(base + "/public/submit_rent_link", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData: initData, link: link, order_id: r.order_id }),
    });
    const data = await res.json();
    if (data.ok) {
      input.value = "";
      box.classList.add("hidden");
      showToast(t(data.connected ? "ao_connected" : "relink_ok"));
      if (tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred("success");
    } else {
      errEl.textContent = t(data.error === "bad_link" ? "ao_err_bad_link" : "ao_err_connect");
      errEl.classList.remove("hidden");
    }
  } catch (e) {
    errEl.textContent = t("ao_err_network"); errEl.classList.remove("hidden");
  }
  btn.disabled = false;
  btn.innerHTML = prev;
}

async function watchRentTutorial(btn) {
  const prev = btn ? btn.innerHTML : null;
  if (btn) { btn.disabled = true; btn.innerHTML = "⏳"; }
  try {
    const base = await getShopApiUrl();
    const initData = await waitForInitData();
    if (!base || !initData) return;

    const res = await fetch(base + "/public/send_rent_tutorial", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData: initData, platform: (btn && btn.dataset.platform) || (tg && tg.platform) || "" }),
    });
    const data = await res.json().catch(function() { return {}; });
    if (!data.ok) {
      showToast(t("ao_err_network"));
      return;
    }
    if (tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred("success");
    // Закрываем витрину — она открыта поверх чата с ботом, и человек
    // оказывается ровно там, куда только что пришло видео.
    if (tg && tg.close) tg.close();
  } catch (e) {
    showToast(t("ao_err_network"));
  } finally {
    if (btn && prev !== null) { btn.disabled = false; btn.innerHTML = prev; }
  }
}

async function watchDisplayVideo(btn) {
  // Шлём инструкцию в чат и закрываем витрину — человек оказывается прямо
  // там, куда только что пришло видео. То же поведение, что у тутора по
  // ссылке: два разных экрана с одинаковой логикой только путали бы.
  const prev = btn ? btn.innerHTML : null;
  if (btn) { btn.disabled = true; btn.innerHTML = "⏳"; }
  try {
    const base = await getShopApiUrl();
    const initData = await waitForInitData();
    if (!base || !initData) return;

    const res = await fetch(base + "/public/send_display_video", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData: initData }),
    });
    const data = await res.json().catch(function() { return {}; });
    if (!data.ok) { showToast(t("ao_err_network")); return; }
    if (tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred("success");
    if (tg && tg.close) tg.close();
  } catch (e) {
    showToast(t("ao_err_network"));
  } finally {
    if (btn && prev !== null) { btn.disabled = false; btn.innerHTML = prev; }
  }
}

/* Ссылка tc:// живёт, пока открыта страница Fragment, которая её выдала.
   Android часто перезагружает эту вкладку, пока человек бегает в бот, —
   бот пишет «подключено», а на Fragment пусто. Поэтому андроидщикам
   показываем, как этого избежать, прямо рядом с полем для ссылки. */
function isAndroidClient() {
  const pf = (tg && tg.platform) || "";
  return /android/i.test(pf) || (!pf && /android/i.test(navigator.userAgent || ""));
}
function androidLinkHintHTML() {
  if (!isAndroidClient()) return "";
  return '<div class="rounded-xl p-2.5 mb-2.5 text-[11px] leading-snug text-gray-200" ' +
    'style="background:rgba(217,180,91,0.10);border:1px solid rgba(217,180,91,0.35)">' + t("ao_android_hint") + '</div>';
}

/* «1 месяц», «12 месяцев (akkauntga kirib)» из прайса → название на языке
   витрины: «1 oylik», «12 months (via account login)». Неизвестный формат
   показываем как есть. */
/* Название заказа для показа. Бот хранит «Premium — 1 месяц» (по нему
   сверяется цена), а человеку показываем на его языке. */
function displayItemName(name, category) {
  const n = String(name || "");
  const m = /^Premium\s*[—-]\s*(.+)$/i.exec(n);
  if (category === "premium" || m) return m ? "Premium — " + premiumLabel(m[1]) : premiumLabel(n);
  return n;
}

function premiumLabel(label) {
  const src = String(label || "");
  // [а-яё] вместо \w: в JavaScript \w не считает кириллицу буквой, и от
  // «месяца» оставался бы хвост «а».
  const m = /^\s*(\d+)\s*(месяц[а-яё]*|мес\.?|oy[a-z'ʻ]*|month[a-z]*)\s*(.*)$/i.exec(src);
  if (!m) return src;
  const n = parseInt(m[1], 10);
  let rest = m[3].trim();
  const SUFFIX = [
    { re: /kirmasdan/i, uz: "(akkauntga kirmasdan)", ru: "(без входа в аккаунт)", en: "(without account login)" },
    { re: /kirib/i,     uz: "(akkauntga kirib)",     ru: "(со входом в аккаунт)", en: "(via account login)" },
  ];
  for (let i = 0; i < SUFFIX.length; i++) {
    if (SUFFIX[i].re.test(rest)) { rest = SUFFIX[i][lang] || rest; break; }
  }
  let head;
  if (lang === "ru") {
    const d = n % 10, dd = n % 100;
    const word = (d === 1 && dd !== 11) ? "месяц" : (d >= 2 && d <= 4 && (dd < 12 || dd > 14)) ? "месяца" : "месяцев";
    head = n + " " + word;
  } else if (lang === "en") {
    head = n + (n === 1 ? " month" : " months");
  } else {
    head = n + " oylik";
  }
  return rest ? head + " " + rest : head;
}

/* Premium владелец оформляет руками — после оплаты клиент пишет ему.
   Кнопка открывает чат с админом с уже вписанным текстом заказа; вторая —
   для аккаунтов в спам-блоке, которые не могут написать первыми. */
let supportInfoCache = null;
function premiumContactHTML(orderId, itemName) {
  return '<div class="rounded-2xl p-3.5 mb-3 text-left" style="background:rgba(142,140,216,0.10);border:1px solid rgba(142,140,216,0.35)">' +
      '<div class="text-[13px] font-bold text-white mb-1">💎 ' + t("pc_title") + '</div>' +
      '<div class="text-[11px] text-gray-400 mb-2.5 leading-snug">' + t("pc_hint") + '</div>' +
      '<button onclick="writeAdminAboutPremium(' + Number(orderId) + ', this)" data-item="' + escHTML(itemName || "") + '" ' +
        'class="press w-full py-3 rounded-xl btn-primary font-semibold text-white text-[13px]">' + t("pc_write") + '</button>' +
      '<button onclick="reportSpamBlock(' + Number(orderId) + ', this)" ' +
        'class="press w-full py-2.5 mt-2 rounded-xl pill text-[12px] font-semibold text-gray-300">' + t("pc_spam") + '</button>' +
      '<div class="text-[10.5px] text-gray-500 mt-1.5 text-center leading-snug">' + t("pc_spam_hint") + '</div>' +
    '</div>';
}

async function writeAdminAboutPremium(orderId, btn) {
  let info = supportInfoCache;
  if (!info) {
    try { info = await (await fetch("/api/support_info")).json(); supportInfoCache = info; } catch (e) { info = {}; }
  }
  const op = String((info && info.operator_username) || "").replace(/^@/, "");
  if (!op) { showToast(t("ao_err_network")); return; }
  const raw = (btn && btn.dataset.item) || "";
  const item = premiumLabel(raw.replace(/^Premium\s*[—-]\s*/i, ""));
  const text = t("pc_msg").replace("{item}", item).replace("{id}", orderId);
  const url = "https://t.me/" + encodeURIComponent(op) + "?text=" + encodeURIComponent(text);
  if (tg && tg.openTelegramLink) tg.openTelegramLink(url);
  else window.open(url, "_blank");
}

async function reportSpamBlock(orderId, btn) {
  const base = await getShopApiUrl();
  const initData = await waitForInitData();
  if (!base || !initData) return;
  const prev = btn.innerHTML;
  btn.disabled = true;
  try {
    const res = await fetch(base + "/public/spam_help", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData: initData, order_id: orderId }),
    });
    const data = await res.json();
    if (data.ok) {
      btn.innerHTML = t("pc_spam_done");
      btn.classList.add("text-emerald-400");
      if (tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred("success");
      return;  // кнопка остаётся выключенной — второй раз жать незачем
    }
    showToast(t("ao_err_network"));
  } catch (e) {
    showToast(t("ao_err_network"));
  }
  btn.disabled = false;
  btn.innerHTML = prev;
}

async function submitRentLink() {
  const input = document.getElementById("rent-link-input");
  const errorEl = document.getElementById("rent-link-error");
  const btn = document.getElementById("rent-link-btn");
  if (!input) return;

  const link = input.value.trim();
  errorEl.classList.add("hidden");
  if (!link) { errorEl.textContent = t("ao_err_empty"); errorEl.classList.remove("hidden"); return; }

  const base = await getShopApiUrl();
  const initData = await waitForInitData();
  if (!base || !initData) return;

  const prev = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full align-middle" style="animation: spin .7s linear infinite;"></span>';

  try {
    const res = await fetch(base + "/public/submit_rent_link", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData: initData, link: link }),
    });
    const data = await res.json();
    if (data.ok) {
      // Реальный успех от backend, а не таймер. Подарок подключён — показываем
      // это на экране статуса и ждём, пока админ отметит заказ выполненным.
      //
      // data.pending — ссылка принята, но подключить прямо сейчас не вышло:
      // почти всегда продавец ещё не подтвердил перевод за аренду, бот сам
      // дожмёт за несколько минут. Это НЕ ошибка, пугать человека нечем —
      // он уже всё сделал правильно, ссылка сохранена.
      if (tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred("success");
      showToast(t(data.pending ? "ao_connect_pending" : "ao_connected"));
      if (flowOrder) { pollOrderFlow(); startFlowPolling(); }
      else openOrderFlow({ order_id: data.order_id });
      refreshActiveOrder();
    } else if (data.error === "duplicate_receipt") {
      errorEl.textContent = t("ao_err_duplicate"); errorEl.classList.remove("hidden");
    } else if (data.error === "bad_link") {
      errorEl.textContent = t("ao_err_bad_link"); errorEl.classList.remove("hidden");
    } else {
      errorEl.textContent = t("ao_err_connect"); errorEl.classList.remove("hidden");
    }
  } catch (e) {
    errorEl.textContent = t("ao_err_network"); errorEl.classList.remove("hidden");
  } finally {
    btn.disabled = false;
    btn.innerHTML = prev;
  }
}

refreshActiveOrder();


/* ================= Отзывы ================= */

/* Экран «Bajarildi»: пять звёзд, после выбора — поле для комментария и
   кнопка. Оценка уходит одним запросом вместе с комментарием. */
let rateValue = 0;
function rateBoxHTML() {
  rateValue = 0;
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars += '<button class="rate-star" data-v="' + i + '" onclick="pickRate(' + i + ')" aria-label="' + i + '">★</button>';
  }
  return '<div id="rate-box" class="rate-box">' +
      '<div class="text-[15px] font-bold text-white">' + t("rate_title") + '</div>' +
      '<div class="text-[11.5px] text-gray-400 mt-0.5">' + t("rate_sub") + '</div>' +
      '<div class="rate-stars">' + stars + '</div>' +
      '<div class="rate-hint" id="rate-hint"></div>' +
      '<div class="rate-extra">' +
        '<textarea id="rate-comment" class="rate-comment" maxlength="500" placeholder="' + escHTML(t("rate_ph_good")) + '"></textarea>' +
        '<p id="rate-error" class="hidden text-red-400 text-[11px] mt-1.5"></p>' +
        '<button id="rate-send" onclick="sendRate()" class="press w-full mt-2.5 py-3 rounded-xl btn-primary font-semibold text-white text-[13px]">' + t("rate_send") + '</button>' +
      '</div>' +
    '</div>';
}

function pickRate(v) {
  rateValue = v;
  const box = document.getElementById("rate-box");
  if (!box) return;
  Array.prototype.forEach.call(box.querySelectorAll(".rate-star"), function(b) {
    const n = Number(b.dataset.v);
    b.classList.toggle("on", n <= v);
    b.classList.remove("pop");
    if (n === v) { void b.offsetWidth; b.classList.add("pop"); setTimeout(function() { b.classList.remove("pop"); }, 200); }
  });
  const labels = t("rate_labels");
  document.getElementById("rate-hint").textContent = Array.isArray(labels) ? labels[v] : "";
  document.getElementById("rate-comment").placeholder = t(v <= 3 ? "rate_ph_bad" : "rate_ph_good");
  box.classList.add("picked");
  if (tg && tg.HapticFeedback) tg.HapticFeedback.selectionChanged();
}

async function sendRate() {
  if (!rateValue || !flowOrder) return;
  const btn = document.getElementById("rate-send");
  const errEl = document.getElementById("rate-error");
  const base = await getShopApiUrl();
  const initData = await waitForInitData();
  if (!base || !initData) return;
  errEl.classList.add("hidden");
  const prev = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full align-middle" style="animation: spin .7s linear infinite;"></span>';
  try {
    const res = await fetch(base + "/public/review", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        initData: initData,
        order_id: (flowStatus && flowStatus.order_id) || flowOrder.order_id,
        rating: rateValue,
        comment: (document.getElementById("rate-comment").value || "").trim(),
      }),
    });
    const data = await res.json();
    // «already» — уже оценил (например, кнопкой в чате): это не ошибка.
    if (data.ok || data.error === "already") {
      if (flowStatus) flowStatus.reviewed = true;
      const box = document.getElementById("rate-box");
      if (box) {
        box.classList.remove("picked");
        box.innerHTML = '<div class="text-[15px] font-bold text-white py-1">' + t("rate_thanks") + '</div>' +
          '<div class="rv-item-stars text-[16px] mt-1">' + "★".repeat(rateValue) + '</div>';
      }
      if (tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred("success");
      loadReviewsSummary(true);
      return;
    }
    errEl.textContent = t("rate_err"); errEl.classList.remove("hidden");
  } catch (e) {
    errEl.textContent = t("rate_err"); errEl.classList.remove("hidden");
  }
  btn.disabled = false;
  btn.innerHTML = prev;
}

/* Плашка «★ 4.9 · 312 ta sharh» на главной и лист со свежими отзывами. */
var reviewsData = null;  // var, а не let: applyI18n может обратиться к ней раньше этой строки
let rvQuoteTimer = null;

async function loadReviewsSummary(force) {
  const base = await getShopApiUrl();
  if (!base) return;
  try {
    const res = await fetch(base + "/public/reviews" + (force ? "?t=" + Date.now() : ""));
    reviewsData = await res.json();
  } catch (e) { return; }
  renderReviewsBanner();
}

function starsText(avg) {
  const full = Math.round(avg || 0);
  return "★★★★★".slice(0, full) + "☆☆☆☆☆".slice(0, 5 - full);
}

function renderReviewsBanner() {
  const banner = document.getElementById("rv-banner");
  const d = reviewsData;
  if (!banner || !d || !d.count) { if (banner) banner.classList.add("hidden"); return; }
  document.getElementById("rv-avg").textContent = Number(d.avg).toFixed(1);
  document.getElementById("rv-count").textContent = t("rv_count").replace("{n}", d.count);
  banner.classList.remove("hidden");

  // Под числом по очереди показываем короткие цитаты из отзывов с текстом.
  const quotes = (d.items || []).filter(function(i) { return i.comment; }).slice(0, 8);
  const q = document.getElementById("rv-quote");
  if (rvQuoteTimer) { clearInterval(rvQuoteTimer); rvQuoteTimer = null; }
  if (!quotes.length) { q.textContent = ""; return; }
  let k = 0;
  const show = function() {
    const it = quotes[k % quotes.length]; k++;
    q.style.opacity = 0;
    setTimeout(function() { q.textContent = "«" + it.comment + "» — " + it.name; q.style.opacity = 1; }, 250);
  };
  show();
  if (quotes.length > 1) rvQuoteTimer = setInterval(show, 4500);
}

function openReviewsSheet() {
  const d = reviewsData;
  if (!d) return;
  document.getElementById("rv-sheet-avg").textContent = d.avg ? Number(d.avg).toFixed(1) : "—";
  document.getElementById("rv-sheet-stars").textContent = starsText(d.avg);
  document.getElementById("rv-sheet-count").textContent = t("rv_count").replace("{n}", d.count || 0);
  const list = document.getElementById("rv-list");
  list.innerHTML = (d.items || []).length
    ? d.items.map(function(r) {
        const what = r.cart_size > 1 ? "🛒 " + r.cart_size : r.item;
        return '<div class="rv-item">' +
          '<div class="flex items-center justify-between gap-2">' +
            '<span class="text-[13px] font-semibold text-white truncate">' + escHTML(r.name) + '</span>' +
            '<span class="rv-item-stars flex-shrink-0">' + "★".repeat(r.rating) + '<span style="color:rgba(255,255,255,.15)">' + "★".repeat(5 - r.rating) + '</span></span>' +
          '</div>' +
          (r.comment ? '<div class="text-[12.5px] text-gray-200 mt-1.5 leading-snug">' + escHTML(r.comment) + '</div>' : '') +
          '<div class="text-[10.5px] text-gray-500 mt-1.5">' + escHTML(what) + ' · ' + escHTML(formatOrderDate(r.created_at)) + '</div>' +
        '</div>';
      }).join("")
    : '<p class="text-center text-xs text-gray-500 py-6">' + t("rv_empty") + '</p>';
  document.getElementById("rv-sheet").classList.remove("hidden");
  if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred("light");
}

function closeReviewsSheet() {
  document.getElementById("rv-sheet").classList.add("hidden");
}

loadReviewsSummary(false);
