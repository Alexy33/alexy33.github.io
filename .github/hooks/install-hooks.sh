#!/bin/bash

echo "=================================================="
echo "🔧 Installation des Git Hooks"
echo "=================================================="
echo ""

# Vérifier qu'on est dans un repo Git
if [ ! -d ".git" ]; then
    echo "❌ Erreur : Ce n'est pas un repository Git"
    echo "   Lancez ce script depuis la racine du projet"
    exit 1
fi

# Vérifier que le hook existe
if [ ! -f ".github/hooks/pre-push" ]; then
    echo "❌ Erreur : .github/hooks/pre-push introuvable"
    exit 1
fi

# Créer le dossier .git/hooks s'il n'existe pas
mkdir -p .git/hooks

# Copier le hook
cp .github/hooks/pre-push .git/hooks/pre-push
chmod +x .git/hooks/pre-push

echo "✅ Hook pre-push installé !"
echo ""
echo "📋 Ce hook va :"
echo "   • Faire un pull --rebase avant chaque push"
echo "   • Éviter les conflits avec le workflow HTB"
echo ""
echo "💡 Le hook est maintenant actif !"
echo "   Il s'exécutera automatiquement à chaque 'git push'"
echo ""
echo "=================================================="