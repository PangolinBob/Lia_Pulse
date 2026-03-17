# Protocole de reprise après pause

## Cas 1 — Reprise après PAUSED_SPEC
1. Clarifier les points manquants avec l’utilisateur.
2. Mettre à jour `00_Inputs/Projet_CahierDesCharges.md` et/ou `00_Inputs/Projet_Roadmap.md`.
3. Relancer le check pré-lancement (`01_Process/1_ProcessAutomation.md`).
4. Passer `Statut : RUNNING` dans `02_Execution/state.md`.
5. Reprendre à la passe courante (pas de reset sauf décision explicite).

## Cas 2 — Reprise après PAUSED_ESCALADE
1. Obtenir validation explicite utilisateur (continuer / recadrer / stopper).
2. Si recadrage : mettre à jour les inputs (`00_Inputs/...`).
3. Journaliser la décision dans `02_Execution/log.md`.
4. Git :
   - si correction locale propre : nouveau commit de reprise,
   - si passe à annuler : revert (pas de reset/historique réécrit sur branche partagée).
5. Passer `Statut : RUNNING` dans `02_Execution/state.md`.
6. Reprendre à la passe courante avec stratégie validée.

## Cas 3 — Reprise après PAUSED_BUDGET
1. Attendre que le budget repasse au-dessus des seuils (`Usage 5h >= 20%` et `Week >= 20%`).
2. Obtenir validation explicite utilisateur pour reprise.
3. Journaliser la reprise dans `02_Execution/log.md`.
4. Passer `Statut : RUNNING` dans `02_Execution/state.md`.
5. Reprendre à la passe courante.

## Cas 4 — Reprise après STOP_MAX_PASSES
1. Produire un rapport d’écart (ce qui manque vs DoD).
2. Décider avec l’utilisateur :
   - nouveau lot (phase suivante), ou
   - réduction de scope.
3. Mettre à jour roadmap/CDC.
4. Git : ouvrir/mettre à jour PR de bilan si utile.
5. Redémarrer un nouveau cycle (compteur de passes remis à 0/8).
