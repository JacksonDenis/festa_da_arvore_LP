# Deploy Git + VPS

O servidor Node deve escutar somente em `127.0.0.1:4173`. O Nginx recebe HTTPS e encaminha as requisições. Indexação e coleta começam desativadas por segurança.

> Na VPS atual, o caminho preferencial é `docker-compose.traefik.yml`, pois as portas 80/443 já são atendidas pelo Traefik na rede externa `n8n_default`. Os arquivos de Nginx/systemd abaixo permanecem como alternativa para outro servidor.

## Deploy atual com Docker + Traefik

```bash
sudo git clone https://github.com/JacksonDenis/festa_da_arvore_LP.git /docker/festa-da-arvore
cd /docker/festa-da-arvore
sudo docker compose -f deploy/docker-compose.traefik.yml up -d --build
sudo docker compose -f deploy/docker-compose.traefik.yml ps
curl --fail https://festa-da-arvore.jacksondenis.tech/healthz
```

O container não roda como root, perde todas as capabilities, usa filesystem somente leitura e não publica portas diretamente. O Traefik emite e renova o certificado TLS.

## 1. Publicar o repositório

O repositório ainda não possui commit nem remote. Revise os arquivos e então execute localmente:

```powershell
git add .
git status
git commit -m "feat: prepare Festa da Arvore for production"
git branch -M main
git remote add origin <URL_DO_REPOSITORIO>
git push -u origin main
```

Nunca adicione `.env`, banco SQLite, logs ou diretórios `data/` e `node_modules/`.

## 2. Preparar a VPS

Instale Node 22 LTS, Git, Nginx e Certbot pelos repositórios oficiais da distribuição. Depois:

```bash
sudo useradd --system --home /nonexistent --shell /usr/sbin/nologin festa-arvore
sudo install -d -o root -g root -m 0755 /opt/festa-da-arvore-2026
sudo install -d -o festa-arvore -g festa-arvore -m 0700 /var/lib/festa-da-arvore-2026
sudo git clone <URL_DO_REPOSITORIO> /opt/festa-da-arvore-2026
cd /opt/festa-da-arvore-2026
sudo npm ci
sudo npm run verify
```

Copie `deploy/env.production.example` para `/etc/festa-da-arvore-2026.env`, substitua o domínio e os segredos e aplique permissão `0600`. Gere `DATA_KEY` com 32 bytes em base64 e guarde uma cópia segura fora da VPS.

```bash
sudo install -o root -g root -m 0600 deploy/env.production.example /etc/festa-da-arvore-2026.env
sudo install -o root -g root -m 0644 deploy/festa-da-arvore.service /etc/systemd/system/festa-da-arvore.service
sudo systemctl daemon-reload
sudo systemctl enable --now festa-da-arvore
curl --fail http://127.0.0.1:4173/healthz
```

## 3. Nginx e HTTPS

Substitua todas as ocorrências de `festa.example.com` em `deploy/nginx.conf.example`. Emita o certificado com Certbot antes de habilitar o bloco HTTPS e valide a configuração:

```bash
sudo cp deploy/nginx.conf.example /etc/nginx/conf.d/festa-da-arvore.conf
sudo nginx -t
sudo systemctl reload nginx
curl --fail https://SEU_DOMINIO/healthz
```

O proxy define `X-Forwarded-For` a partir do endereço remoto e o app só confia nesse header quando `TRUST_PROXY=true`.

## 4. Liberação em duas etapas

1. Com domínio, TLS e conteúdo aprovados, altere `PUBLICATION_APPROVED=true` e `ROBOTS_INDEXING=true`; reinicie o serviço e confira `/robots.txt`, `/sitemap.xml`, canonical e JSON-LD.
2. Somente após política aprovada, template da Meta, Resend e testes controlados, altere `LEADS_ENABLED=true` e `PRIVACY_APPROVED=true`.

```bash
sudo systemctl restart festa-da-arvore
sudo journalctl -u festa-da-arvore -n 100 --no-pager
```

Depois da primeira publicação, cadastre o domínio no Google Search Console, envie `/sitemap.xml` e use a inspeção de URL. Valide os dados do evento no Rich Results Test.

## 5. Atualizações

```bash
cd /opt/festa-da-arvore-2026
sudo git pull --ff-only
sudo npm ci
sudo npm run verify
sudo systemctl restart festa-da-arvore
curl --fail https://SEU_DOMINIO/healthz
```

Faça backup cifrado do diretório `/var/lib/festa-da-arvore-2026` e teste restauração. Nunca copie a chave de dados para o repositório.
