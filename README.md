# Salarishuis – Low Code Enterprise Solutions

Een interactieve webapplicatie die marktconforme salarisbandbreedtes presenteert voor een Nederlandse dienstverleningsorganisatie (~120 medewerkers) gericht op low-code enterprise oplossingen.

## Functies

De applicatie bevat salarisbanden voor de volgende rollen:

| Rol | Track | Bruto jaarsalaris (P25 – P75) |
|-----|-------|-------------------------------|
| Support Consultant | Support | € 33.000 – € 47.000 |
| Experienced Support Consultant | Support | € 42.000 – € 59.000 |
| Senior Support Consultant | Support | € 52.000 – € 71.000 |
| Consultant | Consulting | € 46.000 – € 65.000 |
| Experienced Consultant | Consulting | € 59.000 – € 80.000 |
| Senior Consultant | Consulting | € 72.000 – € 96.000 |
| Solution Architect | Architectuur | € 89.000 – € 123.000 |

Bedragen zijn bruto jaarsalaris in euro's, exclusief 8% vakantiegeld.

## Gebruik

1. Open `index.html` in een webbrowser (geen server nodig).
2. Klik op **Start de berekening** om de wizard te starten.
3. Beantwoord de vragen over uw rol, opleiding, certificeringen, platform-expertise en prestatieprofiel.
4. Bekijk uw gepersonaliseerde salarisbandbreedte en uw positie daarbinnen.
5. Gebruik **Alle rollen bekijken** voor een volledig overzicht van alle functies.

## Methodologie

De salarisbanden zijn gebaseerd op:
- CBS (Centraal Bureau voor de Statistiek) loondata Nederland 2023–2026
- Glassdoor / Indeed NL salary surveys voor IT-consultingfuncties 2024–2026
- Indeed NL vacaturedata voor Mendix / Low Code rollen (2025–2026): gestelde salarisranges en ervaringseisen in gepubliceerde vacatures
- Bedrijfswebsites met actieve Mendix-praktijken (2025–2026):
  - Blue Green Solutions (Mendix Expert Partner)
  - PostNL (intern Mendix Center of Excellence – gepubliceerde vacatures)
  - Eneco (Mendix platform team – gepubliceerde vacatures)
  - Capgemini NL (Low Code / Mendix practice)
  - Sogeti NL (Mendix competence center)
- Intermediair / Technisch Weekblad salariswijzer 2025
- Computable / Giarte ICT salarisbenchmark 2025
- Marktpositie: mid-market Nederlandse dienstverleningsorganisatie, ~120 fte
- Sectorpremie voor low-code / enterprise platform specialisten (+8–12%)
- NL IT-sector loonstijging 2024→2025: ~4–5%; 2025→2026 (prognose): ~3–4%

De bandbreedte loopt van P25 (instap, 25e percentiel) via P50 (marktreferentie) naar P75 (bovenkant, 75e percentiel).

## Bestanden

```
index.html   – Hoofdpagina (geen build-stap nodig)
style.css    – Opmaak
app.js       – Applicatielogica en navigatie
data.js      – Salarisdata, rollen en aanpassingsfactoren
version.js   – Centrale versierconstante voor cache-busting
```

## Versie-beheer / cache-busting

Statische assets (stylesheet, databestand en applicatielogica) worden altijd met een versie-querystring ingeladen (`?v=<APP_VERSION>`). Hierdoor laden browsers bij een nieuwe release automatisch de nieuwste bestanden in plaats van een gecachede versie.

Om de cache te busten bij een nieuwe release: verhoog `APP_VERSION` in `version.js`.

