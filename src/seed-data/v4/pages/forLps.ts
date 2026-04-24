export const forLpsPage = {
  title: 'For LPs & Financiers',
  slug: 'for-lps-and-financiers',
  audience: 'lps',
  excerpt: 'Governance, auditability, and portability — the due diligence view of OpticWise.',
  layout: [
    {
      blockType: 'hero',
      eyebrow: 'For LPs & Financiers',
      heading: 'Governance. Auditability. Portability.',
      lede:
        'For limited partners, general partners, lenders, and institutional capital allocating to CRE — the questions you should be asking about data & digital infrastructure before you fund.',
      reframeLine: "If the sponsor doesn't own the data & digital infrastructure, the vendors do.",
      audienceLine: 'A due-diligence frame for CRE capital allocators.',
      style: 'dark',
    },
    {
      blockType: 'twoColumn',
      eyebrow: 'The Due Diligence Question',
      heading: 'What Happens to the Data When the Deal Closes?',
      subheading:
        'You underwrote a building. You underwrote an NOI trajectory. But did you underwrite who owns the operational data that drives both — and what happens to it at refinance, at sale, at partner exit?',
      authorityNote:
        'Most CRE sponsors treat data & digital infrastructure as an operating expense. OpticWise treats it as an asset class inside the asset. The difference shows up at disposition.',
      style: 'nearwhite',
    },
    {
      blockType: 'cardGrid',
      eyebrow: 'What to Ask',
      heading: 'Six Questions for Your Next Deal Review',
      columns: '2',
      style: 'dark',
      cards: [
        { title: 'Who controls network admin credentials?', description: 'Sponsor, operator, PM, or vendor?' },
        { title: 'Is building data exportable on demand?', description: 'Real-time, full-fidelity, normalized?' },
        { title: 'Can vendors be swapped without data loss?', description: 'Without re-architecting the building?' },
        { title: 'Is there a documented data governance standard?', description: 'Or is it tribal knowledge held by one vendor?' },
        { title: 'What AI outputs are being generated', description: 'And who can audit them?' },
        { title: 'At refinance or disposition, what transfers?', description: 'Just the building — or the intelligence too?' },
      ],
      closingLine: 'If the sponsor can\'t answer these cleanly, you are underwriting vendor dependency — not an asset.',
    },
    {
      blockType: 'botCallout',
      layerLabel: 'Layer 1',
      eyebrow: 'The Foundation',
      heading: 'Owner-Controlled Data & Digital Infrastructure',
      botDescription:
        "Delivered through BoT® (Building of Things®). A single, secure, segmented foundation — owned by the sponsor, operable under governance, portable at exit.",
      pillars: [
        { title: 'Documented', description: 'Every system, every credential, every integration.' },
        { title: 'Audited', description: 'Governance events traceable end-to-end.' },
        { title: 'Portable', description: 'Survives vendor changes, sponsor changes, operator changes.' },
      ],
    },
    {
      blockType: 'brainBlock',
      layerLabel: 'Layer 2',
      eyebrow: 'The Intelligence',
      heading: 'Property Brain™ → Portfolio Brain™',
      tagline: 'Portable intelligence assets. Not rented software.',
      body: [
        { text: 'Property Brain™ is a governed data plane + trust plane. Every output is auditable. Every decision is permissioned.' },
        { text: 'Portfolio Brain™ is the compounding layer — intelligence that survives each building and improves the whole portfolio over time.' },
        { text: 'At refinance, at sale, at partner exit — the intelligence transfers with the asset.' },
      ],
      flowLine: 'Underwrite the intelligence, not just the building.',
    },
    {
      blockType: 'avoidFailure',
      eyebrow: 'Patterns That Destroy Basis',
      heading: 'Three Patterns LPs See at Exit',
      lede: 'Value you thought you had — that was never actually yours.',
      consequences: [
        { text: 'The vendor walks. The data goes with them. The new operator starts over.' },
        { text: 'The "insights" that justified the business plan can\'t be reproduced or audited.' },
        { text: 'Portfolio benchmarking that compounded during hold disappears at sale.' },
      ],
      punchLine: 'Governance debt comes due with interest — often at exit.',
    },
    {
      blockType: 'callToAction',
      eyebrow: 'Your Next Step',
      heading: 'Get the Diligence Frame',
      subheading: 'We work with LPs, GPs, and lenders on pre-investment diligence and post-close operational reviews of CRE data & digital infrastructure.',
      buttonLabel: 'Schedule a Conversation',
      style: 'blue',
    },
  ],
}
