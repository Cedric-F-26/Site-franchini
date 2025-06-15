<?php
require_once 'includes/config.php';
require_once 'includes/actualites-handler.php';

// Vérifier si l'utilisateur est connecté
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header('Location: login.php');
    exit;
}

// Charger les actualités
$actualites = loadActualites();

// Trier les actualités par date de création (du plus récent au plus ancien)
usort($actualites, function($a, $b) {
    return ($b['created_at'] ?? 0) <=> ($a['created_at'] ?? 0);
});

// Récupérer l'actualité à éditer si ID fourni
$editingActualite = null;
if (isset($_GET['edit'])) {
    $editingId = $_GET['edit'];
    foreach ($actualites as $actu) {
        if ($actu['id'] === $editingId) {
            $editingActualite = $actu;
            break;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestion des Actualités - Administration</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            border-bottom: 2px solid #4CAF50;
            padding-bottom: 10px;
        }
        .btn {
            display: inline-block;
            background: #4CAF50;
            color: white;
            padding: 10px 15px;
            text-decoration: none;
            border-radius: 4px;
            margin: 5px 0;
            border: none;
            cursor: pointer;
            font-size: 14px;
        }
        .btn-edit {
            background: #2196F3;
        }
        .btn-delete {
            background: #f44336;
        }
        .btn-secondary {
            background: #757575;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        tr:hover {
            background-color: #f9f9f9;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input[type="text"], 
        input[type="number"],
        textarea {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        textarea {
            height: 100px;
            resize: vertical;
        }
        .preview-image {
            max-width: 200px;
            max-height: 150px;
            margin: 10px 0;
            display: block;
        }
        .message {
            padding: 10px 15px;
            margin: 10px 0;
            border-radius: 4px;
        }
        .success {
            background-color: #dff0d8;
            color: #3c763d;
            border: 1px solid #d6e9c6;
        }
        .error {
            background-color: #f2dede;
            color: #a94442;
            border: 1px solid #ebccd1;
        }
        .actions {
            white-space: nowrap;
        }
        .actions a, .actions button {
            margin-right: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Gestion des Actualités</h1>
        
        <!-- Message de statut -->
        <?php if (!empty($message)): ?>
            <div class="message <?php echo $messageType; ?>">
                <?php echo htmlspecialchars($message); ?>
            </div>
        <?php endif; ?>
        
        <!-- Formulaire d'ajout/modification -->
        <h2><?php echo $editingActualite ? 'Modifier une actualité' : 'Ajouter une actualité'; ?></h2>
        <form action="" method="post" enctype="multipart/form-data">
            <input type="hidden" name="action" value="<?php echo $editingActualite ? 'edit' : 'add'; ?>">
            <input type="hidden" name="id" value="<?php echo $editingActualite ? htmlspecialchars($editingActualite['id']) : ''; ?>">
            
            <div class="form-group">
                <label for="title">Titre *</label>
                <input type="text" id="title" name="title" required 
                       value="<?php echo $editingActualite ? htmlspecialchars($editingActualite['title']) : ''; ?>">
            </div>
            
            <div class="form-group">
                <label for="excerpt">Description *</label>
                <textarea id="excerpt" name="excerpt" required><?php 
                    echo $editingActualite ? htmlspecialchars($editingActualite['excerpt']) : ''; 
                ?></textarea>
            </div>
            
            <div class="form-group">
                <label for="link">Lien (optionnel)</label>
                <input type="text" id="link" name="link" 
                       value="<?php echo $editingActualite ? htmlspecialchars($editingActualite['link'] ?? '') : ''; ?>">
            </div>
            
            <div class="form-group">
                <label for="duration">Durée d'affichage (ms) *</label>
                <input type="number" id="duration" name="duration" min="3000" step="1000" required
                       value="<?php echo $editingActualite ? htmlspecialchars($editingActualite['duration'] ?? '8000') : '8000'; ?>">
                <small>Durée en millisecondes (1000 ms = 1 seconde)</small>
            </div>
            
            <div class="form-group">
                <label for="image">Image *</label>
                <?php if ($editingActualite && !empty($editingActualite['image'])): ?>
                    <img src="/<?php echo htmlspecialchars(ltrim($editingActualite['image'], '/')); ?>" 
                         alt="Image actuelle" class="preview-image">
                    <input type="hidden" name="existing_image" 
                           value="<?php echo htmlspecialchars($editingActualite['image']); ?>">
                    <small>Laisser vide pour conserver l'image actuelle</small><br>
                <?php endif; ?>
                <input type="file" id="image" name="image" 
                       <?php echo !$editingActualite ? 'required' : ''; ?>>
            </div>
            
            <div class="form-group">
                <button type="submit" class="btn">
                    <?php echo $editingActualite ? 'Mettre à jour' : 'Ajouter'; ?>
                </button>
                <?php if ($editingActualite): ?>
                    <a href="actualites.php" class="btn btn-secondary">Annuler</a>
                <?php endif; ?>
            </div>
        </form>
        
        <!-- Liste des actualités existantes -->
        <h2>Liste des actualités</h2>
        <?php if (empty($actualites)): ?>
            <p>Aucune actualité n'a été ajoutée pour le moment.</p>
        <?php else: ?>
            <table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Titre</th>
                        <th>Description</th>
                        <th>Durée</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($actualites as $actu): ?>
                        <tr>
                            <td>
                                <?php if (!empty($actu['image'])): ?>
                                    <img src="/<?php echo htmlspecialchars(ltrim($actu['image'], '/')); ?>" 
                                         alt="" style="max-width: 80px; max-height: 60px;">
                                <?php endif; ?>
                            </td>
                            <td><?php echo htmlspecialchars($actu['title']); ?></td>
                            <td><?php echo htmlspecialchars(substr($actu['excerpt'], 0, 100)) . '...'; ?></td>
                            <td><?php echo number_format($actu['duration'] / 1000, 1); ?>s</td>
                            <td class="actions">
                                <a href="?edit=<?php echo urlencode($actu['id']); ?>" class="btn btn-edit">
                                    <i class="fas fa-edit"></i> Modifier
                                </a>
                                <form action="" method="post" style="display: inline-block;" 
                                      onsubmit="return confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?');">
                                    <input type="hidden" name="action" value="delete">
                                    <input type="hidden" name="id" value="<?php echo htmlspecialchars($actu['id']); ?>">
                                    <button type="submit" class="btn btn-delete">
                                        <i class="fas fa-trash"></i> Supprimer
                                    </button>
                                </form>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>
        
        <p>
            <a href="index.php" class="btn btn-secondary">
                <i class="fas fa-arrow-left"></i> Retour au tableau de bord
            </a>
        </p>
    </div>
    
    <script>
        // Confirmation avant suppression
        function confirmDelete() {
            return confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?');
        }
        
        // Aperçu de l'image avant téléversement
        document.getElementById('image').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    let preview = document.createElement('img');
                    preview.src = e.target.result;
                    preview.className = 'preview-image';
                    preview.style.maxWidth = '200px';
                    preview.style.maxHeight = '150px';
                    preview.style.margin = '10px 0';
                    
                    const existingPreview = document.querySelector('.image-preview');
                    if (existingPreview) {
                        existingPreview.replaceWith(preview);
                    } else {
                        this.parentNode.insertBefore(preview, this.nextSibling);
                    }
                    preview.className = 'preview-image image-preview';
                }
                reader.readAsDataURL(file);
            }
        });
    </script>
</body>
</html>
