# ROADMAP Pilotage Automation PWA — Suivi mobile simple, sûr et actionnable

**Créé** : 2026-03-17
**Basé sur** : PilotageAutomationPWA_CahierDesCharges.md
**Statut** : Phase 1 à démarrer

---

## Invariants non négociables
- L’app reste en mode **lecture seule** en V1 (aucune action sensible).
- Un blocage dur est toujours visible via une **bannière persistante**.
- Les informations clés sont compréhensibles en français courant par un néophyte.
- L’accès à l’app est protégé par PIN.
- Les données sensibles ne sont jamais exposées côté client.

---

## Phase 1 — MVP utilisable (cycle cible)

## Bloc 1 — Accès sécurisé + base visuelle

**Objectif** : Mettre en place l’accès PIN et la base UI mobile inspirée de chat.html.

**Dépendances** : Aucune

**Résultat attendu** : L’utilisateur accède à l’app avec PIN, et voit une interface mobile propre.

**Tests de validation** :
- L’utilisateur ouvre l’app → écran PIN apparaît.
- L’utilisateur saisit le bon PIN → accès autorisé.
- L’utilisateur active “Afficher le PIN” → le PIN devient visible puis peut être masqué.
- L’utilisateur saisit un PIN incorrect → message clair, sans plantage.

**Critères d’acceptation couverts** : DoD 1, 2

✓ Jalon : "Accès sécurisé fonctionnel et interface de base mobile prête"
✓ Verdict attendu : Pass/Fail

---

## Bloc 2 — Vue Rapide (4 blocs) + avancement visuel

**Objectif** : Livrer la vue principale ultra lisible avec infos essentielles.

**Dépendances** : Bloc 1

**Résultat attendu** : L’utilisateur voit en un coup d’œil avancement, état, prochaine étape, alertes.

**Tests de validation** :
- L’utilisateur ouvre la Vue Rapide → 4 blocs sont visibles.
- L’utilisateur lit l’avancement → chiffre + mini barre visibles.
- L’utilisateur lit l’état global → message neutre et explicite.
- L’utilisateur lit la prochaine étape → 1 ligne claire.

**Critères d’acceptation couverts** : DoD 3, 4, 12

✓ Jalon : "Vue Rapide complète et lisible en moins de 5 secondes"
✓ Verdict attendu : Pass/Fail

---

## Bloc 3 — Refresh manuel + auto-refresh discret

**Objectif** : Garantir une information à jour sans bruit visuel excessif.

**Dépendances** : Bloc 2

**Résultat attendu** : Les données se mettent à jour via bouton et automatiquement toutes les 2 minutes.

**Tests de validation** :
- L’utilisateur appuie sur Refresh → les données se mettent à jour.
- L’utilisateur n’appuie pas sur Refresh → mise à jour automatique discrète après 2 minutes.
- Si la mise à jour échoue → message neutre, app toujours utilisable.

**Critères d’acceptation couverts** : DoD 5, 6

✓ Jalon : "Mise à jour des données fiable (manuel + auto)"
✓ Verdict attendu : Pass/Fail

---

## Bloc 4 — Bannière blocage persistante + fiche décision

**Objectif** : Rendre un blocage dur immédiatement visible et compréhensible.

**Dépendances** : Bloc 2

**Résultat attendu** : En cas de blocage, bannière persistante affichée + fiche avec options A/B.

**Tests de validation** :
- Un blocage dur existe → bannière persistante visible en haut.
- L’utilisateur clique “Voir le blocage” → fiche s’ouvre.
- La fiche affiche Option A/Option B + pour/contre + préconisation.
- En absence de blocage → la bannière n’apparaît pas.

**Critères d’acceptation couverts** : DoD 8, 9, 10

✓ Jalon : "Gestion blocage claire et actionnable"
✓ Verdict attendu : Pass/Fail

---

## Bloc 5 — Onglet Détails + historique 5 passes

**Objectif** : Offrir une vue de contexte sans surcharger la Vue Rapide.

**Dépendances** : Bloc 2

**Résultat attendu** : L’onglet Détails affiche les 5 dernières passes de façon lisible.

**Tests de validation** :
- L’utilisateur ouvre Détails → historique visible.
- L’utilisateur lit les 5 dernières passes → informations claires.
- Si historique incomplet → message explicite “données incomplètes”.

**Critères d’acceptation couverts** : DoD 7

✓ Jalon : "Détails de progression consultables facilement"
✓ Verdict attendu : Pass/Fail

---

## Bloc 6 — Réglages thème + qualité de finition iPhone

**Objectif** : Finaliser l’expérience visuelle soignée avec thème manuel clair/sombre.

**Dépendances** : Blocs 1 à 5

**Résultat attendu** : Thème modifiable dans Réglages et rendu propre sur iPhone 13.

**Tests de validation** :
- L’utilisateur ouvre Réglages → option thème visible.
- L’utilisateur bascule clair/sombre → changement effectif.
- L’utilisateur revient aux écrans principaux → lisibilité maintenue.
- L’icône PWA correspond à `favicon.ico` fourni.

**Critères d’acceptation couverts** : DoD 11

✓ Jalon : "Finition UX soignée et cohérente sur iPhone"
✓ Verdict attendu : Pass/Fail

---

## Definition of Done

À la fin de Phase 1 :
1. App installable en PWA sur iPhone 13.
2. Accès PIN opérationnel avec option afficher/masquer.
3. Vue Rapide affiche 4 blocs clés.
4. Avancement visible avec chiffre + mini barre.
5. Refresh manuel opérationnel.
6. Auto-refresh discret toutes les 2 min opérationnel.
7. Onglet Détails affiche 5 dernières passes.
8. Bannière blocage persistante en cas de blocage dur.
9. Fiche blocage avec Option A/B + pour/contre + préconisation.
10. Mode clair/sombre manuel disponible en Réglages.
11. Ton des messages court, explicite, neutre.
12. V1 maintenue en lecture seule sans action sensible.

---

## Règle d’alignement avec l’automation
- Un cycle de production exécute au maximum 8 passes.
- La présente roadmap tient dans un cycle (6 blocs).
- Si extension future (V2+), planifier Lot 2, Lot 3, etc.
- Passage à un lot suivant après validation utilisateur.

---

## Historique

| Date | Bloc | Statut |
|------|------|--------|
| 2026-03-17 | Roadmap V1 créée | Done |
