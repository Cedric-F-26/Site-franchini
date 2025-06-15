<?php
// Configuration pour la gestion des actualités
define('ACTUALITES_FILE', __DIR__ . '/../../data/actualites.json');

// Créer le répertoire data s'il n'existe pas
if (!file_exists(dirname(ACTUALITES_FILE))) {
    mkdir(dirname(ACTUALITES_FILE), 0755, true);
}

// Créer le fichier d'actualités avec un tableau vide s'il n'existe pas
if (!file_exists(ACTUALITES_FILE)) {
    file_put_contents(ACTUALITES_FILE, json_encode([], JSON_PRETTY_PRINT));
}

// Fonction pour charger les actualités
function loadActualites() {
    if (file_exists(ACTUALITES_FILE)) {
        $data = file_get_contents(ACTUALITES_FILE);
        return json_decode($data, true) ?: [];
    }
    return [];
}

// Fonction pour sauvegarder les actualités
function saveActualites($actualites) {
    return file_put_contents(ACTUALITES_FILE, json_encode($actualites, JSON_PRETTY_PRINT));
}

// Fonction pour téléverser une image
function uploadImage($file, $prefix = 'news_') {
    $targetDir = __DIR__ . "/../../assets/images/actualites/";
    
    // Créer le répertoire s'il n'existe pas
    if (!file_exists($targetDir)) {
        mkdir($targetDir, 0755, true);
    }
    
    $fileName = $prefix . time() . '_' . basename($file["name"]);
    $targetFile = $targetDir . $fileName;
    $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));
    
    // Vérifier si le fichier est une image
    $check = getimagesize($file["tmp_name"]);
    if ($check === false) {
        return ['success' => false, 'message' => 'Le fichier n\'est pas une image.'];
    }
    
    // Vérifier la taille du fichier (max 5MB)
    if ($file["size"] > 5000000) {
        return ['success' => false, 'message' => 'Désolé, votre fichier est trop volumineux.'];
    }
    
    // Autoriser certains formats de fichier
    $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
    if (!in_array($imageFileType, $allowedTypes)) {
        return ['success' => false, 'message' => 'Désolé, seuls les fichiers JPG, JPEG, PNG & GIF sont autorisés.'];
    }
    
    // Téléverser le fichier
    if (move_uploaded_file($file["tmp_name"], $targetFile)) {
        return [
            'success' => true, 
            'path' => 'assets/images/actualites/' . $fileName
        ];
    } else {
        return ['success' => false, 'message' => 'Une erreur est survenue lors du téléversement du fichier.'];
    }
}
?>
