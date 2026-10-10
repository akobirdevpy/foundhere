import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "uz" | "ru" | "en";

const D = {
  school: { uz: "Kogon ixtisoslashtirilgan maktabi", ru: "Каганская специализированная школа", en: "Kogon Specialized School" },
  subLabel: { uz: "Yo'qolgan va topilgan narsalar", ru: "Бюро находок", en: "Lost & found" },
  heroTitle: { uz: "Yo'qolgan narsangizni birga topamiz", ru: "Вместе найдём вашу потерянную вещь", en: "Let's find your lost item together" },
  heroSub: { uz: "Kogon ixtisoslashtirilgan maktabi — Topilmalar markazi", ru: "Каганская специализированная школа — Бюро находок", en: "Kogon Specialized School — Lost & Found Center" },
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
  description: { uz: "Tavsif (rangi, belgilari)", ru: "Описание (цвет, приметы)", en: "Description (color, marks)" },
  category: { uz: "Turkum", ru: "Категория", en: "Category" },
  location: { uz: "Maktabdagi joy", ru: "Место в школе", en: "Place in school" },
  className: { uz: "Sinf", ru: "Класс", en: "Class" },
  keptAt: { uz: "Narsa qayerda saqlanmoqda", ru: "Где хранится вещь", en: "Where the item is kept" },
  contactName: { uz: "Ismingiz", ru: "Ваше имя", en: "Your name" },
  contactInfo: { uz: "Aloqa (telefon yoki sinf)", ru: "Контакт (телефон или класс)", en: "Contact (phone or class)" },
  photo: { uz: "Rasm (ixtiyoriy)", ru: "Фото (необязательно)", en: "Photo (optional)" },
  date: { uz: "Sana", ru: "Дата", en: "Date" },
  submit: { uz: "E'lonni joylash", ru: "Опубликовать", en: "Publish post" },
  sending: { uz: "Yuborilmoqda...", ru: "Отправка...", en: "Sending..." },
  posted: { uz: "Rahmat! E'lon joylandi.", ru: "Спасибо! Объявление опубликовано.", en: "Thank you! Post published." },
  error: { uz: "Xatolik yuz berdi", ru: "Произошла ошибка", en: "Something went wrong" },
  postLost: { uz: "Yo'qolgan narsa haqida e'lon", ru: "Объявление о потере", en: "Report a lost item" },
  postFound: { uz: "Topilgan narsa haqida e'lon", ru: "Объявление о находке", en: "Report a found item" },
  choose: { uz: "Tanlang", ru: "Выберите", en: "Choose" },
  matches: { uz: "Mos kelishi mumkin bo'lgan e'lonlar", ru: "Возможные совпадения", en: "Possible matches" },
  noMatches: { uz: "Hozircha mos e'lon yo'q", ru: "Совпадений пока нет", en: "No matches yet" },
  empty: { uz: "E'lonlar topilmadi", ru: "Объявления не найдены", en: "No posts found" },
  contact: { uz: "Aloqa", ru: "Контакт", en: "Contact" },
  rule: { uz: "Topilgan narsalarni maktab ma'muriyatiga topshiring", ru: "Сдавайте найденные вещи администрации школы", en: "Please hand found items to the school administration" },
  office: { uz: "Topilmalar xonasi", ru: "Бюро находок", en: "Lost & found office" },
  back: { uz: "Orqaga", ru: "Назад", en: "Back" },
  viewAll: { uz: "Hammasini ko'rish", ru: "Смотреть все", en: "View all" },
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
  deputy_room: { uz: "Direktor o'rinbosari xonasi", ru: "Кабинет завуча", en: "Deputy director's office" },
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
    if (s === "ru" || s === "en") setLangState(s);
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };
  const t = (k: string) => (D as Record<string, Record<Lang, string>>)[k]?.[lang] ?? k;
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
