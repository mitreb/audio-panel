#!/bin/sh

# Set default backend URL if not provided
BACKEND_URL=${BACKEND_URL:-"http://localhost:3000"}
BACKEND_HOST=$(echo $BACKEND_URL | sed -e 's|^https\?://||' -e 's|/.*||')

echo "Configuring nginx to proxy to: $BACKEND_URL"
echo "Backend host: $BACKEND_HOST"

# Replace environment variables in nginx config using sed (safer than envsubst)
sed -e "s|\${BACKEND_URL}|${BACKEND_URL}|g" \
    -e "s|\${BACKEND_HOST}|${BACKEND_HOST}|g" \
    /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

echo "Generated nginx config:"
cat /etc/nginx/conf.d/default.conf

# Start nginx
exec nginx -g 'daemon off;'
