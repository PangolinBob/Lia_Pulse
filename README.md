# AppTest_template — Mode d’emploi rapide

Objectif : dupliquer ce dossier pour lancer une production automatisée d’une nouvelle application.

## Ordre d’utilisation (simple)
1. Dupliquer le dossier et renommer avec le nom du projet.
2. Mettre le CDC et la roadmap dans `00_Inputs/`.
3. Vérifier que `01_Process/1_ProcessAutomation.md` est bien la version voulue.
4. Initialiser `02_Execution/state.md` (Passe=0, Statut=READY).
5. Lancer l’orchestration.
   - Message prêt à copier/coller au Main :
   `Lance le processus de production sur "/CHEMIN/DU/PROJET" en suivant "01_Process/1_ProcessAutomation.md". Commence par le check pré-lancement, puis passe 1.`
   - Exemple réel :
   `Lance le processus de production sur "/Users/OpenClaw/.openclaw/workspace/MonJeu_v1" en suivant "01_Process/1_ProcessAutomation.md". Commence par le check pré-lancement, puis passe 1.`
6. À chaque passe : mettre à jour `02_Execution/log.md`, `03_Quality/acceptance-checklist.md`, `03_Quality/bugs.md` et `02_Execution/state.md`.
7. En cas de pause/reprise : appliquer `05_Protocole_Reprise.md`.
8. En cas de question à l’utilisateur : utiliser `06_Template_Message_Escalade.md`.

## Priorisation des blocs/features
- Règle unique : **Must > Should > Could** (toujours dans cet ordre, sauf validation explicite utilisateur).

## Git (mode d’emploi rapide)
1. Héberger sur GitHub (utiliser le compte GitHub déjà configuré, repo privé par défaut).
2. Initialiser ou cloner le repo de l’app.
3. Créer la branche de travail : `work/<NomProjet>`.
4. Vérifier les droits push avant lancement.
5. Faire au moins 1 commit par passe (format : `PASS-XX: ...`).
6. Ouvrir 1 PR à chaque passe (format : `PASS-XX - ...`).
7. CI minimum standard obligatoire sur PR : build + lint + tests essentiels.
8. Merge dès que la PR de passe est validée.

## Règles minimales
- Arrêt si specs incomplètes.
- Auto-fix max : 2 tentatives.
- Escalade utilisateur si non résolu.
- Max 8 passes globales.
- Ne pas réécrire l’historique Git partagé.
- Sollicitation minimale : ping utilisateur seulement sur blocage dur, seuil budget atteint, ou validation finale.
- Canal de notification : Telegram, avec respect des horaires autorisés (hors horaires : urgence critique uniquement).
- Notification : synthèse par jalon (format très court 3–4 lignes) + alerte immédiate en cas de blocage dur ou pause budget.
- Réponse "on en est où ?" : 3 lignes (avancement %, état problème, prochaine étape).
- Budget : suspendre si `Usage 5h < 20%` ou `Week < 20%`.
- Livraison : possible avec bugs mineurs listés, interdite si bug bloquant.

## Convention de nommage recommandée
- `Projet_CahierDesCharges.md`
- `Projet_Roadmap.md`
