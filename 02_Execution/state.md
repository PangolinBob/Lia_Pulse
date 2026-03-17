# state.md

## État courant
- Projet : Lia_Pulse
- Statut : PAUSED_ESCALADE
- Passe en cours : 0/8
- Dernière mise à jour : 2026-03-17 14:22

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
- Repo URL : [BLOQUÉ - repo dédié non créé]
- Branche active : [BLOQUÉ - work/Lia_Pulse absent]
- Dernier commit (SHA court) : [BLOQUÉ]
- PR de la passe en cours : Non
- Lien PR (passe) : [BLOQUÉ]
- CI PR : NA
- Fusion finale validée par utilisateur : Non

## Priorité active (roadmap)
- Règle : Must > Should > Could
- Lot en cours : Pré-lancement
- Feature en cours : Check pré-lancement

## Dernière décision Orchestrator
- Décision : Pause avant passe 1
- Motif : Pré-lancement incomplet (GitHub/repo/branche work dédiés manquants)
- Action suivante : Validation utilisateur pour création repo privé GitHub + initialisation
