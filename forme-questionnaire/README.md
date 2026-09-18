# Questionnaire client — 63 Agency

Frontend Next.js pour le formulaire de satisfaction client de **63 Agency**.

Le design reprend le site [63agency.com](https://63agency.com) : fond noir, grain, boutons blancs arrondis, parcours en plusieurs étapes.

## Lancer le projet

```bash
cd forme-questionnaire
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Pages

| URL | Rôle |
| --- | --- |
| `/` | Questionnaire client (Darija + FR) |
| `/merci` | Page de confirmation |
| `/reponses` | Vue interne des réponses |

Les réponses sont enregistrées dans `data/responses.json`.

## Parcours du formulaire

1. **الهوية** — nom, entreprise, service
2. **التجربة** — note 1–10, points forts, axes d’amélioration, communication
3. **النتائج** — valeur perçue, résultat clé, attentes, un changement
4. **التوصية** — NPS 0–10, témoignage, case study
5. **المستقبل** — referral (optionnel), nouvelle collaboration, besoin actuel

Le brouillon est sauvegardé dans le navigateur (`localStorage`) tant que le formulaire n’est pas envoyé.
