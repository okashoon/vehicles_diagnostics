#!/bin/bash
# Run this ONCE on a new server to issue the initial Let's Encrypt certificate.
# After this, certbot renews automatically every 12 hours via docker compose.
#
# Usage:
#   chmod +x init-ssl.sh
#   ./init-ssl.sh crashpulse.brighter-buds.com your@email.com

set -e

DOMAIN=${1:?Usage: ./init-ssl.sh <domain> <email>}
EMAIL=${2:?Usage: ./init-ssl.sh <domain> <email>}
WWW_DOMAIN="www.$DOMAIN"

echo "==> Configuring nginx for $DOMAIN and $WWW_DOMAIN"
# YOUR_SERVER_NAMES → both domains (for server_name directive)
sed -i "s/YOUR_SERVER_NAMES/$DOMAIN $WWW_DOMAIN/g" nginx/nginx.conf
# YOUR_DOMAIN → primary domain only (for cert file paths)
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

echo "==> Issuing real Let's Encrypt certificate for $DOMAIN and $WWW_DOMAIN"
docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  -d "$DOMAIN" \
  -d "$WWW_DOMAIN"

echo "==> Reloading nginx with real cert"
docker compose exec nginx nginx -s reload

echo "==> Starting all services"
docker compose up -d

echo ""
echo "Done! Your site is live at:"
echo "  https://$DOMAIN"
echo "  https://$WWW_DOMAIN"
echo ""
echo "Remember to update NEXTAUTH_URL=https://$DOMAIN in .env.local"
