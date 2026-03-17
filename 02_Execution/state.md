# state.md

## État courant
- Projet : Lia_Pulse
- Statut : RUNNING
- Passe en cours : 1/8
- Dernière mise à jour : 2026-03-17 14:25

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
- Dernier commit (SHA court) : 0836869
- PR de la passe en cours : Oui
- Lien PR (passe) : https://github.com/PangolinBob/Lia_Pulse/pull/1
- CI PR : En cours
- Fusion finale validée par utilisateur : Non

## Priorité active (roadmap)
- Règle : Must > Should > Could
- Lot en cours : Phase 1 / Bloc 1
- Feature en cours : Accès PIN + base UI mobile

## Dernière décision Orchestrator
- Décision : Passe 01 exécutée, en attente CI PR
- Motif : Implémentation bloc 1 terminée + PR ouverte
- Action suivante : Attendre CI verte puis proposer merge + lancement Passe 02
