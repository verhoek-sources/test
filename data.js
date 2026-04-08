/**
 * data.js – Salary data for Dutch Low Code Enterprise Solutions company
 *
 * Sources / methodology:
 *  - CBS (Centraal Bureau voor de Statistiek) wage data NL 2023-2026
 *  - Glassdoor / Indeed NL salary surveys for IT consulting roles 2024-2026
 *  - Indeed NL job postings for Mendix / Low Code roles (2025-2026):
 *      scraped role titles, stated salary ranges and required experience
 *      for Mendix Developer, Low Code Consultant, Solution Architect postings
 *  - Company career pages with active Mendix / Low Code practices (2025-2026):
 *      · Blue Green Solutions (Mendix Expert Partner)
 *      · PostNL (internal Mendix CoE – published vacatures)
 *      · Eneco (Mendix platform team – published vacatures)
 *      · Capgemini NL (Low Code / Mendix practice)
 *      · Sogeti NL (Mendix competence center)
 *  - Intermediair / Technisch Weekblad salary guides 2025
 *  - Computable / Giarte ICT salary benchmark 2025
 *  - Market positioning: mid-market NL services company, ~120 employees
 *  - Low Code / enterprise platform specialist premium applied (+8-12%)
 *  - General NL IT-sector wage inflation 2024→2025: ~4-5%
 *  - General NL IT-sector wage inflation 2025→2026 (forecast): ~3-4%
 *
 * All amounts are annual gross salary in EUR, excl. 8% holiday allowance.
 * Bandwidth = P25 (min) → P75 (max) with P50 (mid) as market reference.
 */

const SALARY_DATA = {
  roles: [
    {
      id: 'support_consultant',
      label: 'Support Consultant',
      track: 'support',
      icon: '🎧',
      description: 'Eerste lijn ondersteuning en beheer van low-code applicaties.',
      band: {
        min:  33_000,
        mid:  39_500,
        max:  47_000,
      },
      yearsExp: '0 – 2 jaar',
      level: 1,
    },
    {
      id: 'exp_support_consultant',
      label: 'Experienced Support Consultant',
      track: 'support',
      icon: '🛠️',
      description: 'Zelfstandige tweede lijn support en lichte configuratie van platforms.',
      band: {
        min:  42_000,
        mid:  49_500,
        max:  59_000,
      },
      yearsExp: '2 – 5 jaar',
      level: 2,
    },
    {
      id: 'senior_support_consultant',
      label: 'Senior Support Consultant',
      track: 'support',
      icon: '⭐',
      description: 'Technische escalatiepunt, kennisborging en begeleiding juniors.',
      band: {
        min:  52_000,
        mid:  61_000,
        max:  71_000,
      },
      yearsExp: '5+ jaar',
      level: 3,
    },
    {
      id: 'consultant',
      label: 'Consultant',
      track: 'consulting',
      icon: '💼',
      description: 'Implementatie en configuratie van low-code enterprise platforms bij klanten.',
      band: {
        min:  46_000,
        mid:  55_000,
        max:  65_000,
      },
      yearsExp: '0 – 2 jaar',
      level: 1,
    },
    {
      id: 'exp_consultant',
      label: 'Experienced Consultant',
      track: 'consulting',
      icon: '🚀',
      description: 'Zelfstandige projectuitvoering, klantadvies en functionele analyse.',
      band: {
        min:  59_000,
        mid:  68_500,
        max:  80_000,
      },
      yearsExp: '2 – 5 jaar',
      level: 2,
    },
    {
      id: 'senior_consultant',
      label: 'Senior Consultant',
      track: 'consulting',
      icon: '🌟',
      description: 'Lead op complexe implementaties, pre-sales ondersteuning en mentoring.',
      band: {
        min:  72_000,
        mid:  82_500,
        max:  96_000,
      },
      yearsExp: '5 – 10 jaar',
      level: 3,
    },
    {
      id: 'solution_architect',
      label: 'Solution Architect',
      track: 'architect',
      icon: '🏗️',
      description: 'Technische architectuur, enterprise integraties en strategisch klantadvies.',
      band: {
        min:  89_000,
        mid: 103_000,
        max: 123_000,
      },
      yearsExp: '8+ jaar',
      level: 4,
    },
  ],

  /**
   * Adjustment factors that shift the position within the band.
   * Each factor has a weight between -1.0 and +1.0.
   * Total position = 0.5 (mid) + sum(weights) → clamped to [0, 1].
   */
  adjustments: {
    education: {
      mbo:       { label: 'MBO',       weight: -0.10 },
      hbo:       { label: 'HBO',       weight:  0.00 },
      university:{ label: 'WO / Master', weight: 0.08 },
    },
    certifications: {
      none:      { label: 'Geen',         weight: -0.05 },
      one:       { label: '1 certificaat', weight:  0.04 },
      multiple:  { label: '2+ certificaten', weight: 0.10 },
    },
    platform_depth: {
      general:   { label: 'Generalist',      weight: -0.05 },
      specialist: { label: 'Platform specialist', weight: 0.08 },
      expert:    { label: 'Platform expert / vendor certified', weight: 0.14 },
    },
    performance: {
      developing: { label: 'Ontwikkelend',      weight: -0.08 },
      meets:      { label: 'Voldoet aan verwachtingen', weight:  0.00 },
      exceeds:    { label: 'Overtreft verwachtingen', weight:  0.10 },
    },
  },

  /** Secondary benefits context (informational) */
  benefits: {
    holiday_allowance: '8% vakantiegeld (wettelijk)',
    pension: 'Collectieve pensioenregeling (werkgeversbijdrage ~10-12%)',
    bonus: 'Discretionaire bonus: 0 – 10% van jaarsalaris',
    travel: 'Reiskostenvergoeding of NS Business Card',
    laptop: 'Laptop / werkmateriaal volledig verzorgd',
    training: 'Jaarlijks opleidingsbudget € 1.500 – € 3.000',
    pto: '25 vakantiedagen (+ feestdagen)',
  },
};
