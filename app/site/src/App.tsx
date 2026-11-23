import { HistoryPage } from "./pages/history/HistoryPage";
import { LoginPage } from "./pages/login/LoginPage";
import { ProductPage } from "./pages/product/ProductPage";
import { SearchPage } from "./pages/search/SearchPage";
import { usePath } from "./router";

export function App() {
  const path = usePath();
  const productMatch = /^\/products\/([^/]+)$/.exec(path);
  const productId = productMatch?.[1];

  if (path === "/history") {
    return <HistoryPage />;
  }

  if (path === "/login") {
    return <LoginPage />;
  }

  if (productId) {
    return <ProductPage id={decodeURIComponent(productId)} />;
  }

  return <SearchPage />;
}
