import { useEffect, useState } from "react";
import { TopUpModal } from "./TopUpModal";
import { applyLang, applyTheme, readLang, readTheme, type LangChoice, type ThemeChoice } from "./profile-prefs";

const BALANCE = 2;

/** Карточка профиля. Оплата и выход на сервер не ходят. */
export function ProfileMenu({ onClose }: { onClose: () => void }) {
  const [theme, setTheme] = useState<ThemeChoice>(readTheme);
  const [lang, setLang] = useState<LangChoice>(readLang);
  const [topUp, setTopUp] = useState(false);

  useEffect(() => {
    if (theme !== "system") {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => applyTheme("system");

    media.addEventListener("change", sync);

    return () => media.removeEventListener("change", sync);
  }, [theme]);

  function pickTheme(next: ThemeChoice) {
    setTheme(next);
    applyTheme(next);
  }

  function pickLang(next: LangChoice) {
    setLang(next);
    applyLang(next);
  }

  return (
    <>
      <div className="profile-menu" role="dialog" aria-label="Профиль">
        <div className="profile-who">
          <span className="profile-letter">T</span>
          <span>
            <strong>Tit Mirgaliev</strong>
            <small>G tit.4mir@gmail.com</small>
          </span>
        </div>
        <div className="profile-balance">
          <span>
            <small>Баланс</small>
            <strong>
              {BALANCE} <i>✦</i>
            </strong>
          </span>
          <button
            type="button"
            className="profile-topup"
            onClick={() => {
              setTopUp(true);
            }}
          >
            Пополнить
          </button>
        </div>
        <div className="profile-row quiet">
          <span className="profile-ico" aria-hidden="true">
            ○
          </span>
          Профиль
        </div>
        <div className="profile-row">
          <span>Тема</span>
          <span className="segment">
            <button type="button" className={theme === "light" ? "on" : ""} aria-label="Светлая" onClick={() => pickTheme("light")}>
              <Sun />
            </button>
            <button type="button" className={theme === "dark" ? "on" : ""} aria-label="Темная" onClick={() => pickTheme("dark")}>
              <Moon />
            </button>
            <button type="button" className={theme === "system" ? "on" : ""} aria-label="Системная" onClick={() => pickTheme("system")}>
              <Monitor />
            </button>
          </span>
        </div>
        <div className="profile-row">
          <span>Язык</span>
          <span className="segment langs">
            {(["ru", "en", "es"] as const).map((code) => (
              <button key={code} type="button" className={lang === code ? "on" : ""} onClick={() => pickLang(code)}>
                {code.toUpperCase()}
              </button>
            ))}
          </span>
        </div>
        <button type="button" className="profile-logout" onClick={onClose}>
          Выйти
        </button>
      </div>
      {topUp ? <TopUpModal balance={BALANCE} onClose={() => setTopUp(false)} /> : null}
    </>
  );
}

function Sun() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.4-6.4-1.4 1.4M7 17l-1.4 1.4m12.8 0L17 17M7 7 5.6 5.6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function Moon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.4 15.4A9 9 0 0 1 8.6 3.6 9 9 0 1 0 20.4 15.4z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function Monitor() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9.8 17 9 20l2 1h2l2-1-.8-3M3 13h18M5 17h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
