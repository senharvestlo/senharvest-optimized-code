#!/bin/bash
echo "🚀 Installation de Netlify CLI..."
npm install -g netlify-cli

echo "🔐 Connexion à Netlify..."
netlify login

echo "📦 Déploiement en production..."
netlify deploy --prod --dir=build --site=a22867d2-a71a-43b9-bc64-3959dad89d05

echo "✅ Déploiement terminé!"
