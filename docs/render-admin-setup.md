# Admin + PostgreSQL no Render

Este projeto usa o Render Web Service para o site e Render PostgreSQL para o
conteudo editavel do admin.

## 1. Criar o banco

1. No Render, crie um novo PostgreSQL.
2. Copie a `Internal Database URL` para o Web Service quando site e banco
   estiverem na mesma conta/regiao.
3. Adicione no Web Service a variavel:

```text
DATABASE_URL=postgres://...
```

## 2. Criar as tabelas

No painel do banco, abra o shell/console SQL ou conecte via `psql` e execute:

```bash
psql "$DATABASE_URL" -f db/schema.sql
```

## 3. Criar o primeiro admin

Gere um hash local:

```bash
npm run admin:hash -- "senha-forte-aqui"
```

Copie o resultado para `db/seed-admin.sql`, trocando
`replace-with-password-hash`, ajuste o email e execute:

```bash
psql "$DATABASE_URL" -f db/seed-admin.sql
```

## 4. Conteudo inicial

Para carregar/sincronizar a carta oficial de servicos, profissionais do
agendamento e espacos/cadeiras da pagina de profissionais:

```bash
npm run admin:sync-site-content
```

Para carregar/sincronizar os produtos da pasta `src/assets/lomaproducts` com as
URLs publicas do Firebase/Hosting:

```bash
npm run admin:sync-products
```

O sincronizador usa os nomes dos arquivos para sugerir as secoes do site. Se
voce adicionar novas imagens nessa pasta e publicar os mesmos arquivos no
Firebase, rode o comando novamente para criar ou atualizar os produtos no banco.

Opcionalmente, rode um seed pequeno apenas para validar o painel em ambiente de
teste:

```bash
psql "$DATABASE_URL" -f db/seed-sample-content.sql
```

## 5. Variaveis do Web Service

Configure:

```text
DATABASE_URL=postgres://...
ADMIN_SESSION_SECRET=uma-string-longa-aleatoria
```

Futuro envio de email:

```text
EMAIL_TO=Lomahairspa@gmail.com
EMAIL_FROM=LOMA <no-reply@lomaexperience.com>
RESEND_API_KEY=...
```

Antes de usar `@lomaexperience.com` como remetente, verifique o domínio no Resend e crie os
registros de DNS no provedor autoritativo. Não basta o registro existir em um painel DNS que
não controla os nameservers públicos do domínio.

Comandos úteis para confirmar o DNS publicado:

```powershell
Resolve-DnsName -Type NS lomaexperience.com
Resolve-DnsName -Type TXT send.lomaexperience.com
Resolve-DnsName -Type MX send.lomaexperience.com
Resolve-DnsName -Type TXT resend._domainkey.lomaexperience.com
```

Se o Resend retornar `403 Domain not verified`, corrija/verifique os registros no DNS
autoritativo ou temporariamente altere `EMAIL_FROM` para um domínio já verificado no Resend.

## 6. Deploy

Use os mesmos comandos atuais:

```text
Build Command: npm run build
Start Command: node dist/server/server.js
```

Depois acesse:

```text
/admin/login
```

## Observacoes

- Imagens ficam no Firebase Storage/Hosting.
- O PostgreSQL salva apenas `image_url`.
- Produtos possuem CRUD em `/admin/produtos`.
- Servicos possuem CRUD em `/admin/servicos`.
- Profissionais e espacos/cadeiras possuem CRUD em `/admin/profissionais`.
- Galeria permanece no formato atual por enquanto.
- Render recomenda usar a URL interna do PostgreSQL quando o banco e o Web
  Service estao na mesma regiao.
- O filesystem padrao do Render e efemero; por isso uploads devem continuar no
  Firebase Storage.
