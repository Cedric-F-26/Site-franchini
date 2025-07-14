# Pour un affichage correct des accents, ce fichier DOIT être encodé en 'UTF-8 with BOM'.

# Ajout des assemblies nécessaires pour l'interface graphique
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Variable globale pour stocker le job du serveur Jekyll
$script:jekyllJob = $null

# --- Création de la fenêtre principale ---
$form = New-Object System.Windows.Forms.Form
$form.Text = "Panneau de Contrôle - Serveur Jekyll"
$form.Size = New-Object System.Drawing.Size(420, 220)
$form.StartPosition = "CenterScreen"
$form.FormBorderStyle = 'FixedSingle'
$form.MaximizeBox = $false

# --- Étiquette de statut ---
$statusLabel = New-Object System.Windows.Forms.Label
$statusLabel.Text = "Serveur arrêté."
$statusLabel.Location = New-Object System.Drawing.Point(20, 20)
$statusLabel.Size = New-Object System.Drawing.Size(360, 30)
$statusLabel.Font = New-Object System.Drawing.Font("Segoe UI", 12)

# --- Bouton Démarrer ---
$startButton = New-Object System.Windows.Forms.Button
$startButton.Text = "Démarrer le serveur"
$startButton.Location = New-Object System.Drawing.Point(50, 70)
$startButton.Size = New-Object System.Drawing.Size(150, 50)
$startButton.Font = New-Object System.Drawing.Font("Segoe UI", 10)
$startButton.add_Click({
    $projectPath = "C:\Users\cedri\Documents\GitHub\mon-site-web\Site-franchini"
    
    $statusLabel.Text = "Nettoyage..."
    $form.Refresh()
    Remove-Item -Recurse -Force -Path (Join-Path -Path $projectPath -ChildPath '_site') -ErrorAction SilentlyContinue

    $statusLabel.Text = "Lancement du serveur..."
    $form.Refresh()

    # Script à exécuter en arrière-plan
    $scriptBlock = {
        param($path)
        cd $path
        bundle exec jekyll serve
    }

    # Démarrer le serveur en tant que job
    $script:jekyllJob = Start-Job -ScriptBlock $scriptBlock -ArgumentList $projectPath
    
    $startButton.Enabled = $false
    $stopButton.Enabled = $true

    # Boucle pour attendre que le serveur soit prêt
    $serverReady = $false
    foreach ($i in 1..45) { # Tenter pendant 45 secondes max
        $statusLabel.Text = "Attente du serveur... ($i s)"
        $form.Refresh()
        
        $output = Receive-Job -Job $script:jekyllJob -Keep
        if ($output -match "Server address:") {
            $serverReady = $true
            break
        }
        Start-Sleep -Seconds 1
    }

    if ($serverReady) {
        $statusLabel.Text = "Serveur prêt !"
        $statusLabel.ForeColor = [System.Drawing.Color]::Green
        Start-Process "http://127.0.0.1:4000/"
    } else {
        $statusLabel.Text = "Le serveur n'a pas démarré."
        $statusLabel.ForeColor = [System.Drawing.Color]::Red
        Stop-Job -Job $script:jekyllJob | Out-Null
        Remove-Job -Job $script:jekyllJob -Force | Out-Null
        $script:jekyllJob = $null
        $stopButton.Enabled = $false
        $startButton.Enabled = $true
    }
})

# --- Bouton Arrêter ---
$stopButton = New-Object System.Windows.Forms.Button
$stopButton.Text = "Arrêter le serveur"
$stopButton.Location = New-Object System.Drawing.Point(210, 70)
$stopButton.Size = New-Object System.Drawing.Size(150, 50)
$stopButton.Font = New-Object System.Drawing.Font("Segoe UI", 10)
$stopButton.Enabled = $false
$stopButton.add_Click({
    if ($script:jekyllJob) {
        Stop-Job -Job $script:jekyllJob | Out-Null
        Remove-Job -Job $script:jekyllJob -Force | Out-Null
        $script:jekyllJob = $null
        $statusLabel.Text = "Serveur arrêté."
        $statusLabel.ForeColor = [System.Drawing.Color]::Black
        $startButton.Enabled = $true
        $stopButton.Enabled = $false
    }
})

# --- Gestion de la fermeture de la fenêtre ---
$form.add_FormClosing({
    if ($script:jekyllJob) {
        Stop-Job -Job $script:jekyllJob -ErrorAction SilentlyContinue | Out-Null
        Remove-Job -Job $script:jekyllJob -Force -ErrorAction SilentlyContinue | Out-Null
    }
})

# --- Ajout des contrôles à la fenêtre ---
$form.Controls.Add($statusLabel)
$form.Controls.Add($startButton)
$form.Controls.Add($stopButton)

# --- Affichage de la fenêtre ---
[void]$form.ShowDialog()
