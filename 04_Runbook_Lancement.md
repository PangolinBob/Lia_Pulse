# Runbook lancement — Production automatisée (1 page)

## Avant lancement (check 60 secondes)
- [ ] Dossier projet dupliqué depuis `AppTest_template` (ne pas lancer sur le template).
- [ ] `00_Inputs/Projet_CahierDesCharges.md` présent.
- [ ] `00_Inputs/Projet_Roadmap.md` présent.
- [ ] Critères d’acceptation binaires présents.
- [ ] Définition bug bloquant vs mineur présente.
- [ ] 3 scénarios critiques présents.
- [ ] `02_Execution/state.md` initialisé à `READY`.
- [ ] Budget modèle OK avant lancement (`Usage 5h >= 20%`, `Week >= 20%`).
- [ ] Repo GitHub privé : géré par LiaOrchestrator avant passe 1.
- [ ] Si repo absent : LiaOrchestrator crée le repo GitHub + commit initial + push + branche `work/<NomProjet>`.
- [ ] Si repo existant : accès OK, branche `work/<NomProjet>` checkout, droits push validés.
- [ ] CI PR configurée (minimum standard : build + lint + tests essentiels).

## Lancer
Message au Main (copier/coller) :
`Lance le processus de production sur "/CHEMIN/DU/PROJET" en suivant "01_Process/1_ProcessAutomation.md". Commence par le check pré-lancement, puis passe 1.`

## Pendant exécution (à chaque passe)
- [ ] `02_Execution/log.md` mis à jour (Objectif/Résultat/Blocage/Next step + infos commit/PR).
- [ ] `03_Quality/acceptance-checklist.md` mis à jour.
- [ ] `03_Quality/bugs.md` mis à jour.
- [ ] `02_Execution/state.md` mis à jour.
- [ ] Commit nommé `PASS-XX: ...`.
- [ ] PR nommée `PASS-XX - ...`, puis merge dès validation.

## Arrêts / pauses
- Specs incomplètes → `PAUSED_SPEC` + questions ciblées.
- Échec après 2 auto-fix → `PAUSED_ESCALADE` + validation utilisateur obligatoire.
- Budget atteint (`Usage 5h < 20%` ou `Week < 20%`) → `PAUSED_BUDGET` + notification.
- 8 passes atteintes → `STOP_MAX_PASSES` + rapport d’écart.

## Notifications utilisateur
- Canal : Telegram.
- Format jalon : message très court (3–4 lignes).
- Ajouter une alerte immédiate si blocage dur.
- Respecter les horaires autorisés (quiet hours).
- Hors horaires : notifier uniquement si urgence critique.

## Réponse rapide si l’utilisateur demande "on en est où ?"
- Ligne 1 : `On en est à peu près à XX % du développement.`
- Ligne 2 : `Pas de problème rencontré.` ou `Pas de problème que l’on ne puisse gérer.`
- Ligne 3 : `Prochaine étape : ...`

## Format d’escalade utilisateur (obligatoire)
- Problème : 1 à 3 lignes, simple et concret.
- Option A : 1 à 3 lignes + Pour + Contre + Préconisation.
- Option B : 1 à 3 lignes + Pour + Contre + Préconisation.
- Décision attendue : une phrase claire.

## Fin
- [ ] Zéro bug bloquant.
- [ ] Critères d’acceptation validés.
- [ ] Bugs mineurs restants listés pour lot suivant (si présents).
- [ ] Mini récap final 5 lignes envoyé + demande Go/No-Go.
- [ ] Statut final `DONE` dans `state.md`.
