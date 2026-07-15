#!/bin/bash
# Run this ONCE on a new server to issue the initial Let's Encrypt certificate.
# After this, certbot renews automatically every 12 hours via docker compose.
#
# Usage:
#   chmod +x init-ssl.sh
#   ./init-ssl.sh your-domain.com your@email.com

set -e

DOMAIN=${1:?Usage: ./init-ssl.sh <domain> <email>}
EMAIL=${2:?Usage: ./init-ssl.sh <domain> <email>}

echo "==> Replacing YOUR_DOMAIN with $DOMAIN in nginx.conf"
sed -i "s/YOUR_DOMAIN/$DOMAIN/g" nginx/nginx.conf

echo "==> Creating dummy self-signed cert so nginx can start"
mkdir -p ./certbot/conf/live/$DOMAIN
openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
  -keyout ./certbot/conf/live/$DOMAIN/privkey.pem \
  -out    ./certbot/conf/live/$DOMAIN/fullchain.pem \
  -subj   "/CN=localhost" 2>/dev/null

echo "==> Starting nginx (with dummy cert)"
docker compose up -d nginx

echo "==> Removing dummy cert"
rm -rf ./certbot/conf/live

echo "==> Issuing real Let's Encrypt certificate"
docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  -d "$DOMAIN"

echo "==> Reloading nginx with real cert"
docker compose exec nginx nginx -s reload

echo "==> Starting all services"
docker compose up -d

echo ""
echo "Done! Your site is live at https://$DOMAIN"
echo "Remember to update NEXTAUTH_URL=https://$DOMAIN in .env.local"
