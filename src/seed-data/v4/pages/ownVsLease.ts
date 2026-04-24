export const ownVsLeasePage = {
  title: 'Own vs. Lease CRE Building Data',
  slug: 'own-vs-lease-cre-building-data',
  audience: 'primary',
  excerpt: "The economics of data ownership — and why most owners don't realize they're renting.",
  layout: [
    {
      blockType: 'hero',
      eyebrow: 'Own vs. Lease',
      heading: 'The Economics of CRE Data Ownership',
      lede:
        'Every building generates data. The question is simple: who owns it?',
      reframeLine: "If you don't own your data & digital infrastructure, your vendors do.",
      style: 'dark',
    },
    {
      blockType: 'twoColumn',
      eyebrow: 'The Reality',
      heading: "Most Owners Are Leasing Data and Don't Know It",
      subheading:
        'Every commercial property generates data: utilities, foot traffic, HVAC performance, access events, tenant service tickets, water flow, network activity.',
      authorityNote:
        'In most buildings, that data is collected by vendors, stored in vendor platforms, analyzed on vendor terms, and sold back to the owner as "insights." It looks like ownership. It costs like ownership. It isn\'t ownership. When the contract ends, the insights go with the vendor. The data often goes with them too.',
      style: 'nearwhite',
    },
    {
      blockType: 'avoidFailure',
      eyebrow: 'The Hidden Cost',
      heading: 'The Real Cost of Leased Data',
      lede: "Data leasing doesn't show up as a line item. It shows up as:",
      consequences: [
        { text: 'Vendor lock-in — every year, switching costs grow' },
        { text: "Renewals you can't walk away from — the data holds you, not the contract" },
        { text: '"Insights" you can\'t verify — no audit trail, no second-opinion analysis, no portability' },
        { text: 'Repeated integration costs — every new system integrates with the old vendor, not with you' },
        { text: "Portfolio intelligence that can't compound — each building starts over" },
      ],
      punchLine: 'Meanwhile, you\'re paying for the data & digital infrastructure the data rides on.',
    },
    {
      blockType: 'cardGrid',
      eyebrow: 'What Owned Data Looks Like',
      heading: 'Leased vs. Owned',
      columns: '2',
      style: 'dark',
      cards: [
        { title: 'Leased: Vendor platform', description: 'Owned: Owner-controlled data plane.' },
        { title: 'Leased: Vendor-proprietary format', description: 'Owned: Normalized, consistent model.' },
        { title: 'Leased: Export on vendor terms', description: 'Owned: Unlimited, documented, real-time.' },
        { title: 'Leased: Vendor-defined audit trail', description: 'Owned: End-to-end owner governance.' },
        { title: 'Leased: Lost when contract ends', description: 'Owned: Moves with the owner.' },
        { title: "Leased: Can't compound across portfolio", description: 'Owned: Every property makes every other smarter.' },
      ],
    },
    {
      blockType: 'pullQuote',
      eyebrow: 'The Switch Math',
      quote:
        'If you own your data & digital infrastructure, switching vendors is not that difficult.',
      attribution: 'OpticWise Quote Bank',
      style: 'dark',
    },
    {
      blockType: 'twoColumn',
      eyebrow: 'The Compounding Effect',
      heading: 'Why Ownership Compounds',
      subheading: 'Owned data does something leased data cannot: it compounds.',
      authorityNote:
        'Every building you add to an owner-controlled data model improves decisions across the portfolio. Utilities benchmarks get tighter. Failure patterns get clearer. CapEx planning gets smarter. Tenant-experience standards get comparable. Leased data does not compound — it fragments. Every vendor contract is its own island. That compounding effect is exactly what turns Property Intelligence into Portfolio Intelligence.',
      style: 'nearwhite',
    },
    {
      blockType: 'fivePlan',
      eyebrow: 'The Path',
      heading: 'From Leased to Owned in Five Steps',
      lede: 'Same five steps as every OpticWise engagement.',
      steps: [
        { letter: '01', title: 'Clarify', tag: 'PPP Audit™', description: 'Map every data source, every vendor, every contract. Know what you\'re leasing.' },
        { letter: '02', title: 'Connect', tag: 'BoT®', description: 'Owner-controlled connectivity that doesn\'t depend on any one vendor.' },
        { letter: '03', title: 'Collect', tag: 'Managed infrastructure', description: 'Ingest data into an owner-controlled, normalized model.' },
        { letter: '04', title: 'Coordinate', tag: 'Property Brain™', description: 'Govern who can access, use, and extend the data.' },
        { letter: '05', title: 'Control', tag: 'Portfolio Brain™', description: 'Plug in any analytics, AI, or vendor platform — and swap them without losing anything.' },
      ],
      punchLine: 'Owned data is the outcome.',
    },
    {
      blockType: 'callToAction',
      eyebrow: 'Your Next Step',
      heading: "Find Out What You Own — and What You're Leasing",
      subheading: 'Start with a complimentary PPP Audit™.',
      buttonLabel: 'Schedule Your Review',
      style: 'blue',
    },
  ],
}
