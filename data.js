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
      description: 'First-line support and management of low-code applications.',
      band: {
        min:  33_000,
        mid:  39_500,
        max:  47_000,
      },
      yearsExp: '0 – 2 years',
      level: 1,
    },
    {
      id: 'exp_support_consultant',
      label: 'Experienced Support Consultant',
      track: 'support',
      icon: '🛠️',
      description: 'Independent second-line support and light configuration of platforms.',
      band: {
        min:  42_000,
        mid:  49_500,
        max:  59_000,
      },
      yearsExp: '2 – 5 years',
      level: 2,
    },
    {
      id: 'senior_support_consultant',
      label: 'Senior Support Consultant',
      track: 'support',
      icon: '⭐',
      description: 'Technical escalation point, knowledge retention and coaching of juniors.',
      band: {
        min:  52_000,
        mid:  61_000,
        max:  71_000,
      },
      yearsExp: '5+ years',
      level: 3,
    },
    {
      id: 'consultant',
      label: 'Consultant',
      track: 'consulting',
      icon: '💼',
      description: 'Implementation and configuration of low-code enterprise platforms at client sites.',
      band: {
        min:  46_000,
        mid:  55_000,
        max:  65_000,
      },
      yearsExp: '0 – 2 years',
      level: 1,
    },
    {
      id: 'exp_consultant',
      label: 'Experienced Consultant',
      track: 'consulting',
      icon: '🚀',
      description: 'Independent project delivery, client advisory and functional analysis.',
      band: {
        min:  59_000,
        mid:  68_500,
        max:  80_000,
      },
      yearsExp: '2 – 5 years',
      level: 2,
    },
    {
      id: 'senior_consultant',
      label: 'Senior Consultant',
      track: 'consulting',
      icon: '🌟',
      description: 'Lead on complex implementations, pre-sales support and mentoring.',
      band: {
        min:  72_000,
        mid:  82_500,
        max:  96_000,
      },
      yearsExp: '5 – 10 years',
      level: 3,
    },
    {
      id: 'solution_architect',
      label: 'Solution Architect',
      track: 'architect',
      icon: '🏗️',
      description: 'Technical architecture, enterprise integrations and strategic client advisory.',
      band: {
        min:  89_000,
        mid: 103_000,
        max: 123_000,
      },
      yearsExp: '8+ years',
      level: 4,
    },
    {
      id: 'team_lead',
      label: 'Team Lead',
      track: 'management',
      icon: '👥',
      description: 'Leading a team of consultants, coordinating projects and coaching team members.',
      band: {
        min:  70_000,
        mid:  82_000,
        max:  95_000,
      },
      yearsExp: '5+ years',
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
      none:      { label: 'None',                weight: -0.05 },
      one:       { label: '1 certification',     weight:  0.04 },
      two:       { label: '2 certifications',    weight:  0.10 },
      three:     { label: '3 certifications',    weight:  0.13 },
      four_plus: { label: '4+ certifications',   weight:  0.16 },
    },
    platform_depth: {
      general:   { label: 'Generalist',      weight: -0.05 },
      specialist: { label: 'Platform specialist', weight: 0.08 },
      expert:    { label: 'Platform expert / vendor certified', weight: 0.14 },
    },
    performance: {
      developing: { label: 'Developing',              weight: -0.08 },
      meets:      { label: 'Meets expectations',      weight:  0.00 },
      exceeds:    { label: 'Exceeds expectations',    weight:  0.10 },
    },
  },

  /**
   * Benchmark sources used to compile the salary bands.
   * Each source has adjustment factors (multipliers relative to the consensus band)
   * for min (P25), mid (P50) and max (P75).
   * The average of all six sources equals 1.00 per percentile, matching the base bands.
   */
  benchmarkSources: [
    {
      id: 'cbs',
      label: 'CBS – Centraal Bureau voor de Statistiek',
      icon: '🏛️',
      desc: 'Official wage statistics NL 2023–2026',
      factors: { min: 0.93, mid: 0.93, max: 0.93 },
    },
    {
      id: 'glassdoor_indeed',
      label: 'Glassdoor / Indeed NL surveys',
      icon: '🌐',
      desc: 'Salary surveys for IT consultancy roles 2024–2026',
      factors: { min: 1.04, mid: 1.07, max: 1.10 },
    },
    {
      id: 'indeed_postings',
      label: 'Indeed NL job postings',
      icon: '📋',
      desc: 'Mendix / Low Code vacancies with salary stated 2025–2026',
      factors: { min: 1.00, mid: 0.98, max: 0.95 },
    },
    {
      id: 'company_pages',
      label: "Company pages (Blue Green, PostNL, Eneco, Capgemini, Sogeti)",
      icon: '🏢',
      desc: 'Published vacancies from companies with Mendix practice 2025–2026',
      factors: { min: 1.01, mid: 1.02, max: 1.04 },
    },
    {
      id: 'intermediair',
      label: 'Intermediair / Technisch Weekblad salary guide',
      icon: '📰',
      desc: 'Industry salary guide 2025',
      factors: { min: 1.01, mid: 1.00, max: 0.99 },
    },
    {
      id: 'computable_giarte',
      label: 'Computable / Giarte ICT salary benchmark',
      icon: '💻',
      desc: 'ICT sector salary benchmark 2025',
      factors: { min: 1.01, mid: 1.00, max: 0.99 },
    },
  ],

  /** Secondary benefits context (informational) */
  benefits: {
    holiday_allowance: '8% holiday allowance (statutory)',
    pension: 'Collective pension scheme (employer contribution ~10-12%)',
    bonus: 'Discretionary bonus: 0 – 10% of annual salary',
    travel: 'Travel allowance or NS Business Card',
    laptop: 'Laptop / work equipment fully provided',
    training: 'Annual training budget € 1,500 – € 3,000',
    pto: '25 vacation days (+ public holidays)',
  },
};
