# Deployment Guide - Coding World Connect Frontend

## Prerequisites

- Node.js 18+ installed
- Backend API running and accessible
- Environment variables configured

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Development
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# Production (update these with your actual URLs)
# NEXT_PUBLIC_API_URL=https://api.codingworld.in/api/v1
# NEXT_PUBLIC_SOCKET_URL=https://api.codingworld.in
```

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open http://localhost:3000

## Production Build

1. Update environment variables for production in `.env.local` or `.env.production`

2. Build the application:
```bash
npm run build
```

3. Start the production server:
```bash
npm start
```

The application will be available on port 3000 by default.

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)

1. Push your code to GitHub/GitLab/Bitbucket

2. Import the project in Vercel:
   - Go to https://vercel.com
   - Click "New Project"
   - Import your repository
   - Configure environment variables:
     - `NEXT_PUBLIC_API_URL`
     - `NEXT_PUBLIC_SOCKET_URL`

3. Deploy!

Vercel will automatically:
- Build your application
- Set up CI/CD
- Provide a production URL
- Enable automatic deployments on push

### Option 2: Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t connect-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=https://api.codingworld.in/api/v1 connect-frontend
```

### Option 3: Traditional Server (PM2)

1. Install PM2 globally:
```bash
npm install -g pm2
```

2. Build the application:
```bash
npm run build
```

3. Create PM2 ecosystem file (`ecosystem.config.js`):
```javascript
module.exports = {
  apps: [{
    name: 'connect-frontend',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

4. Start with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Option 4: Nginx Reverse Proxy

If using PM2 or running on a server, configure Nginx:

```nginx
server {
    listen 80;
    server_name connect.codingworld.in;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## SSL/HTTPS

### With Vercel
Automatic SSL is provided.

### With Traditional Server
Use Certbot for free SSL:

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d connect.codingworld.in
```

## Performance Optimization

1. **Enable caching**: Configure appropriate cache headers

2. **CDN**: Use a CDN for static assets
   - Vercel includes CDN automatically
   - For custom deployments, consider Cloudflare

3. **Image optimization**: Images are automatically optimized by Next.js

4. **Code splitting**: Automatic with Next.js App Router

## Monitoring

1. **Vercel Analytics** (if using Vercel)
   - Automatic performance monitoring
   - Web Vitals tracking

2. **Error Tracking**
   - Consider Sentry for error tracking
   - Add to `app/layout.tsx`

3. **Logging**
   - Server logs via PM2: `pm2 logs`
   - Custom logging service (optional)

## Environment-Specific Configuration

### Development
- Uses `.env.local`
- Hot reload enabled
- Source maps enabled
- Development mode warnings

### Production
- Uses `.env.production` or environment variables
- Optimized build
- No source maps
- Production mode only

## Troubleshooting

### Build Fails
- Check Node.js version (must be 18+)
- Clear `.next` directory: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run type-check`

### API Connection Issues
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend is running and accessible
- Verify CORS is configured on backend
- Check network/firewall settings

### Socket Connection Issues
- Verify `NEXT_PUBLIC_SOCKET_URL` is correct
- Ensure WebSocket protocol is allowed
- Check if using HTTPS, Socket URL must use WSS
- Verify backend Socket.IO configuration

### Performance Issues
- Enable caching
- Use CDN for static assets
- Optimize images
- Check database query performance
- Monitor API response times

## Security Checklist

- [ ] Environment variables are not committed to git
- [ ] API URLs use HTTPS in production
- [ ] CORS is properly configured on backend
- [ ] Authentication tokens are stored securely
- [ ] No sensitive data in client-side code
- [ ] CSP headers configured
- [ ] Rate limiting enabled on API
- [ ] Input validation on all forms

## Post-Deployment

1. Test all major features:
   - [ ] Authentication (login/register)
   - [ ] Feed loading
   - [ ] Problem browsing
   - [ ] Messaging (real-time)
   - [ ] Live developers
   - [ ] Connections
   - [ ] Profile pages
   - [ ] Settings

2. Monitor:
   - Server resources
   - API response times
   - Error rates
   - User sessions

3. Backup:
   - Regular database backups (backend)
   - Keep deployment configurations versioned

## Rollback Procedure

### Vercel
- Go to deployments
- Select previous working deployment
- Click "Promote to Production"

### PM2
```bash
# Stop current version
pm2 stop connect-frontend

# Deploy previous version
git checkout <previous-commit>
npm run build
pm2 restart connect-frontend
```

### Docker
```bash
# Run previous image
docker run -p 3000:3000 connect-frontend:<previous-tag>
```

## Support

For deployment issues:
- Check logs: `pm2 logs` or Vercel logs
- Review error messages
- Check backend connectivity
- Verify environment variables

## Updates

To update the frontend:

1. Pull latest code:
```bash
git pull origin main
```

2. Install dependencies:
```bash
npm install
```

3. Build:
```bash
npm run build
```

4. Restart:
```bash
pm2 restart connect-frontend
# or
npm start
```

With Vercel, updates deploy automatically on push.
