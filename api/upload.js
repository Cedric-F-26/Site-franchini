const multer = require('multer');
const path = require('path');

// Configuration du stockage en mémoire pour Vercel
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max
    },
    fileFilter: (req, file, cb) => {
        // Types de fichiers autorisés
        const allowedTypes = /jpeg|jpg|png|gif|mp4|webm|ogg/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Type de fichier non autorisé. Images (jpg, png, gif) ou vidéos (mp4, webm, ogg) uniquement.'));
        }
    }
});

module.exports = async (req, res) => {
    // Configuration CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
    }

    // Utiliser multer pour parser le fichier
    upload.single('file')(req, res, (err) => {
        if (err) {
            console.error('Erreur upload:', err);
            return res.status(400).json({ 
                success: false, 
                message: err.message || 'Erreur lors de l\'upload' 
            });
        }

        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'Aucun fichier fourni' 
            });
        }

        try {
            // En production, vous pourriez uploader vers AWS S3, Cloudinary, etc.
            // Pour l'instant, nous retournons le fichier en base64
            const base64Data = req.file.buffer.toString('base64');
            const dataUrl = `data:${req.file.mimetype};base64,${base64Data}`;

            // Générer un nom de fichier unique
            const timestamp = Date.now();
            const filename = `${timestamp}_${req.file.originalname}`;
            const fileType = req.file.mimetype.startsWith('image/') ? 'image' : 'video';

            res.json({
                success: true,
                message: 'Fichier uploadé avec succès',
                data: {
                    filename: filename,
                    originalName: req.file.originalname,
                    size: req.file.size,
                    mimetype: req.file.mimetype,
                    type: fileType,
                    url: dataUrl, // En production, ce serait une URL réelle
                    dataUrl: dataUrl // Pour affichage direct
                }
            });

        } catch (error) {
            console.error('Erreur traitement fichier:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Erreur lors du traitement du fichier' 
            });
        }
    });
};
