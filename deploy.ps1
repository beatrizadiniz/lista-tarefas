# ============================================================
# Script de Publicação (PowerShell) - Todo App
# Conecta o repositório local ao GitHub e faz o push.
# ============================================================
# Repositório remoto: https://github.com/beatrizadiniz/lista-tarefas.git
# ============================================================

Write-Host "🔗 Conectando ao repositório remoto..." -ForegroundColor Cyan
git remote add origin https://github.com/beatrizadiniz/lista-tarefas.git

Write-Host "📤 Enviando commits para o GitHub..." -ForegroundColor Cyan
git push -u origin master

Write-Host ""
Write-Host "✅ Publicação concluída!" -ForegroundColor Green
Write-Host "📎 URL: https://github.com/beatrizadiniz/lista-tarefas"
Write-Host ""
Write-Host "⚠️  Lembre-se de configurar as variáveis de ambiente no GitHub Secrets:" -ForegroundColor Yellow
Write-Host "   - DATABASE_URL"
Write-Host "   - NEXT_PUBLIC_SUPABASE_URL"
Write-Host "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
Write-Host "   - NEXT_PUBLIC_APP_URL"
