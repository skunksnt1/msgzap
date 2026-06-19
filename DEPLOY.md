# Deploy em produção (VPS + Docker)

Guia para subir o **wpp-disparador** num servidor próprio (Hetzner, DigitalOcean, etc.) com Docker, Postgres e HTTPS automático via Caddy.

## Arquitetura

Quatro serviços no `docker-compose.prod.yml`:

- **postgres** — banco de dados (volume persistente, não exposto publicamente)
- **migrate** — roda as migrações uma vez e encerra (o app só sobe depois que ele termina)
- **app** — o Next.js em build standalone (`node server.js`)
- **caddy** — proxy reverso na frente do app, com certificado HTTPS automático (Let's Encrypt)

## Pré-requisitos

1. Um servidor Linux com **Docker** e **Docker Compose** instalados.
2. Um **domínio** apontando para o IP do servidor (registro A). Ex.: `app.seudominio.com.br`.
3. Portas **80** e **443** liberadas no firewall.

## Passo a passo

### 1. Enviar o código para o servidor

```bash
# no servidor, dentro da pasta onde quer o projeto
git clone <seu-repositorio> wpp-disparador
cd wpp-disparador
# (ou envie os arquivos via scp/rsync)
```

### 2. Criar o arquivo .env

```bash
cp .env.production.example .env
nano .env
```

Preencha pelo menos:

- `DOMAIN` e `NEXT_PUBLIC_APP_URL` (com o seu domínio real, https)
- `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`
- `POSTGRES_URL` (use o mesmo usuário/senha/db; host = `postgres`)
- `BETTER_AUTH_SECRET` — gere com: `openssl rand -base64 32`

As chaves de Google/OpenAI/uazapi são opcionais e podem ser preenchidas depois.

### 3. Subir tudo

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

O Compose vai: subir o Postgres, esperar ficar saudável, rodar as migrações, subir o app e o Caddy. O Caddy emite o certificado HTTPS automaticamente no primeiro acesso ao domínio.

Acesse: **https://app.seudominio.com.br**

### 4. Verificar

```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f app
docker compose -f docker-compose.prod.yml logs -f caddy   # acompanhar emissão do certificado
```

## Atualizações (deploy de nova versão)

```bash
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

As migrações rodam automaticamente a cada subida (o serviço `migrate` aplica só o que falta).

## Comandos úteis

```bash
# Parar tudo
docker compose -f docker-compose.prod.yml down

# Backup do banco
docker exec wpp-postgres pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > backup_$(date +%F).sql

# Rodar migração manualmente
docker compose -f docker-compose.prod.yml run --rm migrate
```

## Observações importantes

- **HTTPS / domínio**: o Caddy só consegue emitir o certificado se o domínio já estiver apontando para o IP do servidor e as portas 80/443 abertas.
- **`NEXT_PUBLIC_APP_URL`** é embutida no build do cliente. Se mudar o domínio, é preciso rebuildar (`--build`).
- **Google OAuth**: cadastre o redirect URI `https://SEU_DOMINIO/api/auth/callback/google` no Google Cloud Console.
- **WhatsApp/uazapi**: o servidor precisa de acesso de saída à URL da uazapi (`NEXT_PUBLIC_UAZAPI_URL`) para o envio funcionar.
- **Banco**: a porta do Postgres não é exposta para fora — acesso só pela rede interna do Compose. Para administrar de fora, use um túnel SSH.
