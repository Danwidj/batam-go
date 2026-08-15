import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// API Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Unified JS Backend Running!' });
});

// Serve frontend static assets from frontend/dist
const frontendDist = path.join(__dirname, 'frontend', 'dist');
app.use(express.static(frontendDist));

// SPA Fallback for PWA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('Frontend not built yet. Run "npm run build-frontend" or "npm run quick-build".');
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Unified JS Server running on http://localhost:${PORT}`);
});
