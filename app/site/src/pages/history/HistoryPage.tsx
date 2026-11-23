import { useState } from "react";
import { SiteHeader } from "../../chrome/SiteHeader";
import { contentLabel, errorText, formatDay, formatDayTime, pageRange } from "../../format";
import { useProducts } from "../../../../../domain/hooks/products/useProducts";
import { navigate } from "../../router";
import { FolderMark, GridMark, ListMark } from "../search/SearchIcons";

const CATEGORIES = [
  "Все категории",
  "Электроника и техника",
  "Одежда",
  "Дом и интерьер",
  "Красота и здоровье",
  "Продукты и напитки",
];

const SORTS = [
  { label: "Дата создания", sort: JSON.stringify({ searchedAt: "desc" }) },
  { label: "Дата обновления", sort: JSON.stringify({ updatedAt: "desc" }) },
  { label: "Название", sort: JSON.stringify({ name: "asc" }) },
  { label: "Артикул", sort: JSON.stringify({ article: "asc" }) },
  { label: "Количество фото", sort: JSON.stringify({ materialCount: "desc" }) },
];

export function HistoryPage() {
  const [category, setCategory] = useState("Все категории");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [sortLabel, setSortLabel] = useState("По дате");
  const [sort, setSort] = useState("");
  const [sortOpen, setSortOpen] = useState(false);
  const [view, setView] = useState<"grid" | "table">("grid");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [limitOpen, setLimitOpen] = useState(false);

  const query = useProducts({
    page,
    limit,
    sort: sort || undefined,
    category: category === "Все категории" ? undefined : category,
  });

  const items = query.data?.items ?? [];
  const info = query.data?.page;
  const total = info?.total ?? items.length;
  const currentPage = info?.page ?? page;
  const pageLimit = info?.limit ?? limit;
  const totalPages = info?.totalPages ?? Math.max(1, Math.ceil(total / pageLimit));

  function pickCategory(next: string) {
    setCategory(next);
    setCategoryOpen(false);
    setPage(1);
  }

  function pickSort(next: { label: string; sort: string }) {
    setSortLabel(next.label === "Дата создания" ? "По дате" : next.label);
    setSort(next.sort);
    setSortOpen(false);
    setPage(1);
  }

  return (
    <div className="page history-page">
      <div className="history-wrap">
        <SiteHeader />
        <main className="history-panel">
          <div className="history-bar">
            <div className="history-title">
              <h1>История поиска</h1>
              <span>{query.isSuccess ? total : ""}</span>
            </div>
            <div className="history-tools">
              <div className="menu">
                <button className="tool" type="button" onClick={() => setCategoryOpen((open) => !open)}>
                  {category === "Все категории" ? "Категория" : category}
                  <Caret />
                </button>
                {categoryOpen ? (
                  <div className="menu-list">
                    {CATEGORIES.map((item) => (
                      <button key={item} type="button" className={item === category ? "on" : ""} onClick={() => pickCategory(item)}>
                        {item}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="menu">
                <button className="tool" type="button" onClick={() => setSortOpen((open) => !open)}>
                  <span className="sort-mark">↕</span>
                  {sortLabel}
                  <Caret />
                </button>
                {sortOpen ? (
                  <div className="menu-list right">
                    {SORTS.map((item) => (
                      <button key={item.label} type="button" onClick={() => pickSort(item)}>
                        {item.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="view-switch">
                <button
                  type="button"
                  className={view === "table" ? "on" : ""}
                  aria-label="Табличный вид"
                  onClick={() => setView("table")}
                >
                  <ListMark className="view-glyph" />
                </button>
                <button
                  type="button"
                  className={view === "grid" ? "on" : ""}
                  aria-label="Вид сетки"
                  onClick={() => setView("grid")}
                >
                  <GridMark className="view-glyph" />
                </button>
              </div>
              <button className="tool icon-only" type="button" aria-label="Папка" tabIndex={-1}>
                <FolderMark className="folder-glyph" />
              </button>
            </div>
          </div>

          {query.isError ? <p className="status-line">{errorText(query.error)}</p> : null}
          {query.isPending ? <p className="status-line">Загрузка истории…</p> : null}

          {view === "grid" ? (
            <div className="history-grid">
              {items.map((item) => (
                <article key={item.id} className="history-card" onClick={() => navigate(`/products/${item.id}`)}>
                  <div className="history-photo">
                    {item.photoUrl ? <img src={item.photoUrl} alt={item.name} /> : <span className="photo-fallback" />}
                    {item.chipLabel ? <span className="chip">{item.chipLabel}</span> : null}
                  </div>
                  <h3>{item.name}</h3>
                  <p>
                    <span>{formatDay(item.searchedAt)}</span>
                    <span className="materials">≡ {item.materialCount}</span>
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="table-wrap">
              <table className="history-table">
                <thead>
                  <tr>
                    <th />
                    <th>Название</th>
                    <th>Контент</th>
                    <th>Обновлён</th>
                    <th>Создан ↓</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} onClick={() => navigate(`/products/${item.id}`)}>
                      <td>
                        <input type="checkbox" aria-label={item.name} onClick={(event) => event.stopPropagation()} />
                      </td>
                      <td>
                        <div className="table-name">
                          {item.photoUrl ? <img src={item.photoUrl} alt="" /> : <span className="photo-fallback" />}
                          <span>
                            <strong>{item.name}</strong>
                            <small>{item.categoryLabel}</small>
                          </span>
                        </div>
                      </td>
                      <td>{contentLabel(item.materialCount)}</td>
                      <td>{item.updatedAt ? formatDayTime(item.updatedAt) : formatDayTime(item.searchedAt)}</td>
                      <td>{formatDayTime(item.createdAt)}</td>
                      <td>⋯</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <footer className="pager">
            <span>{pageRange(currentPage, pageLimit, total)}</span>
            <div className="pager-nav">
              <button type="button" disabled={currentPage <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
                ‹
              </button>
              <span>
                {currentPage}/{totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((value) => value + 1)}
              >
                ›
              </button>
            </div>
            <div className="menu">
              <button className="limit" type="button" onClick={() => setLimitOpen((open) => !open)}>
                по {pageLimit}
                <Caret />
              </button>
              {limitOpen ? (
                <div className="menu-list right">
                  {[20, 40].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setLimit(value);
                        setPage(1);
                        setLimitOpen(false);
                      }}
                    >
                      по {value}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </footer>
        </main>
        <div className="history-accent" />
      </div>
    </div>
  );
}

function Caret() {
  return <span className="caret">⌄</span>;
}
