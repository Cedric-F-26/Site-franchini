@echo off
REM Ce script lance le panneau de contrôle du serveur Jekyll.

REM Définit le chemin du script PowerShell
SET SCRIPTPATH=%~dp0control-panel.ps1

REM Lance le script PowerShell
echo Lancement du panneau de controle...
powershell -ExecutionPolicy Bypass -File "%SCRIPTPATH%"
