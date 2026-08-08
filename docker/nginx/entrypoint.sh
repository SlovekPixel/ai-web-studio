#!/bin/sh
set -eu

CERT_DIR=/etc/nginx/certs
CERT_FILE="${CERT_DIR}/fullchain.pem"
KEY_FILE="${CERT_DIR}/privkey.pem"

mkdir -p "${CERT_DIR}"

if [ ! -f "${CERT_FILE}" ] || [ ! -f "${KEY_FILE}" ]; then
  echo "TLS certificates not found; generating self-signed certs for localhost..."
  openssl req -x509 -nodes -newkey rsa:2048 \
    -keyout "${KEY_FILE}" \
    -out "${CERT_FILE}" \
    -days 365 \
    -subj "/CN=localhost" \
    -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
  echo "Self-signed certificates written to ${CERT_DIR}"
else
  echo "Using existing TLS certificates from ${CERT_DIR}"
fi

exec nginx -g 'daemon off;'
