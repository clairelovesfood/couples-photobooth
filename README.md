# Couples Photobooth 📸

A photobooth for couples who are apart. Upload a photo each, customize with filters, frames, stickers, and captions, then save your strip.

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:5173` to preview.

## Deploy to GitHub Pages

1. Create a repo called `couples-photobooth` on GitHub
2. Update `base` in `vite.config.js` if your repo name is different
3. Run:

```bash
git init
git add .
git commit -m "init"
git remote add origin https://github.com/YOUR_USERNAME/couples-photobooth.git
git push -u origin main
npm run deploy
```

4. In GitHub repo → Settings → Pages → set source to `gh-pages` branch
5. Your site will be live at `https://YOUR_USERNAME.github.io/couples-photobooth/`
