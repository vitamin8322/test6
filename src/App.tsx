import React, { createContext, useEffect, useState } from "react";
import "./App.css";
import { IntlProvider } from "react-intl";
import { RoutesPath } from "./RoutesPath";
import en from "../src/intl/en.json";
import vi from "../src/intl/vi.json";
import { log } from "console";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export const LangContext = createContext({
  locale: "",
  setLocale: (locale: string) => {},
});

export const messages = {
  en: en,
  vi: vi,
};

function getMessages(locale: string): any {
  if (locale.startsWith("vi")) {
    return vi;
  }
  return en;
}

function App() {
  const [locale, setLocale] = useState<string>(localStorage.getItem("lang") || "vi");

  const messages = getMessages(locale);

  return (
    <div>
      <LangContext.Provider value={{ locale, setLocale }}>
        <IntlProvider locale={locale} messages={messages}>
          <RoutesPath />
        </IntlProvider>
        <ToastContainer />
      </LangContext.Provider>
    </div>
  );
}

export default App;
