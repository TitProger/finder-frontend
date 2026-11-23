# Finder frontend

Один Vite SPA. Цепочка экрана: страница → hook → domain service → api-client.

```
app/site/          единственное приложение, маршрут-заглушка
shared/api/        ApiClient и разбор конверта
shared/api-types/  реэкспорт типов после sync
domain/services/   вызовы API
domain/hooks/      react-query
scripts/contract-sync.sh
```

`CONTRACT_REPO` по умолчанию `../Finder-api-contract`. Тег в `CONTRACT_VERSION` совпадает с бэкендом. Типы после `npm run contract:sync` лежат в `shared/api/generated` и в git не входят.

```bash
npm install
npm run contract:sync
npm run build
```

Маршруты `app/site`: `/` поиск, `/history` история, `/products/:id` карточка, `/login` вход. Цепочка истории и карточки: страница → hook → `ProductsService` → api-client. Макеты: `Finder-backend/Finder-materials/design/`.
