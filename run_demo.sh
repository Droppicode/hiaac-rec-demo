#!/usr/bin/env bash
set -e

PORT=8088
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=========================================================="
echo "      Iniciando HIAAC-Rec Web Presentation & Demo        "
echo "=========================================================="
echo "Diretório: $DIR"
echo "URL Local: http://localhost:$PORT/"
echo "Pressione Ctrl+C para encerrar."
echo "=========================================================="

# Abre no navegador padrão se disponível
if command -v xdg-open &> /dev/null; then
  (sleep 1 && xdg-open "http://localhost:$PORT/") &
fi

exec python3 -m http.server "$PORT" --directory "$DIR"
