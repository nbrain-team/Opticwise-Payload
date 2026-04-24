export const aiReadyPage = {
  title: 'AI-Ready Commercial Real Estate',
  slug: 'ai-ready-commercial-real-estate',
  audience: 'primary',
  excerpt: 'Why governance, data ownership, and data & digital infrastructure come before any AI tool.',
  layout: [
    {
      blockType: 'hero',
      eyebrow: 'AI Readiness',
      heading: 'AI-Ready Commercial Real Estate',
      lede:
        "Most AI conversations in CRE start with the wrong question. \"Which AI tool should we buy?\" doesn't matter if your building can't support any AI at all.",
      reframeLine: 'Without governance, AI is just another vendor dependency.',
      style: 'dark',
    },
    {
      blockType: 'twoColumn',
      eyebrow: 'The Reframe',
      heading: "AI Is Not a Product. It's a Capability That Requires Infrastructure.",
      subheading:
        'Every vendor in the CRE stack is shipping an AI feature. Predictive maintenance. Tenant chatbots. Energy optimization. Leasing copilots.',
      authorityNote:
        "Most of them sit on top of data you don't own, running inside data & digital infrastructure you don't control, producing outputs nobody can audit. That's not AI readiness. That's AI dependency.",
      style: 'nearwhite',
    },
    {
      blockType: 'cardGrid',
      eyebrow: 'What AI-Ready Actually Means',
      heading: 'Three Requirements — In Order',
      columns: '3',
      style: 'dark',
      cards: [
        {
          title: '1. Governed Data',
          description:
            'Clean, structured, owner-controlled data from every building system. Normalized. Auditable. Portable.',
        },
        {
          title: '2. Controlled Data & Digital Infrastructure',
          description:
            'Segmented networks. Documented systems. Managed access. No rogue devices, no undocumented integrations, no vendor-only admin credentials.',
        },
        {
          title: '3. A Trust Plane',
          description:
            'A governance layer that ensures every AI output is permissioned, auditable, and reliable. Not "the model said so" — instead, "the model ran on our governed data, under these rules, and produced this output, traceable end-to-end."',
        },
      ],
      closingLine: 'Without all three, AI is theater.',
    },
    {
      blockType: 'botCallout',
      layerLabel: 'Layer 1',
      eyebrow: 'Build the Foundation',
      heading: 'Owner-Controlled Data & Digital Infrastructure (BoT®)',
      botDescription:
        'Network governance: segmentation, access control, documentation. Data ingestion: structured collection from every building system. Vendor independence: swap any system without losing data or control.',
      pillars: [
        { title: 'Segmentation', description: 'Networks isolated by system and risk profile.' },
        { title: 'Data Ingestion', description: 'Every building system feeds into one governed model.' },
        { title: 'Vendor Independence', description: 'Swap vendors without losing data or control.' },
      ],
    },
    {
      blockType: 'brainBlock',
      layerLabel: 'Layer 2',
      eyebrow: 'Enable Intelligence',
      heading: 'Property Brain™ → Portfolio Brain™',
      tagline: 'Any LLM. Any decision engine. Owner-permissioned.',
      body: [
        { text: 'Governed data plane. Trust plane for auditable outputs.' },
        { text: 'Any LLM, any decision engine — acting under owner permissions.' },
        { text: 'Same plan, every property. Property Intelligence becomes Portfolio Intelligence.' },
      ],
      flowLine: 'Infrastructure first. AI second. Intelligence that compounds.',
    },
    {
      blockType: 'avoidFailure',
      eyebrow: 'The Pattern to Avoid',
      heading: 'Most Owners Skip the Foundation',
      lede: 'And buy the tool. The result:',
      consequences: [
        { text: 'AI becomes automation without governance — speed without trust' },
        { text: 'Each property needs custom integration — slow, expensive, brittle' },
        { text: "Outputs can't be audited — which means they can't be trusted at board level" },
        { text: 'Swapping vendors means starting over — no portable intelligence' },
      ],
      punchLine: 'Governance debt comes due with interest.',
    },
    {
      blockType: 'cardGrid',
      eyebrow: 'Good Fit Signals',
      heading: "You're Ready for AI-Ready CRE If You...",
      columns: '2',
      style: 'nearwhite',
      cards: [
        { title: 'Want governed data first', description: 'Before predictive dashboards.' },
        { title: 'Willing to standardize', description: 'One owner standard, vendors plug in under rules.' },
        { title: 'Accept AI without a trust plane is a liability', description: 'Not an asset.' },
        { title: 'Willing to start with Clarify', description: 'Not a pilot of the latest AI tool.' },
      ],
    },
    {
      blockType: 'callToAction',
      eyebrow: 'Your Next Step',
      heading: 'Find Out If Your Building Is AI-Ready',
      subheading: 'Start with a complimentary PPP Audit™.',
      buttonLabel: 'Schedule Your Review',
      style: 'blue',
    },
  ],
}
