import { useRef, useState } from "react";
import { useClientInquiryStatus } from "../../../../../domain/hooks/inquiries/useClientInquiryStatus";
import { useCreateClientInquiry } from "../../../../../domain/hooks/inquiries/useCreateClientInquiry";
import { useSearchPack } from "../../../../../domain/hooks/search/useSearchPack";
import { useTaxonomyPathSearch } from "../../../../../domain/hooks/taxonomy/useTaxonomyPathSearch";
import { SiteHeader } from "../../chrome/SiteHeader";
import { errorText } from "../../format";
import { CloseMark, ResultsMark, UploadMark } from "./SearchIcons";

type Photo = { url: string; name: string; file?: File };

const INITIAL_PHOTOS: Photo[] = [{ url: "/demo/grinder.svg", name: "Кофемолка" }];
const DEFAULT_PATH = "Электроника → Бытовая техника → Кофемолки";

export function SearchPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<Photo[]>(INITIAL_PHOTOS);
  const [showProduct, setShowProduct] = useState(true);
  const [name, setName] = useState("Кофемолка Kitfort KT-741");
  const [categoryLabel, setCategoryLabel] = useState(DEFAULT_PATH);
  const [taxonomyNodeId, setTaxonomyNodeId] = useState<number | null>(null);
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [categoryQuery, setCategoryQuery] = useState("");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({ volume: "100_500" });
  const pack = useSearchPack();
  const submit = useCreateClientInquiry();
  const [inquiryId, setInquiryId] = useState<string | null>(null);
  const inquiryStatus = useClientInquiryStatus(inquiryId);
  const pathSearch = useTaxonomyPathSearch(categoryQuery);
  const questions = pack.data?.questions ?? [];
  const suggestions = pathSearch.data ?? [];
  const statusTitle = inquiryStatus.data?.clientStatusLabel ?? submit.data?.clientStatusLabel ?? "В работе";
  const statusText =
    inquiryStatus.data?.clientStatus === "needs_clarification"
      ? inquiryStatus.data.pauseReason ?? "Менеджер уточнит категорию."
      : inquiryStatus.data
        ? "Готовую цену не ждём — поиск идёт асинхронно."
        : submit.data
          ? "Заявка принята. Готовую цену не ждём — поиск идёт асинхронно."
          : null;

  const question = questions[step];
  const progress = questions.length > 0 ? ((step + 1) / questions.length) * 100 : 0;
  const lastStep = questions.length > 0 && step >= questions.length - 1;

  function addFiles(files: FileList | null) {
    if (!files) {
      return;
    }

    const next = [...photos];

    for (const file of files) {
      if (!file.type.startsWith("image/") || next.length >= 4) {
        continue;
      }

      next.push({ url: URL.createObjectURL(file), name: file.name, file });
    }

    setPhotos(next.slice(0, 4));
    setShowProduct(true);
  }

  function pickCategory(nodeId: number, pathLabel: string) {
    setTaxonomyNodeId(nodeId);
    setCategoryLabel(pathLabel);
    setCategoryQuery("");
    setCategoryOpen(false);
  }

  async function onNext() {
    if (!lastStep) {
      setStep((current) => Math.min(questions.length - 1, current + 1));

      return;
    }

    if (submit.isPending) {
      return;
    }

    const text = name.trim();

    if (!text) {
      return;
    }

    const profileJson: Record<string, string | null> = {};

    for (const item of questions) {
      profileJson[item.id] = answers[item.id] ?? null;
    }

    const files = photos.flatMap((photo) => (photo.file ? [photo.file] : []));

    const created = await submit.mutateAsync({ text, files, profileJson, taxonomyNodeId });

    setInquiryId(created.id);
  }

  return (
    <div className="page search-page">
      <div className="search-wrap">
        <SiteHeader />
        <main className="search-grid">
          <div className="search-left">
            <section className="panel product-panel">
              {showProduct ? (
                <>
                  <div className="panel-head">
                    <div className="step-title">
                      <span className="check-badge" aria-hidden="true">
                        <svg viewBox="0 0 24 24">
                          <path d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </span>
                      <h2>Ваш товар</h2>
                    </div>
                    <button className="icon-x" type="button" aria-label="Сбросить товар" onClick={() => setShowProduct(false)}>
                      <CloseMark />
                    </button>
                  </div>
                  <div className="slots">
                    {Array.from({ length: 4 }, (_, index) => {
                      const photo = photos[index];

                      if (!photo) {
                        return (
                          <button key={index} className="slot slot-empty" type="button" onClick={() => fileRef.current?.click()}>
                            +
                          </button>
                        );
                      }

                      return (
                        <div key={photo.url} className="slot">
                          <img src={photo.url} alt={name || photo.name} />
                        </div>
                      );
                    })}
                  </div>
                  <div className="name-box">
                    <input value={name} onChange={(event) => setName(event.target.value)} aria-label="Название товара" />
                    <button className="category-toggle" type="button" onClick={() => setCategoryOpen((open) => !open)}>
                      <span>{categoryLabel}</span>
                      <span className={categoryOpen ? "chevron up" : "chevron"}>{categoryOpen ? "⌃" : "⌄"}</span>
                    </button>
                  </div>
                  {categoryOpen ? (
                    <div className="category-menu">
                      <input
                        className="category-search"
                        value={categoryQuery}
                        onChange={(event) => setCategoryQuery(event.target.value)}
                        placeholder="Поиск: Дом → Сад → Газонокосилки"
                        aria-label="Поиск категории по пути"
                      />
                      {pathSearch.isPending && categoryQuery.trim() ? (
                        <p className="category-hint">Ищем…</p>
                      ) : null}
                      {pathSearch.isError ? <p className="category-hint">{errorText(pathSearch.error)}</p> : null}
                      {!categoryQuery.trim() ? (
                        <p className="category-hint">Введите часть пути — без показа всего дерева</p>
                      ) : null}
                      {categoryQuery.trim() && !pathSearch.isPending && suggestions.length === 0 && !pathSearch.isError ? (
                        <p className="category-hint">Ничего не найдено</p>
                      ) : null}
                      {suggestions.map((item) => (
                        <button
                          key={item.nodeId}
                          className="category-option"
                          type="button"
                          onClick={() => pickCategory(item.nodeId, item.pathLabel)}
                        >
                          <span>
                            <strong>{item.name}</strong>
                            <small>{item.pathLabel}</small>
                          </span>
                          {taxonomyNodeId === item.nodeId ? <span className="picked">✓</span> : <span className="picked placeholder" />}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </>
              ) : (
                <>
                  <div className="step-title empty-title">
                    <span className="step-num">1</span>
                    <h2>Ваш товар</h2>
                  </div>
                  <button className="upload-zone" type="button" onClick={() => fileRef.current?.click()}>
                    <span className="upload-icon" aria-hidden="true">
                      <UploadMark />
                    </span>
                    <strong>Добавьте фото товара</strong>
                    <span className="upload-btn">+ Выбрать фото</span>
                    <small>До 4 фото, или вставьте ⌘+V</small>
                  </button>
                </>
              )}
              <input
                ref={fileRef}
                className="hidden-file"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={(event) => {
                  addFiles(event.target.files);
                  event.target.value = "";
                }}
              />
            </section>

            {pack.isError ? <p className="status-line">{errorText(pack.error)}</p> : null}
            {pack.isPending ? <p className="status-line">Загрузка вопросов…</p> : null}
            {question ? (
              <section className="panel question-panel">
                <div>
                  <h2>Уточним детали</h2>
                  <div className="progress-row">
                    <span>
                      Вопрос {step + 1} из {questions.length}
                    </span>
                    <span className="progress">
                      <span style={{ width: `${progress}%` }} />
                    </span>
                  </div>
                  <h3>{question.title}</h3>
                  <div className="options">
                    {question.options.map((option) => (
                      <label key={option.value}>
                        <input
                          type="radio"
                          name={question.id}
                          value={option.value}
                          checked={answers[question.id] === option.value}
                          onChange={() => setAnswers((current) => ({ ...current, [question.id]: option.value }))}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="question-nav">
                  <button
                    className="btn-back"
                    type="button"
                    disabled={step === 0 || submit.isPending}
                    onClick={() => setStep((current) => Math.max(0, current - 1))}
                  >
                    ← Назад
                  </button>
                  <button className="btn-next" type="button" disabled={submit.isPending || !name.trim()} onClick={() => void onNext()}>
                    {submit.isPending ? "Отправка…" : "Далее →"}
                  </button>
                </div>
              </section>
            ) : null}
          </div>

          <section className="panel results-panel">
            <div className="step-title">
              <span className="step-num muted">3</span>
              <h2>Результаты</h2>
            </div>
            {submit.isSuccess && (submit.data || inquiryStatus.data) ? (
              <div className="results-status">
                <p className="results-status-title">{statusTitle}</p>
                {statusText ? <p className="results-status-text">{statusText}</p> : null}
              </div>
            ) : submit.isError ? (
              <div className="results-status">
                <p className="results-status-title">Ошибка</p>
                <p className="results-status-text">{errorText(submit.error)}</p>
              </div>
            ) : inquiryStatus.isError ? (
              <div className="results-status">
                <p className="results-status-title">Ошибка</p>
                <p className="results-status-text">{errorText(inquiryStatus.error)}</p>
              </div>
            ) : (
              <div className="results-empty">
                <span className="results-icon" aria-hidden="true">
                  <ResultsMark />
                </span>
                <p>Здесь появятся ваши генерации и предложения поставщиков</p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
