#!/bin/bash
# ============================================================
# Script de Publicação - Todo App
# Conecta o repositório local ao GitHub e faz o push.
# ============================================================
# Repositório remoto: https://github.com/beatrizadiniz/lista-tarefas.git
# ============================================================

echo "🔗 Conectando ao repositório remoto..."
git remote add origin https://github.com/beatrizadiniz/lista-tarefas.git

echo "📤 Enviando commits para o GitHub..."
git push -u origin master

echo ""
echo "✅ Publicação concluída!"
echo "📎 URL: https://github.com/beatrizadiniz/lista-tarefas"
echo ""
echo "⚠️  Lembre-se de configurar as variáveis de ambiente no GitHub Secrets:"
echo "   - DATABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   - NEXT_PUBLIC_APP_URL"
