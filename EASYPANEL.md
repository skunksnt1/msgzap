# Deploy no EasyPanel (a partir do Git)

O EasyPanel cuida do proxy reverso, do HTTPS e do banco. Você só precisa do
**Dockerfile** (já incluso) e do repositório no Git. O `docker-compose.prod.yml`
e o `Caddyfile` NÃO são usados no EasyPanel — são só para o caminho de VPS manual.

## 1. Subir o projeto para o Git

No seu computador, na pasta do projeto:

```bash
git init                # se ainda não for um repositório
git add .
git commit -m "Deploy: Dockerfile e ajustes de produção"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
git push -u origin main
```

O `.env` e `.env.local` não vão para o Git (estão no `.gitignore`) — as variáveis
serão definidas direto no EasyPanel.

> Se o repositório for privado, conecte sua conta GitHub no EasyPanel
> (Settings → Git) para ele conseguir clonar.

## 2. Criar o banco de dados (Postgres) no EasyPanel

1. No seu projeto do EasyPanel → **+ Service** → **Postgres**.
2. Defina nome, usuário, senha e database.
3. Após criar, copie a **Connection URL interna** (host = nome do serviço, ex.:
   `postgresql://user:senha@meuprojeto_postgres:5432/wpp`). É essa que vai no
   `POSTGRES_URL` do app.

## 3. Criar o serviço do App

1. **+ Service** → **App**.
2. **Source**: GitHub → selecione o repositório e a branch `main`.
3. **Build**: escolha **Dockerfile** (o EasyPanel detecta o `Dockerfile` na raiz).

## 4. Variáveis de ambiente (na aba Environment do App)

```env
POSTGRES_URL=postgresql://user:senha@meuprojeto_postgres:5432/wpp
BETTER_AUTH_SECRET=<gere com: openssl rand -base64 32>
NEXT_PUBLIC_APP_URL=https://app.seudominio.com.br
NEXT_PUBLIC_UAZAPI_URL=https://free.uazapi.com

# opcionais
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5-mini
UAZAPI_ADMINTOKEN=
UAZAPI_API_KEY=
```

> `NEXT_PUBLIC_APP_URL` é usada no build do cliente. Se quiser garantir que ela
> seja embutida, defina-a também em **Build Args** no EasyPanel. Mesmo sem isso,
> o login já usa a origem do navegador como fallback.

## 5. Domínio e HTTPS

1. Na aba **Domains** do App, adicione `app.seudominio.com.br` apontando para a
   porta **3000**.
2. Aponte o DNS (registro A) do domínio para o IP do servidor do EasyPanel.
3. O EasyPanel emite o certificado HTTPS (Let's Encrypt) automaticamente.

## 6. Deploy

Clique em **Deploy**. O EasyPanel clona o repo, builda o Dockerfile e sobe o
container. No start, o app **aplica as migrações automaticamente** (`db:migrate`)
e então inicia o servidor.

## 7. Criar o usuário admin

Não há admin pré-criado. Acesse `https://SEU_DOMINIO/register`, crie sua conta
por e-mail/senha. Para tornar admin, use o console do serviço no EasyPanel
(ou rode via banco) — me chame que eu preparo um script de promoção se precisar.

## Atualizações

Cada `git push` na branch `main` pode disparar um novo deploy (ative o
**Auto Deploy** no EasyPanel) ou clique em **Deploy** manualmente. As migrações
pendentes são aplicadas sozinhas a cada subida.

## Observações

- O Postgres no EasyPanel já tem volume persistente — seus dados sobrevivem a
  redeploys.
- Para o WhatsApp funcionar, o servidor precisa de acesso de saída à URL da
  uazapi.
- Google OAuth: cadastre o redirect `https://SEU_DOMINIO/api/auth/callback/google`.
```
