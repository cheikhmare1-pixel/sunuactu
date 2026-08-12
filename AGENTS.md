# Directives du Projet SunuActu — Déploiement Automatique GitHub

> **RÈGLE OBLIGATOIRE DE DÉPLOIEMENT AUTOMATIQUE**

À chaque fois qu'une modification (ajout de fonctionnalité, correction de bug, refonte UI, mise à jour de données ou de fichiers) est effectuée sur ce projet (`sunuactu`), l'assistant DOIT automatiquement commiter et pousser (deployer) les modifications vers le dépôt GitHub officiel du projet :

- **Propriétaire GitHub** : `cheikhmare1-pixel`
- **Nom du Dépôt** : `sunuactu`
- **Branche principale** : `main`

---

## Instructions d'Exécution Automatique

1. **Vérification & Build** : S'assurer que le projet compile correctement sans erreurs.
2. **Push Automatique sur GitHub** : Utiliser l'outil GitHub MCP `push_files` (ou git push) pour envoyer tous les fichiers créés ou modifiés directement sur `cheikhmare1-pixel/sunuactu` sur la branche `main`.
3. **Message de Commit** : Rédiger un message de commit clair et structuré en français (ex: `feat: ...`, `fix: ...`, `style: ...`).
4. **Confirmation Utilisateur** : Informer l'utilisateur avec les références du commit déployé.
