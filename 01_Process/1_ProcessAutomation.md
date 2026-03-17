# Process d’automation — Toute application (V4 alignée template + Git)

## 1) Objectif
Construire une application finale via boucle multi-agents avec 3 rôles :
**LiaOrchestrator → LiaDev → LiaTest → LiaOrchestrator**
jusqu’à atteinte des critères qualité, avec arrêt sécurisé et traçabilité Git.

---

## 2) Structure dossier de référence (source de vérité)
Ce process s’exécute dans un dossier projet basé sur `AppTest_template`.

- `00_Inputs/Projet_CahierDesCharges.md` → CDC (source de vérité produit)
- `00_Inputs/Projet_Roadmap.md` → roadmap (source de vérité planning)
- `01_Process/1_ProcessAutomation.md` → version locale du process (source de vérité méthode)
- `02_Execution/state.md` → état courant de pilotage
- `02_Execution/log.md` → journal des passes
- `03_Quality/acceptance-checklist.md` → suivi des critères binaires
- `03_Quality/bugs.md` → suivi bugs bloquants/mineurs

Règle : en cas de conflit, la vérité opérationnelle est dans ces fichiers du dossier projet.

---

## 3) Rôles

### LiaOrchestrator
- Lit le CDC + roadmap dans `00_Inputs/`.
- Vérifie que les critères d’acceptation sont définis.
- Lance les passes, applique les règles d’arrêt, décide escalade/pause.
- Gouverne Git (branche, PR, merge, tag).
- Met à jour `02_Execution/state.md` et `02_Execution/log.md`.

### LiaDev
- Implémente la fonctionnalité prioritaire du tour.
- Corrige les bugs détectés.
- Produit les commits de développement de la passe.

### LiaTest
- Exécute le socle de tests léger.
- Vérifie les critères d’acceptation.
- Classe les bugs : **bloquant** / **mineur**.
- Met à jour `03_Quality/acceptance-checklist.md` et `03_Quality/bugs.md`.

---

## 4) Règles Git (obligatoires)
1. Hébergement cible : **GitHub** (utiliser le compte GitHub déjà configuré et autorisé).
2. Confidentialité par défaut : **repo privé**.
3. 1 repo Git par application.
4. Responsable Git : **LiaOrchestrator**.
5. Moment de création/vérification du repo : **pendant le check pré-lancement, avant la passe 1**.
6. Si le repo n’existe pas : LiaOrchestrator le crée sur GitHub, initialise, pousse le commit initial, puis crée `work/<NomProjet>`.
7. Si le repo existe : LiaOrchestrator vérifie accès, droits push, et branche `work/<NomProjet>`.
8. Branches minimales :
   - `main` (stable)
   - `work/<NomProjet>` (branche de production automatisée)
9. Commit à chaque passe (minimum 1 commit/passe).
10. PR obligatoire à chaque passe (1 PR par passe).
11. Merge policy : **merge dès que la PR de passe est validée** (CI verte + validation manuelle utilisateur quand requise).
12. CI minimum standard obligatoire sur PR : build + lint + tests essentiels.
13. Tag final recommandé après validation (ex: `v1.0-pass-ok`).
14. Ne jamais réécrire l’historique partagé (`main` et branche de travail).

---

## 5) Check pré-lancement (obligatoire)
Avant la passe 1, valider :
1. `00_Inputs/Projet_CahierDesCharges.md` présent et complet.
2. `00_Inputs/Projet_Roadmap.md` présent et exploitable.
3. Critères d’acceptation binaires présents (8 à 12 recommandés).
4. Définition écrite bug bloquant vs mineur.
5. 3 scénarios critiques de validation définis.
6. `02_Execution/state.md` initialisé à `Statut : READY` et `Passe en cours : 0/8`.
7. `02_Execution/log.md`, `03_Quality/acceptance-checklist.md`, `03_Quality/bugs.md` prêts.
8. Repo Git accessible + branche de travail active + droits push OK.
9. Repo inexistant : création par LiaOrchestrator avant passe 1.
10. Budget modèle OK :
   - `Usage 5h >= 20% left`
   - `Week >= 20% left`

Si un point manque : pause immédiate et clarification utilisateur.

---

## 6) Boucle d’exécution (1 passe)
0. **Orchestrator** vérifie le budget modèle (5h/Week) avant de lancer la passe.
   - Si `Usage 5h < 20% left` ou `Week < 20% left` → `PAUSED_BUDGET` + notification.
1. **Orchestrator** choisit la fonctionnalité prioritaire du tour.
2. **Dev** implémente/ajuste.
3. **Test** lance les vérifications minimales (adaptées au projet) :
   - Build/compilation OK (si applicable)
   - Lint/qualité statique OK (si applicable)
   - Tests unitaires essentiels OK
   - 3 scénarios critiques d’usage (UI ou API) OK
4. **Orchestrator** prend décision :
   - Si OK → commit de passe + passe suivante ou fin.
   - Si KO corrigeable → auto-fix.
   - Si specs insuffisantes → pause + demande clarification utilisateur.
5. **Mise à jour fichiers** :
   - `02_Execution/state.md` (statut + numéro de passe + infos Git)
   - `02_Execution/log.md` (résumé de passe + commit)
   - `03_Quality/acceptance-checklist.md` (critères)
   - `03_Quality/bugs.md` (liste bugs)

---

## 7) Règles de qualité (Definition of Done)
Pour déclarer une fonctionnalité “Done” :
- Vérifications techniques minimales OK (selon nature du projet)
- Tests essentiels OK
- Critères d’acceptation OK
- **Zéro bug bloquant**
- Bugs mineurs tolérés **uniquement s’ils sont listés**

Règle de livraison :
- Livraison autorisée si **zéro bug bloquant**.
- Bugs mineurs autorisés si listés et planifiés pour le lot suivant.

Pour déclarer le projet `DONE` :
- PR validée (CI verte) et fusionnée
- Validation manuelle utilisateur effectuée avant fusion finale
- Branche stable à jour
- Tag final posé (recommandé)

---

## 8) Règles d’auto-fix et d’escalade
- Auto-fix autorisé jusqu’à **N = 2** tentatives par problème.
- Si échec après 2 tentatives :
  - **Blocage total**
  - Escalade vers utilisateur
  - Reprise uniquement après validation explicite.

---

## 9) Limites globales de sécurité
- **Maximum 8 passes** sur le cycle complet.
- Si 8 passes atteintes sans conformité complète :
  - arrêt automatique,
  - rapport d’écart,
  - pause obligatoire,
  - lot 2 uniquement après accord explicite utilisateur.

## 9.1 Politique de sollicitation minimale (anti-bottleneck)
- Silence par défaut pendant exécution normale.
- Solliciter l’utilisateur uniquement si :
  1) specs incomplètes/bloquantes,
  2) échec après 2 auto-fix,
  3) validation finale avant fusion PR de livraison.

Format obligatoire quand on sollicite l’utilisateur (français courant, néophyte) :
1. Problème : 1 à 3 lignes, clair, sans jargon.
2. Option A : 1 à 3 lignes + Pour + Contre + Préconisation.
3. Option B : 1 à 3 lignes + Pour + Contre + Préconisation.
4. Décision attendue : une phrase simple (ex: « Choisis Option A ou B »).

## 9.2 Canal de notification utilisateur
- Canal prioritaire : **Telegram**.
- Format jalon : **message très court (3–4 lignes)**.
- Déclencheurs :
  - synthèse à chaque jalon,
  - alerte immédiate en cas de blocage dur.
- Respect strict des horaires autorisés (quiet hours) définis dans les règles utilisateur.
- En dehors des horaires autorisés : ne pas notifier, sauf urgence critique (sécurité, risque de perte de données, échéance critique).

---

## 10) Gestion des specs incomplètes
Si un critère d’acceptation manque ou est ambigu :
- pause immédiate,
- question de clarification utilisateur,
- aucune poursuite “au hasard”.

---

## 11) Convention de nommage (obligatoire)
- Commit : `PASS-XX: <résumé court>`
- PR : `PASS-XX - <résumé court>`
- XX = numéro de passe sur 2 chiffres (01, 02, ...)

## 12) Format de reporting (obligatoire à chaque passe)
Dans `02_Execution/log.md`, ajouter une section horodatée avec :

## 12.1 Format de validation finale utilisateur (obligatoire)
- Envoyer un mini récap standard en **5 lignes** :
  1) périmètre livré,
  2) statut CI,
  3) bugs bloquants (doit être 0),
  4) bugs mineurs restants,
  5) recommandation.
- Puis demander explicitement : **Go/No-Go**.

## 12.2 Format réponse statut "on en est où ?" (obligatoire)
Réponse courte en 3 lignes :
1) `On en est à peu près à XX % du développement.`
2) `Pas de problème rencontré.` ou `Pas de problème que l’on ne puisse gérer.`
3) `Prochaine étape : ...` (1 ligne max).

- **Objectif :** …
- **Résultat :** …
- **Blocage :** …
- **Next step :** …
- **Commit SHA :** …
- **Message commit :** …
- **Lien PR :** … (si existant)

---

## 12) Notes d’adaptation selon type d’application
- **App web/UI** : privilégier scénarios E2E orientés parcours utilisateur.
- **API/backend** : privilégier tests d’intégration, contrats d’API, cas d’erreur.
- **Mobile** : ajouter validations d’écran, navigation, états offline/online (si pertinent).
- **CLI/outils internes** : valider commandes, sorties attendues, gestion des erreurs.

Le cadre reste le même ; seuls les tests concrets changent selon le produit.
