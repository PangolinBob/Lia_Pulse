# state.md

## État courant
- Projet : Lia_Pulse
- Statut : RUNNING
- Passe en cours : 2/8
- Dernière mise à jour : 2026-03-17 15:10

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
- Dernier commit (SHA court) : a1d7904
- PR de la passe en cours : Oui
- Lien PR (passe) : https://github.com/PangolinBob/Lia_Pulse/pull/2
- CI PR : En cours
- Fusion finale validée par utilisateur : Non

## Priorité active (roadmap)
- Règle : Must > Should > Could
- Lot en cours : Phase 1 / Bloc 2
- Feature en cours : Vue Rapide (4 blocs + avancement visuel)

## Dernière décision Orchestrator
- Décision : Reprise validée, PASS-01 mergée, PASS-02 exécutée
- Motif : Go utilisateur reçu + correction process anti-attente silencieuse appliquée
- Action suivante : Attendre CI PR #2, notifier Go/No-Go immédiat, puis merge + Passe 03
