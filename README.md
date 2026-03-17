# Lia Pulse

PWA mobile pour suivre une automation et traiter un blocage via choix d’option.

## Mode public + sécurité

- Le front ne contient aucun secret.
- Le PIN est vérifié côté serveur (bridge API).
- Sans session valide, aucune donnée de suivi ni action de déblocage.

## Endpoints attendus

- `POST /api/auth/pin`
- `GET /api/status`
- `POST /api/blocking/decision`

## Lancer en local (front)

```bash
npm run lint
npm test
npm run build
python3 -m http.server 8080
```

## Build

Le build statique est généré dans `dist/`.
