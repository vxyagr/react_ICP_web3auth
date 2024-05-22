import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import id from "./id.json";
import en from "./en.json";

const resources = {
  en: {
    translation: en,
  },
  id: {
    translation: id,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en",

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
