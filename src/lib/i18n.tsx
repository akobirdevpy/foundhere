import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "uz" | "ru" | "en";

const D = {
  school: {
    uz: "Kogon shahar ixtisoslashtirilgan maktabi",
    ru: "Специализированная школа города Каган",
    en: "Kogon City Specialized School",
  },
  subLabel: { uz: "Yo'qolgan va topilgan narsalar", ru: "Бюро находок", en: "Lost & found" },
  heroTitle: {
    uz: "Yo'qolgan narsangizni birga topamiz",
    ru: "Вместе найдём вашу потерянную вещь",
    en: "Let's find your lost item together",
  },
  heroSub: {
    uz: "Kogon ixtisoslashtirilgan maktabi — Topilmalar markazi",
    ru: "Каганская специализированная школа — Бюро находок",
    en: "Kogon Specialized School — Lost & Found Center",
  },
  iLost: { uz: "Yo'qotdim", ru: "Я потерял", en: "I lost something" },
  iFound: { uz: "Topib oldim", ru: "Я нашёл", en: "I found something" },
  browse: { uz: "Barcha e'lonlar", ru: "Все объявления", en: "All posts" },
  home: { uz: "Bosh sahifa", ru: "Главная", en: "Home" },
  recent: { uz: "So'nggi e'lonlar", ru: "Последние объявления", en: "Latest posts" },
  lost: { uz: "Yo'qolgan", ru: "Потеряно", en: "Lost" },
  found: { uz: "Topilgan", ru: "Найдено", en: "Found" },
  all: { uz: "Hammasi", ru: "Все", en: "All" },
  search: { uz: "Qidirish...", ru: "Поиск...", en: "Search..." },
  title: { uz: "Narsa nomi", ru: "Название вещи", en: "Item name" },
  description: {
    uz: "Tavsif (rangi, belgilari)",
    ru: "Описание (цвет, приметы)",
    en: "Description (color, marks)",
  },
  category: { uz: "Turkum", ru: "Категория", en: "Category" },
  location: { uz: "Maktabdagi joy", ru: "Место в школе", en: "Place in school" },
  className: { uz: "Sinf", ru: "Класс", en: "Class" },
  keptAt: {
    uz: "Narsa qayerda saqlanmoqda",
    ru: "Где хранится вещь",
    en: "Where the item is kept",
  },
  contactName: { uz: "Ismingiz", ru: "Ваше имя", en: "Your name" },
  contactInfo: {
    uz: "Aloqa (telefon yoki sinf)",
    ru: "Контакт (телефон или класс)",
    en: "Contact (phone or class)",
  },
  photo: { uz: "Rasm (ixtiyoriy)", ru: "Фото (необязательно)", en: "Photo (optional)" },
  date: { uz: "Sana", ru: "Дата", en: "Date" },
  submit: { uz: "E'lonni joylash", ru: "Опубликовать", en: "Publish post" },
  sending: { uz: "Yuborilmoqda...", ru: "Отправка...", en: "Sending..." },
  posted: {
    uz: "Rahmat! E'lon joylandi.",
    ru: "Спасибо! Объявление опубликовано.",
    en: "Thank you! Post published.",
  },
  manageCodeSaved: {
    uz: "Kodni saqlang. Hisobotni tahrirlash yoki o‘chirish uchun kerak bo‘ladi.",
    ru: "Сохраните код. Он нужен для изменения или удаления объявления.",
    en: "Save this code. You need it to edit or delete your report.",
  },
  login: { uz: "Kirish", ru: "Войти", en: "Log in" },
  signup: { uz: "Ro‘yxatdan o‘tish", ru: "Регистрация", en: "Sign up" },
  admin: { uz: "Admin", ru: "Администратор", en: "Admin" },
  adminReports: {
    uz: "E'lonlarni boshqarish",
    ru: "Управление объявлениями",
    en: "Manage reports",
  },
  accessDenied: { uz: "Kirish taqiqlangan", ru: "Доступ запрещён", en: "Access denied" },
  googleAuthError: {
    uz: "Google orqali kirish amalga oshmadi. Qayta urinib ko‘ring.",
    ru: "Не удалось войти через Google. Попробуйте ещё раз.",
    en: "Google sign-in failed. Please try again.",
  },
  uzPhone: {
    uz: "O‘zbekiston telefon raqami",
    ru: "Телефон Узбекистана",
    en: "Uzbekistan phone number",
  },
  googleAuth: { uz: "Google orqali", ru: "Через Google", en: "With Google" },
  continueGoogle: {
    uz: "Google bilan davom etish",
    ru: "Продолжить через Google",
    en: "Continue with Google",
  },
  sendCode: { uz: "Kod yuborish", ru: "Отправить код", en: "Send code" },
  verify: { uz: "Tasdiqlash", ru: "Подтвердить", en: "Verify" },
  codeSent: {
    uz: "Tasdiqlash kodi yuborildi.",
    ru: "Код подтверждения отправлен.",
    en: "Verification code sent.",
  },
  uzPhoneError: {
    uz: "+998 bilan boshlanadigan 9 xonali raqam kiriting.",
    ru: "Введите 9-значный номер, начинающийся с +998.",
    en: "Enter a 9-digit number starting with +998.",
  },
  telegramUsername: {
    uz: "Telegram username (ixtiyoriy)",
    ru: "Имя пользователя Telegram (необязательно)",
    en: "Telegram username (optional)",
  },
  telegramCode: { uz: "Telegram/SMS kodi", ru: "Код Telegram/SMS", en: "Telegram/SMS code" },
  telegramHelp: {
    uz: "Telegram username kiritsangiz, keyinroq tasdiqlash botini ulashimiz mumkin.",
    ru: "Укажите Telegram username — позже можно подключить бота для подтверждения.",
    en: "Add your Telegram username so a verification bot can be connected later.",
  },
  logout: { uz: "Chiqish", ru: "Выйти", en: "Log out" },
  password: { uz: "Parol", ru: "Пароль", en: "Password" },
  forgotPassword: { uz: "Parolni unutdingizmi?", ru: "Забыли пароль?", en: "Forgot password?" },
  createAccount: { uz: "Hisob yaratish", ru: "Создать аккаунт", en: "Create account" },
  haveAccount: {
    uz: "Hisobim bor",
    ru: "У меня уже есть аккаунт",
    en: "I already have an account",
  },
  checkEmail: {
    uz: "Emailingizni tasdiqlang.",
    ru: "Подтвердите email.",
    en: "Check your email to confirm your account.",
  },
  enterEmail: { uz: "Emailni kiriting.", ru: "Введите email.", en: "Enter your email first." },
  resetSent: {
    uz: "Parolni tiklash xati yuborildi.",
    ru: "Письмо для сброса отправлено.",
    en: "Password reset email sent.",
  },
  profileSetup: {
    uz: "Profilingizni to‘ldiring",
    ru: "Заполните профиль",
    en: "Complete your profile",
  },
  fullName: { uz: "To‘liq ism", ru: "Полное имя", en: "Full name" },
  save: { uz: "Saqlash", ru: "Сохранить", en: "Save" },
  otherAnswer: { uz: "Boshqa javob", ru: "Другой ответ", en: "Other answer" },
  customRequired: {
    uz: "O‘z javobingizni kiriting.",
    ru: "Введите свой вариант.",
    en: "Enter your own answer.",
  },
  status: { uz: "Holat", ru: "Статус", en: "Status" },
  resolved: { uz: "Hal qilindi", ru: "Решено", en: "Resolved" },
  returnedStatus: { uz: "Qaytarildi", ru: "Возвращено", en: "Returned" },
  lastEdited: { uz: "So‘nggi tahrir", ru: "Последнее изменение", en: "Last edited" },
  checkLogin: {
    uz: "E'lon berish uchun kiring.",
    ru: "Войдите, чтобы разместить объявление.",
    en: "Log in to report an item.",
  },
  myReports: { uz: "Mening e'lonlarim", ru: "Мои объявления", en: "My reports" },
  edit: { uz: "Tahrirlash", ru: "Изменить", en: "Edit" },
  delete: { uz: "O‘chirish", ru: "Удалить", en: "Delete" },
  manageReport: {
    uz: "E'lonimni boshqarish",
    ru: "Управление объявлением",
    en: "Manage my report",
  },
  manageCode: {
    uz: "6 xonali boshqaruv kodi",
    ru: "6-значный код управления",
    en: "6-digit manage code",
  },
  wrongCode: {
    uz: "Kod noto‘g‘ri yoki muddati tugagan.",
    ru: "Неверный код или срок действия истёк.",
    en: "The code is incorrect or access is locked.",
  },
  deleteConfirm: {
    uz: "Bu e'lon o‘chirilsinmi? Bu amalni bekor qilib bo‘lmaydi.",
    ru: "Удалить это объявление? Это действие нельзя отменить.",
    en: "Delete this report? This cannot be undone.",
  },
  deleteDescription: {
    uz: "E'lon, rasmi, da'volari va bildirishnomalari o‘chiriladi.",
    ru: "Объявление, фото, заявки и уведомления будут удалены.",
    en: "The report, photo, claims, and notifications will be deleted.",
  },
  cancel: { uz: "Bekor qilish", ru: "Отмена", en: "Cancel" },
  deleting: { uz: "O‘chirilmoqda…", ru: "Удаление…", en: "Deleting…" },
  deleteError: {
    uz: "E'lonni o‘chirib bo‘lmadi.",
    ru: "Не удалось удалить объявление.",
    en: "The report could not be deleted.",
  },
  deleted: { uz: "E'lon o‘chirildi.", ru: "Объявление удалено.", en: "Report deleted." },
  noMyReports: {
    uz: "Bu qurilmada e'lonlaringiz yo‘q.",
    ru: "На этом устройстве нет ваших объявлений.",
    en: "No reports from this device.",
  },
  updated: { uz: "E'lon yangilandi.", ru: "Объявление обновлено.", en: "Report updated." },
  error: { uz: "Xatolik yuz berdi", ru: "Произошла ошибка", en: "Something went wrong" },
  postLost: {
    uz: "Yo'qolgan narsa haqida e'lon",
    ru: "Объявление о потере",
    en: "Report a lost item",
  },
  postFound: {
    uz: "Topilgan narsa haqida e'lon",
    ru: "Объявление о находке",
    en: "Report a found item",
  },
  choose: { uz: "Tanlang", ru: "Выберите", en: "Choose" },
  matches: {
    uz: "Mos kelishi mumkin bo'lgan e'lonlar",
    ru: "Возможные совпадения",
    en: "Possible matches",
  },
  viewItem: { uz: "Ko‘rish", ru: "Открыть", en: "View item" },
  noMatches: { uz: "Hozircha mos e'lon yo'q", ru: "Совпадений пока нет", en: "No matches yet" },
  empty: { uz: "E'lonlar topilmadi", ru: "Объявления не найдены", en: "No posts found" },
  contact: { uz: "Aloqa", ru: "Контакт", en: "Contact" },
  rule: {
    uz: "Topilgan narsalarni maktab ma'muriyatiga topshiring",
    ru: "Сдавайте найденные вещи администрации школы",
    en: "Please hand found items to the school administration",
  },
  office: { uz: "Topilmalar xonasi", ru: "Бюро находок", en: "Lost & found office" },
  loading: { uz: "Yuklanmoqda...", ru: "Загрузка...", en: "Loading..." },
  loadError: {
    uz: "Ma'lumotlarni yuklab bo'lmadi. Sahifani yangilang.",
    ru: "Не удалось загрузить данные. Обновите страницу.",
    en: "Could not load data. Please refresh.",
  },
  emptyHint: {
    uz: "Birinchi bo'lib e'lon joylang!",
    ru: "Станьте первым, кто разместит объявление!",
    en: "Be the first to post!",
  },
  photoTooBig: {
    uz: "Rasm 5 MB dan oshmasligi kerak",
    ru: "Фото не должно превышать 5 МБ",
    en: "Photo must be under 5 MB",
  },
  back: { uz: "Orqaga", ru: "Назад", en: "Back" },
  viewAll: { uz: "Hammasini ko'rish", ru: "Смотреть все", en: "View all" },
  officialService: {
    uz: "Rasmiy maktab xizmati",
    ru: "Официальный сервис школы",
    en: "Official school service",
  },
  serviceTitle: { uz: "Topilmalar xizmati", ru: "Бюро находок", en: "Lost & Found Service" },
  serviceSubtitle: {
    uz: "Kogon shahar ixtisoslashtirilgan maktabi — rasmiy topilmalar markazi",
    ru: "Специализированная школа города Каган — официальное бюро находок",
    en: "Kogon City Specialized School: official lost and found center",
  },
  serviceDescription: {
    uz: "Yo‘qolgan yoki topilgan narsa haqida e’lon bering va uni egasiga qaytarishga yordam bering.",
    ru: "Сообщите о потерянной или найденной вещи и помогите вернуть её владельцу.",
    en: "Report a lost or found item and help it find its way back to its owner.",
  },
  searchItems: {
    uz: "Nomi yoki turkumi bo‘yicha qidirish",
    ru: "Поиск по названию или категории",
    en: "Search by item name or category",
  },
  searchAction: { uz: "Qidirish", ru: "Найти", en: "Search" },
  howWorks: { uz: "Qanday ishlaydi", ru: "Как это работает", en: "How it works" },
  stepReport: { uz: "Narsa haqida e’lon bering", ru: "Сообщите о вещи", en: "Report an item" },
  stepReportText: {
    uz: "Narsa tavsifi, topilgan yoki yo‘qolgan joyi va rasmini kiriting.",
    ru: "Добавьте описание, место потери или находки и фотографию.",
    en: "Add a description, a location and a photo of the item.",
  },
  stepMatch: { uz: "Moslikni tekshiring", ru: "Сопоставьте и проверьте", en: "Match and verify" },
  stepMatchText: {
    uz: "Mos e’lonlarni ko‘ring va narsa sizniki ekanini maktab xodimiga tasdiqlang.",
    ru: "Найдите похожие объявления и подтвердите сотруднику школы, что вещь ваша.",
    en: "Review possible matches and verify ownership with school staff.",
  },
  stepCollect: {
    uz: "Maktabdan olib keting",
    ru: "Заберите в школе",
    en: "Collect from the school office",
  },
  stepCollectText: {
    uz: "Narsani olish uchun maktab ma’muriyatiga murojaat qiling.",
    ru: "Обратитесь к администрации школы, чтобы забрать вещь.",
    en: "Contact the school administration to collect your item.",
  },
  recentAnnouncements: {
    uz: "So‘nggi e’lonlar",
    ru: "Последние объявления",
    en: "Recent announcements",
  },
  noAnnouncements: {
    uz: "Hozircha e’lonlar yo‘q",
    ru: "Объявлений пока нет",
    en: "No announcements yet",
  },
  noAnnouncementsText: {
    uz: "Yangi e’lonlar shu yerda ko‘rinadi. Yo‘qotgan yoki topgan narsangiz haqida e’lon bering.",
    ru: "Новые объявления появятся здесь. Сообщите о потерянной или найденной вещи.",
    en: "New announcements will appear here. Report something you have lost or found.",
  },
  retry: { uz: "Qayta urinish", ru: "Повторить", en: "Try again" },
  officialInformation: {
    uz: "Rasmiy ma’lumot",
    ru: "Официальная информация",
    en: "Official information",
  },
  collectionPoint: {
    uz: "Narsalarni olish joyi",
    ru: "Место выдачи вещей",
    en: "Collection point",
  },
  administration: {
    uz: "Maktab ma’muriyati",
    ru: "Администрация школы",
    en: "School administration",
  },
  workingHours: { uz: "Ish vaqti", ru: "Часы работы", en: "Working hours" },
  confirmOffice: {
    uz: "Xona raqamini ma’muriyatdan aniqlashtiring",
    ru: "Уточните номер кабинета у администрации",
    en: "Confirm the room with the administration",
  },
  confirmHours: {
    uz: "Maktab ma’muriyatidan aniqlashtiring",
    ru: "Уточните у администрации школы",
    en: "Confirm with the school administration",
  },
  phone: { uz: "Telefon", ru: "Телефон", en: "Phone" },
  email: { uz: "Elektron pochta", ru: "Электронная почта", en: "Email" },
  notProvided: { uz: "Hali ko‘rsatilmagan", ru: "Пока не указан", en: "Not yet provided" },
  responsibleStaff: {
    uz: "Mas’ul xodim",
    ru: "Отве��ственный сотрудник",
    en: "Responsible staff member",
  },
  unclaimedNote: {
    uz: "30 kun ichida olib ketilmagan narsalar maktab ma’muriyatiga topshiriladi.",
    ru: "Вещи, не востребованные в течение 30 дней, передаются администрации школы.",
    en: "Items not claimed within 30 days are handed to the administration.",
  },
  quickLinks: { uz: "Tezkor havolalar", ru: "Быстрые ссылки", en: "Quick links" },
  contactUs: { uz: "Aloqa", ru: "Контакты", en: "Contact" },
  address: { uz: "Manzil", ru: "Адрес", en: "Address" },
  city: { uz: "Kogon, O‘zbekiston", ru: "Каган, Узбекистан", en: "Kogon, Uzbekistan" },
  rightsReserved: {
    uz: "Barcha huquqlar himoyalangan.",
    ru: "Все права защищены.",
    en: "All rights reserved.",
  },
  menu: { uz: "Menyuni ochish", ru: "Открыть меню", en: "Open menu" },
  closeMenu: { uz: "Menyuni yopish", ru: "Закрыть меню", en: "Close menu" },
  returned: { uz: "Qaytarilgan", ru: "Возвращено", en: "Returned" },
  noPhoto: { uz: "Rasm mavjud emas", ru: "Нет фотографии", en: "No photo available" },
  // categories
  bag: { uz: "Sumka", ru: "Сумка", en: "Bag" },
  clothes: { uz: "Kiyim", ru: "Одежда", en: "Clothes" },
  electronics: { uz: "Elektronika", ru: "Электроника", en: "Electronics" },
  books: { uz: "Kitob / daftar", ru: "Книги / тетради", en: "Books / notebooks" },
  bottle: { uz: "Suv idishi", ru: "Бутылка", en: "Water bottle" },
  keys: { uz: "Kalitlar", ru: "Ключи", en: "Keys" },
  jewelry: { uz: "Taqinchoq", ru: "Украшения", en: "Jewelry" },
  sports: { uz: "Sport anjomi", ru: "Спортинвентарь", en: "Sports gear" },
  other: { uz: "Boshqa", ru: "Другое", en: "Other" },
  // locations
  classroom: { uz: "Sinfxona", ru: "Класс", en: "Classroom" },
  canteen: { uz: "Oshxona", ru: "Столовая", en: "Canteen" },
  sports_hall: { uz: "Sport zali", ru: "Спортзал", en: "Sports hall" },
  library: { uz: "Kutubxona", ru: "Библиотека", en: "Library" },
  corridor: { uz: "Yo'laklar", ru: "Коридоры", en: "Corridors" },
  schoolyard: { uz: "Maktab hovlisi", ru: "Школьный двор", en: "Schoolyard" },
  school_bus: { uz: "Maktab avtobusi", ru: "Школьный автобус", en: "School bus" },
  computer_room: { uz: "Kompyuter xonasi", ru: "Компьютерный класс", en: "Computer room" },
  // kept
  teachers_room: { uz: "O'qituvchilar xonasi", ru: "Учительская", en: "Teachers' room" },
  duty_teacher: { uz: "Navbatchi o'qituvchi", ru: "Дежурный учитель", en: "Duty teacher" },
  deputy_room: {
    uz: "Direktor o'rinbosari xonasi",
    ru: "Кабинет завуча",
    en: "Deputy director's office",
  },
  with_me: { uz: "Men bilan", ru: "У меня", en: "With me" },
} as const;

export type Key = keyof typeof D;

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string }>({
  lang: "uz",
  setLang: () => {},
  t: (k) => k,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("uz");
  useEffect(() => {
    const s = localStorage.getItem("lang") as Lang | null;
    if (s === "ru" || s === "en") {
      setLangState(s);
      document.documentElement.lang = s;
    }
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
    document.documentElement.lang = l;
  };
  const t = (k: string) => (D as Record<string, Record<Lang, string>>)[k]?.[lang] ?? k;
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
