import { useEffect, useState } from "react";
import type { ProductCard, ProductDelivery } from "@shared/api-types";
import { useProduct } from "../../../../../domain/hooks/products/useProducts";
import { ProfileMenu } from "../../chrome/ProfileMenu";
import { errorText } from "../../format";
import { Link } from "../../router";

const UNAVAILABLE: ProductDelivery = {
  available: false,
  demo: false,
  title: "2. Доставка",
};

export function ProductPage({ id }: { id: string }) {
  const product = useProduct(id);
  const [photoIndex, setPhotoIndex] = useState(0);
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
    <div className="page product-page">
      <header className="dossier-header">
        <div className="dossier-brand">
          <Link className="mark" to="/">
            <span>✦</span>
            Finder
          </Link>
          <nav>
            <Link to="/">
              <span className="plus">+</span> Выполнить поиск
            </Link>
            <Link to="/history">История поиска</Link>
            <span className="quiet-item">
              <span className="plus">+</span> Создать проект
            </span>
          </nav>
        </div>
        <div className="dossier-user">
          <span className="sparks">✦ 2 искры</span>
          <span className="profile-anchor">
            <button
              type="button"
              className="letter-avatar"
              aria-label="Профиль"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((open) => !open)}
            >
              Т<span className="online" />
            </button>
            {profileOpen ? (
              <>
                <button type="button" className="profile-dismiss" aria-label="Закрыть профиль" onClick={() => setProfileOpen(false)} />
                <ProfileMenu onClose={() => setProfileOpen(false)} />
              </>
            ) : null}
          </span>
        </div>
      </header>

      {product.isPending ? <p className="status-line wide">Загрузка карточки…</p> : null}
      {product.isError ? <p className="status-line wide">{errorText(product.error)}</p> : null}
      {product.data ? <Card card={product.data} photoIndex={photoIndex} onPhoto={setPhotoIndex} /> : null}

      <footer className="product-foot">
        <div>
          <strong>Finder App</strong>
          <span>© 2025 Интеллектуальный поиск и аудит товаров</span>
        </div>
        <div className="foot-links">
          <span>База поставщиков</span>
          <span>Тарифы логистики</span>
          <span>Помощь и поддержка</span>
        </div>
      </footer>
    </div>
  );
}

function Card({
  card,
  photoIndex,
  onPhoto,
}: {
  card: ProductCard;
  photoIndex: number;
  onPhoto: (index: number) => void;
}) {
  const photo = card.photos[photoIndex] ?? card.photos[0];
  const delivery = card.delivery ?? UNAVAILABLE;
  const title = card.headline || card.name;

  return (
    <>
      <div className="crumbs">
        <div className="crumb-path">
          <Link to="/">← Назад к поиску</Link>
          <span>/</span>
          <Link to="/history">Результаты</Link>
          <span>/</span>
          <strong>{card.name}</strong>
        </div>
        <div className="crumb-badges">
          {card.verifiedLabel ? <span className="pill green">{card.verifiedLabel}</span> : null}
          {card.updatedLabel ? <span className="pill">{card.updatedLabel}</span> : null}
        </div>
      </div>
      <main className="dossier-grid">
        <section className="dossier-left">
          <div className="panel">
            <div className="hero">
              {photo ? <img src={photo.url} alt={photo.alt} /> : null}
              <div className="hero-badges">
                {card.availabilityLabel ? <span className="pill">{card.availabilityLabel}</span> : null}
                {card.demandLabel ? <span className="pill lime">{card.demandLabel}</span> : null}
              </div>
            </div>
            <div className="thumbs">
              {card.photos.map((item, index) => (
                <button
                  key={`${item.url}-${index}`}
                  type="button"
                  className={index === photoIndex ? "on" : ""}
                  onClick={() => onPhoto(index)}
                >
                  <img src={item.url} alt={item.alt} />
                </button>
              ))}
              {card.galleryMoreLabel ? <span className="more-photos">{card.galleryMoreLabel}</span> : null}
            </div>
            <div className="identity">
              <div className="identity-meta">
                <span className="pill">{card.cardCategoryLabel || card.categoryLabel}</span>
                {card.article ? <span className="article">Арт: {card.article}</span> : null}
              </div>
              <h1>{title}</h1>
              {card.manufacturer ? (
                <p className="maker">
                  <span>Производитель:</span> {card.manufacturer}
                  {card.oemLabel ? <em>{card.oemLabel}</em> : null}
                </p>
              ) : null}
            </div>
            {card.summary ? (
              <div className="summary">
                <span aria-hidden="true">💡</span>
                <p>
                  {card.summaryTitle ? <strong>{card.summaryTitle}</strong> : null}
                  {card.summary}
                </p>
              </div>
            ) : null}
          </div>
          <div className="panel">
            <div className="spec-head">
              <h2>{card.specsTitle || "Характеристики и спецификация"}</h2>
              {card.passportLabel ? <span>{card.passportLabel}</span> : null}
            </div>
            <dl>
              {card.specs.map((spec) => (
                <div key={spec.label}>
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
        <section className="dossier-right">
          {card.procurement ? (
            <article className="panel">
              <header className="report-head">
                <h2>🇨🇳 {card.procurement.title}</h2>
                <span className="pill">{card.procurement.moqLabel}</span>
              </header>
              <div className="tiers">
                {card.procurement.tiers.map((tier) => (
                  <div key={tier.title} className={tier.highlighted ? "tier hot" : "tier"}>
                    {tier.badge ? <span className="ribbon">{tier.badge}</span> : null}
                    <span className="muted">{tier.title}</span>
                    <strong>
                      {tier.price}
                      {tier.priceUnit ? <small> {tier.priceUnit}</small> : null}
                    </strong>
                    {tier.converted ? <span>{tier.converted}</span> : null}
                    <em>{tier.note}</em>
                  </div>
                ))}
              </div>
            </article>
          ) : null}

          <article className="panel">
            <header className="report-head">
              <h2>🚚 {delivery.title}</h2>
              {delivery.demo ? <span className="demo-mark">демо</span> : null}
              {delivery.available && delivery.modes && delivery.modes.length > 0 ? (
                <div className="modes">
                  {delivery.modes.map((mode, index) => (
                    <span key={mode} className={index === 0 ? "on" : ""}>
                      {mode}
                    </span>
                  ))}
                </div>
              ) : null}
            </header>
            {delivery.available ? (
              <>
                <div className="rates">
                  {delivery.perUnit ? <Rate rate={delivery.perUnit} /> : null}
                  {delivery.perBatch ? <Rate rate={delivery.perBatch} accent /> : null}
                </div>
                {delivery.included && delivery.included.length > 0 ? (
                  <ul className="included">
                    {delivery.included.map((item) => (
                      <li key={item}>✓ {item}</li>
                    ))}
                  </ul>
                ) : null}
              </>
            ) : (
              <p className="unavailable">недоступно</p>
            )}
          </article>

          {card.market ? (
            <article className="panel">
              <header className="report-head">
                <h2>📊 {card.market.title}</h2>
                <span className="pill violet">{card.market.sellersLabel}</span>
              </header>
              <div className="quotes">
                {card.market.quotes.map((quote) => (
                  <div key={quote.title} className={quote.highlighted ? "quote hot" : "quote"}>
                    <span>{quote.title}</span>
                    <strong>{quote.price}</strong>
                    <small>{quote.note}</small>
                  </div>
                ))}
              </div>
            </article>
          ) : null}

          {card.breakdown ? (
            <article className="panel">
              <header className="report-head">
                <h2>⚡ {card.breakdown.title}</h2>
                <span className="pill green">
                  {card.breakdown.verdict} {"★".repeat(card.breakdown.stars)}
                </span>
              </header>
              <div className="econ">
                <div>
                  <span>Себестоимость с доставкой в РФ</span>
                  <strong>
                    {card.breakdown.costPrice}
                    {card.breakdown.costSuffix ? <small> {card.breakdown.costSuffix}</small> : null}
                  </strong>
                  <p>{card.breakdown.costNote}</p>
                </div>
                <div className="profit">
                  <span>Чистая прибыль на единицу</span>
                  <strong>
                    {card.breakdown.profitPrice}
                    {card.breakdown.profitExtra ? <small> {card.breakdown.profitExtra}</small> : null}
                  </strong>
                  <p>{card.breakdown.profitNote}</p>
                </div>
              </div>
              <div className="bar-head">
                <span>{card.breakdown.saleLabel}</span>
                <strong>{card.breakdown.marginLabel}</strong>
              </div>
              <div className="bar">
                {card.breakdown.segments.map((segment) => (
                  <span key={segment.label} className={segment.tone} style={{ width: `${segment.sharePercent}%` }} />
                ))}
              </div>
              <ul className="legend">
                {card.breakdown.segments.map((segment) => (
                  <li key={segment.label}>
                    <i className={segment.tone} />
                    {segment.label}
                  </li>
                ))}
              </ul>
              <p className="margin-disclaimer">Оценка с учётом расходов, не факт прибыли.</p>
            </article>
          ) : null}

          <div className="actions">
            <button type="button" className="act-main">
              Связаться с поставщиком →
            </button>
            <button type="button" className="act-sample">
              Заказать образец (Sample)
            </button>
            <button type="button" className="act-file">
              .XLSX
            </button>
          </div>
        </section>
      </main>
    </>
  );
}

function Rate({
  rate,
  accent,
}: {
  rate: { caption: string; price: string; priceSuffix?: string | null; detail?: string | null };
  accent?: boolean;
}) {
  return (
    <div className="rate">
      <span>{rate.caption}</span>
      <strong>
        {rate.price}
        {rate.priceSuffix ? <small> {rate.priceSuffix}</small> : null}
      </strong>
      {rate.detail ? <em className={accent ? "good" : ""}>{rate.detail}</em> : null}
    </div>
  );
}
