<?php
session_start();
require_once 'config.php';
require_once 'actualites-config.php';

// Vérifier si l'utilisateur est connecté
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header('Location: login.php');
    exit;
}

$message = '';
$messageType = '';

// Traitement du formulaire d'ajout/modification
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    $actualites = loadActualites();
    
    if ($action === 'add' || $action === 'edit') {
        $id = $_POST['id'] ?? uniqid();
        $title = trim($_POST['title'] ?? '');
        $excerpt = trim($_POST['excerpt'] ?? '');
        $link = trim($_POST['link'] ?? '');
        $duration = intval($_POST['duration'] ?? 8000);
        
        // Validation des données
        if (empty($title) || empty($excerpt)) {
            $message = 'Le titre et la description sont obligatoires.';
            $messageType = 'error';
        } else {
            $imagePath = '';
            
            // Gestion du téléversement de l'image
            if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                $upload = uploadImage($_FILES['image']);
                if (!$upload['success']) {
                    $message = $upload['message'];
                    $messageType = 'error';
                } else {
                    $imagePath = $upload['path'];
                }
            } elseif ($action === 'edit' && !empty($_POST['existing_image'])) {
                $imagePath = $_POST['existing_image'];
            }
            
            if (empty($message)) {
                $actualite = [
                    'id' => $id,
                    'title' => $title,
                    'excerpt' => $excerpt,
                    'link' => $link,
                    'duration' => $duration,
                    'image' => $imagePath,
                    'created_at' => time()
                ];
                
                if ($action === 'add') {
                    $actualites[] = $actualite;
                    $message = 'Actualité ajoutée avec succès !';
                } else {
                    $index = array_search($id, array_column($actualites, 'id'));
                    if ($index !== false) {
                        $actualites[$index] = $actualite;
                        $message = 'Actualité mise à jour avec succès !';
                    } else {
                        $message = 'Actualité non trouvée.';
                        $messageType = 'error';
                    }
                }
                
                if (saveActualites($actualites)) {
                    $messageType = 'success';
                } else {
                    $message = 'Une erreur est survenue lors de la sauvegarde.';
                    $messageType = 'error';
                }
            }
        }
    } elseif ($action === 'delete') {
        $id = $_POST['id'] ?? '';
        if (!empty($id)) {
            $index = array_search($id, array_column($actualites, 'id'));
            if ($index !== false) {
                // Supprimer l'image associée si elle existe
                if (!empty($actualites[$index]['image']) && file_exists(__DIR__ . '/../..' . $actualites[$index]['image'])) {
                    unlink(__DIR__ . '/../..' . $actualites[$index]['image']);
                }
                array_splice($actualites, $index, 1);
                if (saveActualites($actualites)) {
                    $message = 'Actualité supprimée avec succès !';
                    $messageType = 'success';
                } else {
                    $message = 'Une erreur est survenue lors de la suppression.';
                    $messageType = 'error';
                }
            } else {
                $message = 'Actualité non trouvée.';
                $messageType = 'error';
            }
        }
    }
}
?>
