import { useState } from "react";

const PLANS = [
  { id: "start", name: "Старт", credits: "50", searches: "≈ 12 поисков товаров", rub: "390 ₽", usdt: "$5.99 USDT", save: null },
  { id: "creator", name: "Креатор", credits: "140", searches: "≈ 35 поисков товаров", rub: "990 ₽", usdt: "$11 USDT", save: "выгода 9%" },
  { id: "studio", name: "Студия", credits: "400", searches: "≈ 100 поисков товаров", rub: "2 490 ₽", usdt: "$29.99 USDT", save: "выгода 20%" },
  { id: "business", name: "Бизнес", credits: "1 200", searches: "≈ 300 поисков товаров", rub: "6 490 ₽", usdt: "$74.99 USDT", save: "выгода 31%" },
  { id: "corporate", name: "Корпоративный", credits: "5 000", searches: "≈ 1 250 поисков товаров", rub: "19 990 ₽", usdt: "$219.99 USDT", save: "выгода 49%" },
] as const;

type PlanId = (typeof PLANS)[number]["id"];

/** Окно тарифов. Кнопки оплаты ничего не отправляют. */
export function TopUpModal({ balance, onClose }: { balance: number; onClose: () => void }) {
  const [planId, setPlanId] = useState<PlanId>("creator");
  const plan = PLANS.find((item) => item.id === planId) ?? PLANS[1];

  return (
    <div className="topup-backdrop" role="presentation" onClick={onClose}>
      <div
        className="topup-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="topup-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="topup-head">
          <h2 id="topup-title">Тарифы</h2>
          <div className="topup-head-side">
            <span className="topup-balance">
              На балансе <strong>{balance}</strong> <i>✦</i>
            </span>
            <button type="button" className="topup-close" aria-label="Закрыть окно" onClick={onClose}>
              ×
            </button>
          </div>
        </div>
        <div className="topup-grid">
          <div className="topup-plans">
            {PLANS.map((item) => {
              const selected = item.id === plan.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  className={selected ? "tariff on" : "tariff"}
                  onClick={() => setPlanId(item.id)}
                >
                  <span className={selected ? "tariff-radio on" : "tariff-radio"} aria-hidden="true">
                    {selected ? "✓" : ""}
                  </span>
                  <span className="tariff-copy">
                    <span className="tariff-name">
                      {item.name}
                      {item.save ? <em>{item.save}</em> : null}
                    </span>
                    <span className="tariff-meta">
                      <strong>{item.credits}</strong> ✦ {item.searches}
                    </span>
                  </span>
                  <strong className="tariff-price">{item.rub}</strong>
                </button>
              );
            })}
          </div>
          <aside className="topup-pay">
            <div className="topup-summary">
              <span>Тариф «{plan.name}»</span>
              <strong>
                {plan.credits} <i>✦</i>
              </strong>
            </div>
            <div className="topup-notes">
              <span>Счёт для юрлиц</span>
              <span>Есть промокод?</span>
            </div>
            <button type="button" className="pay-card">
              <span>Российской картой</span>
              <strong>{plan.rub}</strong>
            </button>
            <button type="button" className="pay-alt">
              <span>Криптовалютой</span>
              <strong>{plan.usdt}</strong>
            </button>
            <button type="button" className="pay-alt">
              <span>WeChat</span>
              <strong>CNY / QR</strong>
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
