import { Link } from "../../router";

/** Четыре способа входа. Почты и пароля нет, отдельные страницы подвала не открываются. */
export function LoginPage() {
  return (
    <div className="page login-page">
      <header className="login-header">
        <Link className="login-logo" to="/">
          Finder<span>.com</span>
        </Link>
        <span className="login-pill">Войти</span>
      </header>
      <main className="login-main">
        <h1>Вход в Finder</h1>
        <p className="login-lead">Для доступа к сервису необходимо войти</p>
        <div className="login-card">
          <button className="oauth telegram" type="button">
            <TelegramMark />
            Войти через Telegram
          </button>
          <div className="or">
            <span />
            или другим способом
            <span />
          </div>
          <button className="oauth" type="button">
            <VkMark />
            Войти с VK ID
          </button>
          <button className="oauth" type="button">
            <span className="ya">Я</span>
            Войти с Яндекс ID
          </button>
          <div className="google-wrap">
            <span className="last">Последний вход</span>
            <button className="oauth" type="button">
              <GoogleMark />
              Войти с Google
            </button>
          </div>
          <p className="legal">
            Продолжая, вы принимаете условия <span>оферты</span> и <span>политики конфиденциальности</span>
          </p>
        </div>
        <Link className="back-home" to="/">
          ← Вернуться на главную
        </Link>
      </main>
      <footer className="login-foot">
        <div className="login-foot-grid">
          <div>
            <span className="login-logo light">
              Finder<span>.com</span>
            </span>
            <p>Умный поиск товаров и поставщиков с искусственным интеллектом для маркетплейсов</p>
          </div>
          <div>
            <h2>ПРОДУКТ</h2>
            <span>Главная</span>
            <span>Тарифы</span>
            <span>Telegram-канал</span>
          </div>
          <div>
            <h2>ПОДДЕРЖКА</h2>
            <span>Telegram-поддержка</span>
            <span>Чат с поддержкой</span>
          </div>
          <div>
            <h2>ДОКУМЕНТЫ</h2>
            <span>Конфиденциальность</span>
            <span>Условия</span>
            <span>Оферта</span>
          </div>
        </div>
        <div className="foot-grip" />
      </footer>
    </div>
  );
}

function TelegramMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 100 20 10 10 0 000-20zm4.2 6.7l-1.6 7.6c-.1.6-.5.8-1 .5l-2.7-2-1.3 1.3c-.1.1-.3.2-.5.2l.2-2.8 5.1-4.6c.2-.2 0-.3-.3-.1l-6.3 4-2.7-.8c-.6-.2-.6-.6.1-.9l10.6-4.1c.5-.2.9.1.7.8z"
      />
    </svg>
  );
}

function VkMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="6" fill="#0077FF" />
      <path
        fill="#fff"
        d="M12.9 16.5c-4.4 0-6.9-3-7-8.1h2.2c.1 3.7 1.7 5.3 3 5.6V8.4h2.1v3.2c1.3-.1 2.6-1.6 3-3.2h2.1a6.3 6.3 0 01-2.8 4c1.8.8 3.3 2.5 3.8 4h-2.3c-.5-1.5-1.7-2.7-3.3-2.8v2.9h-.8z"
      />
    </svg>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.7 12.3c0-.7-.1-1.4-.2-2.1H12v4.5h6.6a5.6 5.6 0 01-2.4 3.7v3h3.9c2.3-2.1 3.6-5.2 3.6-9.1z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.8-2.1-6.7-4.9H1.2v3.1C3.3 21.4 7.3 24 12 24z" />
      <path fill="#FBBC05" d="M5.3 14.3A7.2 7.2 0 014.9 12c0-.8.1-1.6.4-2.3V6.6H1.2A12 12 0 000 12c0 1.9.5 3.7 1.2 5.4l4.1-3.1z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.3 0 3.3 2.6 1.2 6.6l4.1 3.1C6.2 6.9 8.9 4.8 12 4.8z" />
    </svg>
  );
}
