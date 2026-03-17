# state.md

## État courant
- Projet : Lia_Pulse
- Statut : PAUSED_SPEC
- Passe en cours : 7/8
- Dernière mise à jour : 2026-03-17 16:42

## Statuts autorisés (verrouillés)
- READY : prêt à lancer
- RUNNING : passe en cours
- PAUSED_SPEC : pause pour clarification de specs
- PAUSED_ESCALADE : pause après échec auto-fix (validation utilisateur requise)
- PAUSED_BUDGET : pause seuil budget atteint
- DONE : terminé, conforme
- STOP_MAX_PASSES : arrêt automatique à la limite de passes

## Paramètres de contrôle
- Max passes globales : 8
- Auto-fix max par problème : 2
- Politique escalade : blocage total jusqu’à validation utilisateur
- Seuil budget 5h : pause si < 20% left
- Seuil budget week : pause si < 20% left

## Suivi Git
- Plateforme : GitHub
- Visibilité repo : Privé (par défaut)
- Repo URL : https://github.com/PangolinBob/Lia_Pulse.git
- Branche active : work/Lia_Pulse
- Dernier commit (SHA court) : eacefe9
- PR de la passe en cours : Non
- Lien PR (passe) : N/A
- CI PR : NA
- Fusion finale validée par utilisateur : Non

## Priorité active (roadmap)
- Règle : Must > Should > Could
- Lot en cours : Phase 1 / Finalisation
- Feature en cours : Validation finale V1 + check iPhone PWA

## Dernière décision Orchestrator
- Décision : Pause contrôlée avant clôture
- Motif : Critère DoD #1 (installation PWA sur iPhone 13) non vérifiable automatiquement
- Action suivante : Demander validation utilisateur sur iPhone puis clôturer
