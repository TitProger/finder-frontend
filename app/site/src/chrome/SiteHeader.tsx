import { useEffect, useState } from "react";
import { Link } from "../router";
import { ProfileMenu } from "./ProfileMenu";

/** Шапка: поиск и история. Аватар открывает карточку профиля. */
export function SiteHeader() {
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (!profileOpen) {
      return;
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    }

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [profileOpen]);

  return (
    <header className="site-header">
      <Link className="brand" to="/">
        Finder
      </Link>
      <div className="header-side">
        <nav className="header-nav">
          <Link to="/">
            <span className="plus">+</span>
            Выполнить поиск
          </Link>
          <Link to="/history">
            <HistoryIcon />
            История поиска
          </Link>
        </nav>
        <div className="header-user">
          <span className="spark-chip">
            <Spark />
            <span>2</span>
            <span className="spark-t">T</span>
          </span>
          <span className="profile-anchor">
            <button
              type="button"
              className="avatar avatar-btn"
              aria-label="Профиль"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((open) => !open)}
            >
              <AvatarFace />
            </button>
            {profileOpen ? (
              <>
                <button type="button" className="profile-dismiss" aria-label="Закрыть профиль" onClick={() => setProfileOpen(false)} />
                <ProfileMenu onClose={() => setProfileOpen(false)} />
              </>
            ) : null}
          </span>
        </div>
      </div>
    </header>
  );
}

function Spark() {
  return (
    <svg className="spark" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2l2.4 6.8 6.8 2.4-6.8 2.4L12 20.4l-2.4-6.8L2.8 11.2l6.8-2.4L12 2z" />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg className="history-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 7v5l3 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M4.5 12a7.5 7.5 0 1 0 2-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M4 5v4h4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function AvatarFace() {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true">
      <rect width="36" height="36" fill="#d7ebe3" />
      <circle cx="18" cy="15" r="7" fill="#e7c2a4" />
      <path d="M8 34c1.2-8 5.2-12 10-12s8.8 4 10 12" fill="#3d4a55" />
      <path d="M11 14c1-6 13-6 14 0-1-4-4-6-7-6s-6 2-7 6z" fill="#2b211c" />
      <circle cx="15.2" cy="15.2" r="0.8" fill="#2b211c" />
      <circle cx="20.8" cy="15.2" r="0.8" fill="#2b211c" />
    </svg>
  );
}
