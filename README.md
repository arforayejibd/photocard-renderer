# Samprotikee Photocard Renderer (Vercel Serverless)

A lightweight, serverless Chrome Puppeteer screenshot service for Samprotikee News photocards.

## How to Deploy to Vercel (1-Click)

1. Create a new repository on your GitHub (e.g. `photocard-renderer`).
2. Push this folder to that repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Vercel photocard renderer"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/photocard-renderer.git
   git push -u origin main
   ```
3. Go to [vercel.com](https://vercel.com) and click **Add New... > Project**.
4. Import `photocard-renderer` and click **Deploy**.
5. Once deployed, Vercel will give you a domain like `https://photocard-renderer-xyz.vercel.app`.
6. Test it in your browser:
   `https://photocard-renderer-xyz.vercel.app/api/screenshot?id=7855`
7. Put the URL in your Laravel `.env`:
   ```dotenv
   PHOTOCARD_RENDERER_URL=https://photocard-renderer-xyz.vercel.app/api/screenshot
   ```
