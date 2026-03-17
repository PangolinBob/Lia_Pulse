# Cahier des charges — Pilotage Automation PWA (iPhone)

## 0) Fiche d’identité du projet
- **Nom du projet** : Pilotage Automation PWA
- **Version du document** : v1.0
- **Date** : 2026-03-17
- **Auteur** : Lia (avec validations Gaël)
- **Contexte en 3 lignes** :
  1. Gaël veut piloter une production automatisée d’apps sans rester devant son ordinateur.
  2. Le besoin prioritaire est un suivi mobile simple, lisible et sécurisé.
  3. La V1 doit être utile immédiatement, sans ajouter de vulnérabilité majeure.

---

## 1) Vision produit
### 1.1 Problème à résoudre
Aujourd’hui, le suivi de la production automatisée est surtout desktop et dispersé. Quand Gaël demande “on en est où ?”, l’information n’est pas centralisée dans une interface mobile dédiée. Il faut une vue instantanée, fiable, et actionnable sur iPhone.

### 1.2 Résultat attendu
En une phrase : **Cette app permet de suivre l’état d’un run de production automatisée depuis un iPhone, en 5 secondes, avec un niveau de sécurité prudent.**

Valeur apportée :
- Décision plus rapide
- Moins de friction de suivi
- Moins de dépendance au desktop
- Meilleure visibilité des blocages

### 1.3 Hors-scope V1
- Pas de pilotage multi-projets (1 seul projet affiché)
- Pas d’actions sensibles depuis la PWA (ex: relance run, modification config)
- Pas d’édition des workflows/process en direct
- Pas de gestion avancée utilisateurs/roles

---

## 2) Utilisateurs et rôles
### 2.1 Profil utilisateur principal
- **Nom du profil** : Propriétaire produit (Gaël)
- **Objectif principal** : savoir immédiatement où en est la prod et décider en cas de blocage
- **Niveau technique** : non-développeur
- **Fréquence d’usage** : plusieurs consultations courtes par jour

### 2.2 Permissions
- **Utilisateur principal** : lecture des statuts + consultation des détails de blocage + lecture des options de décision
- **Aucune action de modification sensible** en V1

---

## 3) Scénarios clés
### Scénario 1 — Check rapide “on en est où ?”
- **Déclencheur** : ouverture de la PWA
- **Étapes** :
  1) déverrouillage PIN
  2) vue “Rapide”
  3) lecture avancement + état + prochaine étape
- **Résultat attendu** : statut compris en moins de 5 secondes
- **Erreurs possibles** : données non rafraîchies
- **Comportement attendu** : bouton refresh visible + état de fraîcheur des données

### Scénario 2 — Détection blocage dur
- **Déclencheur** : un blocage dur existe
- **Étapes** :
  1) bannière persistante visible en haut
  2) clic “Voir le blocage”
  3) lecture fiche de décision
- **Résultat attendu** : compréhension simple du problème et des options
- **Erreurs possibles** : blocage non documenté
- **Comportement attendu** : message neutre indiquant info partielle + invitation à refresh

### Scénario 3 — Consultation détail historique
- **Déclencheur** : passage à l’onglet Détails
- **Étapes** :
  1) ouvrir onglet Détails
  2) consulter 5 dernières passes
  3) vérifier dernière activité et état qualité
- **Résultat attendu** : vision claire du progrès récent
- **Erreurs possibles** : historique incomplet
- **Comportement attendu** : afficher “données incomplètes” de façon explicite

---

## 4) Fonctionnalités V1 (MVP)
### 4.1 Liste des fonctionnalités
1. **Accès PIN (avec option afficher le PIN)**
   - Priorité : Must
   - Critère d’acceptation : l’utilisateur peut entrer son PIN et accéder à l’app; il peut afficher/masquer la saisie.

2. **Vue Rapide (4 blocs)**
   - Priorité : Must
   - Critère d’acceptation : la vue affiche avancement, état global, prochaine étape, alertes.

3. **Vue Détails (historique 5 passes)**
   - Priorité : Must
   - Critère d’acceptation : les 5 dernières passes sont lisibles avec info utile de suivi.

4. **Refresh manuel + auto-refresh discret (2 min)**
   - Priorité : Must
   - Critère d’acceptation : bouton refresh disponible et actualisation automatique toutes les 2 minutes.

5. **Bannière blocage persistante + fiche décision**
   - Priorité : Must
   - Critère d’acceptation : en cas de blocage, bannière visible en haut + accès à une fiche avec options A/B, pour/contre, préconisation.

6. **Thème clair/sombre manuel via Réglages**
   - Priorité : Should
   - Critère d’acceptation : l’utilisateur peut basculer manuellement de thème depuis Réglages.

### 4.2 Règles métier
- Règle 1 : 1 projet affiché en V1.
- Règle 2 : interface orientée lecture/monitoring, sans action sensible.
- Règle 3 : ton neutre et concis dans les messages statut.
- Règle 4 : format standard “on en est où ?” en 3 lignes.
- Règle 5 : si blocage dur, la bannière reste persistante.

---

## 5) Données
- **Données d’entrée** : état run, avancement estimé stable, statut blocage, dernière activité, prochaine étape, historique 5 passes, état CI.
- **Données de sortie** : affichage dashboard + fiche blocage décisionnelle.
- **Source des données** : système OpenClaw (via backend intermédiaire).
- **Fréquence de mise à jour** : auto 2 minutes + refresh manuel.
- **Durée de conservation souhaitée (V1)** : historique limité utile à l’UX (au moins 5 dernières passes visibles).
- **Données sensibles** : oui (infos d’état run, token côté serveur, accès app via PIN).

---

## 6) Contraintes et exigences non fonctionnelles
### 6.1 Sécurité / confidentialité
- Ne jamais exposer de token sensible côté client.
- Accès protégé par PIN.
- Démarrage en mode prudent : lecture seule.
- Objectif : ne pas créer de vulnérabilité supplémentaire significative.

### 6.2 Qualité attendue
- App stable en consultation mobile fréquente.
- Temps de compréhension état global : < 5 secondes.
- Messages simples, non techniques.

### 6.3 Contexte de livraison
- Priorité à une V1 utile immédiatement.
- Itérative : amélioration progressive après test réel.
- Contrainte forte : simplicité d’usage pour néophyte.

---

## 7) UX attendue
- Inspiration visuelle : **très proche de chat.html**.
- UI soignée, lisible, premium, mobile-first iPhone 13.
- Structure : **2 onglets**
  - Vue Rapide
  - Détails
- Vue Rapide contient 4 blocs :
  1) avancement (chiffre + mini barre)
  2) état global
  3) prochaine étape
  4) alertes
- Bannière blocage : visible en haut, persistante, actionnable (“Voir le blocage”).
- Ton texte : court mais explicite, neutre.

---

## 8) Definition of Done (DoD non technique)
1. L’app s’installe en mode PWA sur iPhone 13.
2. L’accès PIN fonctionne avec option afficher/masquer.
3. La Vue Rapide affiche 4 blocs lisibles.
4. Le pourcentage d’avancement est visible avec mini barre.
5. Le bouton refresh manuel fonctionne.
6. L’auto-refresh discret toutes les 2 min fonctionne.
7. L’onglet Détails affiche 5 dernières passes.
8. En cas de blocage dur, bannière persistante visible.
9. Le bouton “Voir le blocage” ouvre une fiche de décision claire.
10. La fiche de décision contient Options A/B + pour/contre + préconisation.
11. Le mode clair/sombre manuel fonctionne depuis Réglages.
12. Le texte “on en est où ?” est affichable en format court standard.

### 8.1 Règles de validation automation
- **Bug bloquant** : empêche la consultation du statut global, l’accès PIN, ou la lecture des alertes critiques.
- **Bug mineur** : défaut visuel ou confort sans blocage de suivi principal.
- **3 scénarios critiques à valider** :
  1) ouverture app + PIN + lecture statut global
  2) apparition blocage + bannière persistante + accès fiche décision
  3) refresh manuel + auto-refresh 2 min + mise à jour visible
- **Checklist minimale** :
  - Build/compilation (si applicable) : Oui
  - Lint/qualité statique (si applicable) : Oui
  - Tests essentiels : Oui
  - 3 scénarios critiques : Oui

---

## 9) Livrables attendus
- PWA V1 utilisable sur iPhone.
- Interface 2 onglets conforme UX validée.
- Icône PWA : utiliser `/Users/OpenClaw/.openclaw/mon-ui/favicon.ico`.
- Documentation courte d’usage (écran de suivi + lecture blocage).
- Journal de tests V1 sur scénarios critiques.

---

## 10) Risques, hypothèses, décisions ouvertes
### 10.1 Risques
- Risque : données de statut incomplètes/retardées
  - Impact : perception fausse de l’avancement
  - Prévention : refresh manuel + indicateur de fraîcheur

- Risque : surcharge visuelle mobile
  - Impact : lecture lente
  - Prévention : texte court, hiérarchie claire, 2 onglets

### 10.2 Hypothèses
- Les données nécessaires au dashboard sont disponibles côté OpenClaw/backend.
- Le mode lecture seule couvre le besoin V1.

### 10.3 Décisions ouvertes
- Niveau de détail futur de l’historique (au-delà de 5 passes)
- Évolution vers multi-projets
- Évolution vers actions non sensibles depuis mobile

---

## 11) Questions bloquantes restantes
Aucune bloquante pour démarrer la V1.
