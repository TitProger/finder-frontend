#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [[ -f .env ]]; then
  set -a
  # source ломается на значениях с пробелом.
  while IFS= read -r line || [[ -n "$line" ]]; do
    line="${line%$'\r'}"
    [[ -z "${line//[[:space:]]/}" || "$line" =~ ^[[:space:]]*# ]] && continue
    if [[ "$line" =~ ^([A-Za-z_][A-Za-z0-9_]*)=(.*)$ ]]; then
      key="${BASH_REMATCH[1]}"
      value="${BASH_REMATCH[2]}"
      if [[ "$value" =~ ^\".*\"$ || "$value" =~ ^\'.*\'$ ]]; then
        value="${value:1:${#value}-2}"
      fi
      printf -v "$key" '%s' "$value"
      export "$key"
    fi
  done < .env
  set +a
fi

if [[ ! -f CONTRACT_VERSION ]]; then
  echo "Ошибка: нет файла CONTRACT_VERSION" >&2
  exit 1
fi

VERSION="$(tr -d '[:space:]' < CONTRACT_VERSION)"
CONTRACT_REPO="${CONTRACT_REPO:-../Finder-api-contract}"
TMP_DIR="$(mktemp -d)"
SOURCE_DIR=""

CONTRACTS_DIR="$ROOT_DIR/contracts"
OPENAPI_SRC_DIR="$CONTRACTS_DIR/openapi-src"
BUNDLED_YAML="$CONTRACTS_DIR/openapi.bundled.yaml"
BUNDLED_JSON="$CONTRACTS_DIR/openapi.bundled.json"
GENERATED_DIR="$ROOT_DIR/shared/api/generated"
GENERATED_TYPES="$GENERATED_DIR/types/generated.ts"

run_redocly_bundle() {
  local input="$1"
  local output="$2"
  npm exec --yes \
    --package "@redocly/cli@1.34.3" \
    --package "yaml@2.7.1" \
    -- redocly bundle "$input" -o "$output"
}

run_openapi_typescript() {
  local input="$1"
  local output="$2"
  npm exec --yes --package "openapi-typescript@7.9.1" -- \
    openapi-typescript "$input" -o "$output"
}

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

if [[ -z "$VERSION" ]]; then
  echo "Ошибка: CONTRACT_VERSION пуст" >&2
  exit 1
fi

echo "→ Синхронизация контракта ${VERSION}"
echo "→ Источник: ${CONTRACT_REPO}"

if [[ -d "$CONTRACT_REPO" ]]; then
  SOURCE_DIR="$(cd "$CONTRACT_REPO" && pwd)"
  if [[ -d "$SOURCE_DIR/.git" ]]; then
    echo "→ Локальный git-репо: checkout ${VERSION}"
    git -C "$SOURCE_DIR" fetch --tags --depth 1 2>/dev/null || true
    git -C "$SOURCE_DIR" checkout "$VERSION" 2>/dev/null \
      || echo "⚠ Tag/ветка ${VERSION} не найдена локально — используем текущее дерево"
  fi
else
  echo "→ Клонируем ${CONTRACT_REPO} @ ${VERSION}"
  git clone --depth 1 --branch "$VERSION" "$CONTRACT_REPO" "$TMP_DIR/contract"
  SOURCE_DIR="$TMP_DIR/contract"
fi

if [[ ! -f "$SOURCE_DIR/openapi.yaml" ]]; then
  echo "Ошибка: не найден $SOURCE_DIR/openapi.yaml" >&2
  exit 1
fi

echo "→ Копируем спеку в contracts/openapi-src"
rm -rf "$OPENAPI_SRC_DIR"
mkdir -p "$CONTRACTS_DIR"
cp -a "$SOURCE_DIR/." "$OPENAPI_SRC_DIR/"
rm -rf "$OPENAPI_SRC_DIR/.git"
printf '%s\n' "$VERSION" > "$CONTRACTS_DIR/VERSION"

ENTRY_SPEC="$OPENAPI_SRC_DIR/openapi.yaml"

echo "→ Bundle OpenAPI → contracts/openapi.bundled.yaml / .json"
run_redocly_bundle "$ENTRY_SPEC" "$BUNDLED_YAML"
run_redocly_bundle "$ENTRY_SPEC" "$BUNDLED_JSON"

echo "→ Codegen типов → shared/api/generated/types/generated.ts"
mkdir -p "$(dirname "$GENERATED_TYPES")"
run_openapi_typescript "$BUNDLED_YAML" "$GENERATED_TYPES"

if [[ -f "scripts/split-generated-types.mjs" ]]; then
  echo "→ Разбиение типов → generated/types/{common,requests,responses}"
  node scripts/split-generated-types.mjs
fi

echo "→ Генерация paths / unwraps → shared/api/generated/"
if [[ -f "scripts/gen-api-paths.mjs" ]]; then
  node scripts/gen-api-paths.mjs "$BUNDLED_JSON" "$GENERATED_DIR"
else
  echo "Ошибка: нет scripts/gen-api-paths.mjs" >&2
  exit 1
fi

echo "✓ Контракт ${VERSION} синхронизирован"
