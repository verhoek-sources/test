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
- CBS (Centraal Bureau voor de Statistiek) loondata Nederland 2025–2026
- Glassdoor / Indeed NL salary surveys voor IT-consultingfuncties 2025–2026
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

## Databevindingen & Benchmarkverificatie (april 2025)

### Verificatievragen

| Vraag | Bevinding |
|-------|-----------|
| Zijn de bedragen exclusief 8% vakantiegeld? | ✅ Ja – expliciet vermeld in `data.js` en in de rollentabel boven |
| Is de basis 40 uur per week? | ⚠️ Niet gedocumenteerd – nergens staat dit vermeld |
| Zijn de bronnen up-to-date (2025–2026)? | ✅ Ja – bronnen gaan uit van 2025-2026 loondata |

---

### Bevindingen per track

#### 1. Urengrondslag (ontbrekende documentatie)
De 40-uursbasis wordt nergens expliciet benoemd. Dit is relevant omdat veel Nederlandse IT-benchmarks (o.a. Glassdoor, CBS) werken met 36- of 38-uurs weken als basis. Bij vergelijking met een 36-uurs benchmark zou een 40-uursconversie de jaarsalarissen met ~11% verhogen. Omgekeerd: als concurrerende bedrijven publiceren op 36u-basis en onze tool op 40u, lijken onze bedragen structureel hoger.

#### 2. Consultingtrack – mediaan te hoog voor junior- en mediorprofielen

Recente marktdata (Werkzoeken.nl, Glassdoor NL, Indeed NL, april 2025) voor **alle** Mendix-consultantniveaus gezamenlijk:

| Bron | Gemiddeld bruto jaarsalaris (excl. vk.geld, ~40u) |
|------|--------------------------------------------------|
| Werkzoeken.nl | €46.620 min – €54.780 gem. – €63.000 max |
| Glassdoor NL | ~€54.000 gemiddeld |
| Indeed Amsterdam | ~€56.200 gemiddeld |
| Jooble NL (incl. senior) | ~€62.400 gemiddeld |

De P25 van de **Consultant (0–2 jaar)** in de huidige tool bedraagt €46.000. Dit is gelijk aan het markminimum voor *alle* Mendix-niveaus samen. Het P50 van €55.000 voor een juniorrol zit al op het marktgemiddelde voor alle niveaus. Dat is inconsistent: een instapniveau zou niet met zijn P50 op het marktgemiddelde voor alle ervaringsniveaus moeten zitten.

Concrete afwijkingen t.o.v. verwachte marktpositie:

| Rol | Huidig P50 | Verwacht P50 (markt) | Verschil |
|-----|-----------|----------------------|---------|
| Consultant (0–2 jr) | €55.000 | €44.000 – €50.000 | +~15% |
| Experienced Consultant (2–5 jr) | €68.500 | €56.000 – €63.000 | +~15% |
| Senior Consultant (5–10 jr) | €82.500 | €70.000 – €78.000 | +~11% |

#### 3. Supporttrack – vergelijkbare opwaartse vertekening

IT-applicatiebeheer/-support (servicedesk, 2e lijn) in Nederland kent lagere marktprijzen dan IT-consultancyrollen. Gangbare P25–P75 voor applicatiesupport (2025, excl. vk.geld, 40u):

| Niveau | Verwachte marktrange | Huidig in tool | Verschil |
|--------|---------------------|----------------|---------|
| Junior (0–2 jr) | €28.000 – €40.000 | €33.000 – €47.000 | +~15% |
| Medior (2–5 jr) | €36.000 – €50.000 | €42.000 – €59.000 | +~15% |
| Senior (5+ jr) | €46.000 – €62.000 | €52.000 – €71.000 | +~14% |

#### 4. Solution Architect – plafond aan de hoge kant

Voor een mid-market dienstverleningsorganisatie (~120 fte) geldt doorgaans een lager salarisplafond dan voor grote multinationals of Big 4. Het huidige maximum van €123.000 ligt boven het typische P75 voor een solution architect bij vergelijkbare bedrijven (markt P75 ≈ €105.000–€110.000).

#### 5. Mogelijke oorzaak: cumulatie van premies

De methodologie past een sectorpremie van **+8–12%** toe bovenop bronnen (Glassdoor, Indeed) die al een Mendix-specialismepremie verdisconteren. Dit leidt tot dubbeltelling:
- Glassdoor/Indeed salarissen zijn al hoger dan CBS omdat zij actieve vacatures tonen (bedrijven zoeken schaars talent → hogere lonen zichtbaar)
- Daar bovenop nogmaals 8–12% sectortoeslag opleggen overschat de markt structureel

---

### Aanbevelingen voor verbetering

1. **Documenteer de urengrondslag expliciet** – voeg "op basis van 40 uur per week" toe aan de rollentabel in dit README en aan `data.js` als commentaar.

2. **Heroverweeg de sectorpremie-methodiek** – pas de sectorpremie alleen toe op CBS-data, niet op Glassdoor/Indeed-data die de Mendix-markttoeslag al impliceert. Alternatief: gebruik één gewogen gemiddelde van alle bronnen zonder additionele sectoropslag.

3. **Bijgestelde P25–P75 salarisbanden (voorstel)**:

   | Rol | Huidig P25 – P75 | Voorgesteld P25 – P75 | Δ |
   |-----|-----------------|----------------------|---|
   | Support Consultant | €33.000 – €47.000 | €29.000 – €42.000 | −~12% |
   | Experienced Support Consultant | €42.000 – €59.000 | €37.000 – €52.000 | −~12% |
   | Senior Support Consultant | €52.000 – €71.000 | €46.000 – €63.000 | −~11% |
   | Consultant | €46.000 – €65.000 | €40.000 – €57.000 | −~13% |
   | Experienced Consultant | €59.000 – €80.000 | €52.000 – €70.000 | −~12% |
   | Senior Consultant | €72.000 – €96.000 | €64.000 – €85.000 | −~11% |
   | Solution Architect | €89.000 – €123.000 | €80.000 – €108.000 | −~12% |
   | Team Lead | €70.000 – €95.000 | €63.000 – €87.000 | −~8% |

4. **Voeg aanvullende benchmarkbron toe** – Intermediair Salariswijzer en/of Salarisgids.nl bieden specifiek voor IT-consultancy in Nederland gedetailleerde P25/P50/P75 opsplitsingen per ervaringsniveau. Dit verhoogt de nauwkeurigheid per functietrap.

5. **Jaarlijkse herziening** – documenteer wanneer de data voor het laatst is gevalideerd (bijv. `data.js` header: `Last validated: Q1 2025`). Plan een herbeoordeling bij elke nieuwe CAO-ronde of CBS-publicatie.

---

## Versie-beheer / cache-busting

Statische assets (stylesheet, databestand en applicatielogica) worden altijd met een versie-querystring ingeladen (`?v=<APP_VERSION>`). Hierdoor laden browsers bij een nieuwe release automatisch de nieuwste bestanden in plaats van een gecachede versie.

Om de cache te busten bij een nieuwe release: verhoog `APP_VERSION` in `version.js`.

