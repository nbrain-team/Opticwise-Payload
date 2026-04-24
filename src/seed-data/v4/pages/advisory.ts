export const advisoryPage = {
  title: 'Advisory Services',
  slug: 'advisory-services',
  audience: 'primary',
  excerpt: 'Independent, owner-aligned strategic counsel for CRE — without a vendor agenda.',
  layout: [
    {
      blockType: 'hero',
      eyebrow: 'Advisory Services',
      heading: 'Owner-Aligned Strategic Counsel — Without a Vendor Agenda',
      lede:
        'For CRE owners, operators, and asset managers who need an independent perspective on data, digital infrastructure, and AI readiness — without being sold a product.',
      reframeLine: "If you don't own your data & digital infrastructure, your vendors do.",
      style: 'dark',
    },
    {
      blockType: 'twoColumn',
      eyebrow: 'When Advisory Fits',
      heading: 'When Advisory Is the Right Call',
      subheading:
        "Not every owner needs a full data & digital infrastructure build. Sometimes what you need is a second set of eyes from someone who isn't selling you the next dashboard.",
      authorityNote:
        "Advisory is the right call when you are: evaluating a vendor proposal and want independent review; inheriting a portfolio and trying to figure out what you actually own; being asked to approve a technology CapEx and don't know what questions to ask; weighing build vs. buy vs. partner; or trying to quantify AI readiness without getting sold an AI product.",
      style: 'nearwhite',
    },
    {
      blockType: 'cardGrid',
      eyebrow: 'Advisory Engagements',
      heading: 'Four Ways We Work',
      columns: '2',
      style: 'dark',
      cards: [
        {
          title: 'Data & Digital Infrastructure Strategy',
          description:
            'A roadmap for building an owner-controlled standard across your portfolio. Phased to turnover, CapEx timing, and lease-up — so nothing is rip-and-replace.',
        },
        {
          title: 'Vendor & Contract Evaluation',
          description:
            'Independent review of vendor proposals, MSAs, service contracts, and renewal terms. We flag lock-in language, data-portability gaps, admin-credential traps, and hidden operational cost.',
        },
        {
          title: 'AI Readiness Assessment',
          description:
            'An honest look at whether your portfolio can actually run AI safely. Data governance, identity and access, system-of-record trust, decisioning readiness. We tell you why, and what to fix first.',
        },
        {
          title: 'Peak Property Performance® Review',
          description:
            'The full PPP Review, mapped to the Clarify step of the PPP 5C™ plan. See the PPP Audit™ page for detail.',
          href: '/ppp-audit',
        },
      ],
    },
    {
      blockType: 'avoidFailure',
      eyebrow: 'The Cost of Skipping It',
      heading: 'Patterns We See Every Week',
      lede: "Advisory isn't optional insurance. It's how you avoid these patterns.",
      consequences: [
        { text: 'Redundant Systems Tax — multiple systems or networks doing the same job, paid twice in CapEx and OpEx' },
        { text: '"Never Turned On" Shelfware — systems installed, software billed, never operationalized after a PM change' },
        { text: 'Governance Debt — duplicate or rogue networks that don\'t surface as problems until they fail, years later' },
      ],
      punchLine: 'Governance debt comes due with interest.',
    },
    {
      blockType: 'callToAction',
      eyebrow: 'Your Next Step',
      heading: 'Not Sure What You Need?',
      subheading:
        "That's what the complimentary review is for. One building. One working session. Clear deliverables.",
      buttonLabel: 'Schedule Your Review',
      style: 'blue',
    },
  ],
}
