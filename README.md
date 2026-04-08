# Salarishuis – Low Code Enterprise Solutions

Een interactieve webapplicatie die marktconforme salarisbandbreedtes presenteert voor een Nederlandse dienstverleningsorganisatie (~120 medewerkers) gericht op low-code enterprise oplossingen.

## Functies

De applicatie bevat salarisbanden voor de volgende rollen:

| Rol | Track | Bruto jaarsalaris (P25 – P75) |
|-----|-------|-------------------------------|
| Support Consultant | Support | € 32.000 – € 45.000 |
| Experienced Support Consultant | Support | € 40.000 – € 56.000 |
| Senior Support Consultant | Support | € 50.000 – € 68.000 |
| Consultant | Consulting | € 44.000 – € 62.000 |
| Experienced Consultant | Consulting | € 56.000 – € 76.000 |
| Senior Consultant | Consulting | € 68.000 – € 92.000 |
| Solution Architect | Architectuur | € 85.000 – € 118.000 |
| Team Lead | Management | € 70.000 – € 95.000 |

Bedragen zijn bruto jaarsalaris in euro's, exclusief 8% vakantiegeld.

## Gebruik

1. Open `index.html` in een webbrowser (geen server nodig).
2. Klik op **Start de berekening** om de wizard te starten.
3. Beantwoord de vragen over uw rol, opleiding, certificeringen, platform-expertise en prestatieprofiel.
4. Bekijk uw gepersonaliseerde salarisbandbreedte en uw positie daarbinnen.
5. Gebruik **Alle rollen bekijken** voor een volledig overzicht van alle functies.

## Methodologie

De salarisbanden zijn gebaseerd op:
- CBS (Centraal Bureau voor de Statistiek) loondata Nederland 2023–2024
- Glassdoor / Indeed NL salary surveys voor IT-consultingfuncties
- Intermediair / Technisch Weekblad salariswijzer 2024
- Marktpositie: mid-market Nederlandse dienstverleningsorganisatie, ~120 fte
- Sectorpremie voor low-code / enterprise platform specialisten (+8–12%)

De bandbreedte loopt van P25 (instap, 25e percentiel) via P50 (marktreferentie) naar P75 (bovenkant, 75e percentiel).

## Bestanden

```
index.html   – Hoofdpagina (geen build-stap nodig)
style.css    – Opmaak
app.js       – Applicatielogica en navigatie
data.js      – Salarisdata, rollen en aanpassingsfactoren
```
