#!/usr/bin/env bash
# 扶阳中医馆官网 · 一键部署脚本（Ubuntu / Tencent Lighthouse）
# 作用：安装 Nginx + 证书工具 → 从 GitHub 拉取站点 → 配置 Nginx → 申请 Let's Encrypt 证书 → 自检验证
# 前置：域名 A 记录已指向本机公网 IP，且防火墙已放行 80/443。
set -euo pipefail

WWW=/var/www/fuyang
EMAIL="${CERT_EMAIL:-admin@fuyangzhongyi.cn}"
REPO=https://github.com/hgtc166/fuyangzhongyi.git
DOMAIN=fuyangzhongyi.cn

echo "==[1/6]== 更新软件源并安装 Nginx / Certbot / Git"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y nginx certbot python3-certbot-nginx git ufw

echo "==[2/6]== 从 GitHub 拉取最新站点文件"
rm -rf /tmp/fuyang-site
git clone --depth 1 "$REPO" /tmp/fuyang-site
mkdir -p "$WWW"
# 复制发布所需文件（6 个 HTML + 共享导航 + 资源图）
cp -f /tmp/fuyang-site/*.html "$WWW"/ 2>/dev/null || true
cp -f /tmp/fuyang-site/shared-nav.js "$WWW"/ 2>/dev/null || true
rm -rf "$WWW/assets" && cp -rf /tmp/fuyang-site/assets "$WWW"/ 2>/dev/null || true
chown -R www-data:www-data "$WWW"
chmod -R 755 "$WWW"
echo "站点文件已部署至 $WWW："
ls -1 "$WWW"

echo "==[3/6]== 写入 Nginx 虚拟主机配置"
cat > /etc/nginx/sites-available/fuyang <<'NGINX'
server {
    listen 80;
    listen [::]:80;
    server_name fuyangzhongyi.cn;

    root /var/www/fuyang;
    index index.html;

    location ~* \.(js|css|jpg|jpeg|png|svg|webp|ico|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
    location / {
        try_files $uri $uri/ /index.html;
    }
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    gzip on;
    gzip_types text/html text/css application/javascript image/svg+xml application/json;
    gzip_min_length 1024;
}
NGINX
ln -sf /etc/nginx/sites-available/fuyang /etc/nginx/sites-enabled/fuyang
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
systemctl enable nginx

echo "==[4/6]== 申请 Let's Encrypt 免费证书（HTTP-01 校验，需 80 端口已放行）"
certbot --nginx -d "$DOMAIN" \
    --non-interactive --agree-tos --redirect \
    -m "$EMAIL" --no-eff-email || {
        echo "证书申请失败：请确认 (1) 域名 A 记录已指向本机 IP；(2) 防火墙 80 端口已放行；(3) DNS 已生效。"
        exit 1
    }

echo "==[5/6]== 放行防火墙（服务器本地 ufw）+ 确保开机自启"
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
ufw --force enable || true
systemctl enable nginx certbot.timer 2>/dev/null || true

echo "==[6/6]== 自检"
echo "-- HTTP 重定向 --"; curl -sI http://localhost/ | head -1
echo "-- HTTPS 状态 --";   curl -sI https://localhost/ | head -1
echo "-- 首页标题 --";     curl -s https://localhost/ | grep -o '<title>[^<]*</title>' | head -1
echo "部署完成。外部访问：https://$DOMAIN"
