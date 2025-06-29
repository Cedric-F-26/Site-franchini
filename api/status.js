// Simple endpoint pour vérifier que l'API fonctionne
export default function handler(req, res) {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
}
