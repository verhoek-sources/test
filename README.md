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

## Berekeningsoverzicht

### Stap 1 – Bandbreedte per rol

Elke rol heeft een vaste salarisbandbreedte op basis van marktdata:

| Percentiel | Betekenis |
|------------|-----------|
| **P25 (min)** | Instapniveau – 25e percentiel van de markt |
| **P50 (mid)** | Marktreferentie – mediaan |
| **P75 (max)** | Bovenkant – 75e percentiel van de markt |

De bandbreedte kan worden verfijnd door één of meerdere benchmarkbronnen aan of uit te zetten. De gecorrigeerde bandbreedte wordt berekend als:

```
gecorrigeerde_waarde = basis_waarde × gemiddelde_factor(actieve_bronnen)
```

Elke benchmarkbron heeft afzonderlijke vermenigvuldigingsfactoren voor P25, P50 en P75.

---

### Stap 2 – Positie binnen de bandbreedte (0.0 – 1.0)

De positie binnen de bandbreedte geeft aan waar iemand precies uitkomt: `0.0` = P25 (minimum), `0.5` = P50 (midden), `1.0` = P75 (maximum).

De berekening start altijd op `0.5` (het marktmidden) en past dit aan op basis van vier factoren:

```
positie = 0.50 + gewicht_opleiding + gewicht_certificeringen + gewicht_platformdiepte + gewicht_prestatie
positie = max(0.0, min(1.0, positie))   ← afgekapt op [0.0, 1.0]
```

#### Factor 1 – Opleiding

| Opleidingsniveau | Gewicht |
|-----------------|---------|
| MBO | −0.10 |
| HBO | 0.00 |
| WO / Master | +0.08 |

#### Factor 2 – Certificeringen

| Aantal certificeringen | Gewicht |
|-----------------------|---------|
| Geen | −0.05 |
| 1 certificering | +0.04 |
| 2 certificeringen | +0.10 |
| 3 certificeringen | +0.13 |
| 4 of meer certificeringen | +0.16 |

#### Factor 3 – Platformdiepte

| Platformniveau | Gewicht |
|---------------|---------|
| Generalist | −0.05 |
| Platform specialist | +0.08 |
| Platform expert / vendor gecertificeerd | +0.14 |

#### Factor 4 – Prestatieprofiel

| Prestatieprofiel | Gewicht |
|-----------------|---------|
| Developing (in ontwikkeling) | −0.08 |
| Meets expectations (voldoet aan verwachtingen) | 0.00 |
| Exceeds expectations (overtreft verwachtingen) | +0.10 |

#### Reikwijdte van de positie

Door alle gewichten op te tellen zijn de uiterste posities:

| Scenario | Berekening | Positie |
|----------|-----------|---------|
| Laagst mogelijk | 0.50 − 0.10 − 0.05 − 0.05 − 0.08 | **0.22** |
| Standaard (alle neutraal) | 0.50 + 0.00 + 0.00 + 0.00 + 0.00 | **0.50** |
| Hoogst mogelijk | 0.50 + 0.08 + 0.16 + 0.14 + 0.10 | **0.98** |

---

### Stap 3 – Salarisberekening

Met de berekende positie en de (eventueel gecorrigeerde) bandbreedte wordt het bijbehorende bruto jaarsalaris als volgt bepaald:

```
salaris = band.min + (band.max − band.min) × positie
```

**Voorbeeld** (Consultant, alle standaard HBO / 2 certs / specialist / meets expectations):

```
positie    = 0.50 + 0.00 + 0.10 + 0.08 + 0.00 = 0.68
salaris    = €46.000 + (€65.000 − €46.000) × 0.68
           = €46.000 + €19.000 × 0.68
           = €46.000 + €12.920
           = €58.920 bruto per jaar
```

---

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

