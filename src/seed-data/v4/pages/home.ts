export const homePage = {
  title: 'Home',
  slug: 'home',
  isHomePage: true,
  audience: 'primary',
  excerpt:
    'OpticWise helps CRE owners turn data & digital infrastructure into owner-controlled digital assets. Property Intelligence becomes Portfolio Intelligence.',
  layout: [
    {
      blockType: 'hero',
      eyebrow: 'Property Intelligence → Portfolio Intelligence',
      heading: 'Own Your Data & Digital Infrastructure. Build for the Long Game.',
      lede:
        'Data & digital infrastructure are no longer background utilities. They determine who controls NOI, who owns operational and tenant data, and who shapes the future intelligence of commercial real estate assets.',
      reframeLine: "If you don't own your data & digital infrastructure, your vendors do.",
      audienceLine:
        'For CRE owners, operators, and asset managers who want predictable NOI, resilient operations, satisfied tenants, and portfolios that get smarter over time.',
      primaryCtaLabel: 'Schedule Your Review',
      secondaryCtaLabel: 'Explore the Pillars',
      secondaryCtaHref: '/digital-infrastructure-noi-ai',
      style: 'dark',
    },
    {
      blockType: 'twoColumn',
      eyebrow: 'The Internal Problem',
      heading: 'Running the Business with Blurry Vision',
      subheading: "Most owners aren't flying blind — they're flying blurry.",
      body: null, // filled by the seed script with rich text
      authorityNote:
        "You know value is being left on the table. You just can't see where, how much, or why. Every new \"solution\" adds cost, complexity, and another layer between you and your own building. That's not a tooling problem. That's a control problem.",
      style: 'nearwhite',
    },
    {
      blockType: 'problemBlock',
      eyebrow: 'The Owner Problem',
      heading: 'The Silent Loss of Control',
      intro:
        'Most owners did not give up control intentionally. It happened quietly — one tactical decision at a time.',
      items: [
        { label: 'Networks', description: 'Installed under vendor contracts' },
        { label: 'Wireless', description: 'Designed around revenue share' },
        { label: 'Data', description: 'Locked inside vendor dashboards' },
        { label: 'Visibility', description: 'Defined by third-party platforms' },
      ],
      closingLine:
        'Each decision felt tactical. Together, they shifted control away from the asset.',
    },
    {
      blockType: 'pullQuote',
      eyebrow: 'The Skybox Principle',
      quote:
        "Don't manage a 50-asset portfolio from the field. Build the owner-controlled intelligence layer so you can operate from the skybox — seeing causes, not just results.",
      style: 'dark',
    },
    {
      blockType: 'twoColumn',
      eyebrow: 'The OpticWise Model',
      heading: 'How OpticWise Helps You Win the Long Game',
      subheading:
        'OpticWise is not a bolt-on vendor. We partner with you to design, implement, and operate managed data & digital infrastructure — and deliver the owner-controlled intelligence layer that turns Property Intelligence into Portfolio Intelligence.',
      authorityNote:
        'The PPP 5C™ plan, the Two-Layer Model, and Property Brain™ are codified in Peak Property Performance® (Fast Company Press) and grounded in field-tested practice across commercial real estate portfolios — not slideware.',
      style: 'dark',
    },
    {
      blockType: 'botCallout',
      layerLabel: 'Layer 1',
      eyebrow: 'The Foundation You Own',
      heading: 'Managed Data & Digital Infrastructure',
      botDescription:
        "Delivered through BoT® (Building of Things®) — OpticWise's owner-controlled approach to data & digital infrastructure. BoT® consolidates and governs building connectivity so every device and system runs on a single, secure, segmented foundation.",
      pillars: [
        {
          title: 'Design',
          description: 'Repeatable standards across every property.',
        },
        {
          title: 'Implementation',
          description:
            'Governance baked in — segmentation, access rules, documentation.',
        },
        {
          title: 'Operations',
          description:
            'Ongoing digital management that keeps performance high and operational risk low — without taxing on-site engineers or property managers.',
        },
      ],
      closingLine: 'Different skill set. Different lane. Same owner standard.',
    },
    {
      blockType: 'fiveStandard',
      eyebrow: 'The User Experience Standard',
      heading: '5S® — Non-Negotiable',
      tagline:
        'Every building OpticWise touches is measured against five standards. No exceptions.',
      standards: [
        {
          title: 'Seamless Mobility',
          description: 'One network identity, consistent across every property.',
        },
        {
          title: 'Security',
          description: 'Segmented, governed, auditable.',
        },
        {
          title: 'Stability',
          description: 'Resilient by design — outages get isolated, not inherited.',
        },
        {
          title: 'Speed',
          description: 'Performance that matches tenant expectations today and tomorrow.',
        },
        {
          title: 'Service',
          description: 'Human operations — not ticket roulette.',
        },
      ],
    },
    {
      blockType: 'brainBlock',
      layerLabel: 'Layer 2',
      eyebrow: 'Owner-Controlled Intelligence',
      heading: 'Property Brain™ → Portfolio Brain™',
      tagline: 'Vendor- and LLM-agnostic. Owner-controlled by design.',
      body: [
        {
          text: 'Property Brain™ is a governed data plane + trust plane that makes each building capable of autonomous activities and intelligence.',
        },
        {
          text: 'Standardize it once, and Property Brain™ becomes Portfolio Brain™ — so intelligence compounds across buildings instead of restarting at every address.',
        },
      ],
      flowLine:
        'One standard intelligence substrate → Many decision engines → Scaled across your portfolio.',
    },
    {
      blockType: 'fivePlan',
      eyebrow: 'The Plan',
      heading: 'Peak Property Performance® — The 5C™ Plan',
      lede:
        'One repeatable plan that turns fragmented, vendor-controlled building tech into an owner standard that scales.',
      steps: [
        {
          letter: '01',
          title: 'Clarify',
          tag: 'PPP Audit™',
          description:
            "Define success metrics, map ownership, identify leakage, document what's trustworthy and portable.",
        },
        {
          letter: '02',
          title: 'Connect',
          tag: 'Managed infrastructure',
          description:
            'Establish secure, owner-controlled connectivity that repeats property-to-property.',
        },
        {
          letter: '03',
          title: 'Collect',
          tag: 'Managed infrastructure',
          description:
            'Capture and normalize high-fidelity usable data into a consistent reusable model.',
        },
        {
          letter: '04',
          title: 'Coordinate',
          tag: 'Property Brain™ + Portfolio Brain™',
          description:
            'Govern identity, access, privacy, lineage, retention, and rules of use.',
        },
        {
          letter: '05',
          title: 'Control',
          tag: 'Property Brain™ + Portfolio Brain™',
          description:
            'Enable any decision engine or LLM to act under owner permissions.',
        },
      ],
      punchLine: 'Start with Clarify. Scale with control.',
    },
    {
      blockType: 'pullQuote',
      eyebrow: 'Operator Voice',
      quote: "If you only look at NOI, you're looking at the result — not the cause.",
      attribution: 'OpticWise Quote Bank',
      style: 'light',
    },
    {
      blockType: 'cardGrid',
      eyebrow: 'What Changes',
      heading: 'What Ownership Unlocks',
      subheading: 'When you own the foundation, the asset itself changes.',
      columns: '2',
      style: 'nearwhite',
      cards: [
        {
          title: 'Portable Intelligence Assets',
          description:
            "Properties stop being one-offs. Data moves with the owner, not the vendor.",
        },
        {
          title: 'Vendor Portability',
          description:
            'Swap vendors without losing history, intelligence, or operational continuity.',
        },
        {
          title: 'Platform Portability',
          description: 'Swap decision engines without rewiring buildings.',
        },
        {
          title: 'NOI That Grows',
          description:
            "Owner-controlled connectivity, fewer leaks, and revenue you couldn't see before.",
        },
        {
          title: 'Lower Risk',
          description:
            'Privacy, security, compliance, auditability — owned, not rented.',
        },
        {
          title: 'Tenant Experience That Holds Up',
          description:
            'Consistent, measurable, 5S®-grade — property to property.',
        },
        {
          title: "AI Readiness That's Real",
          description: 'Grounded in governance, not theoretical.',
        },
        {
          title: 'Compounding Portfolio Performance',
          description:
            'Built on client-owned data & digital infrastructure. Not rented software.',
        },
      ],
      closingLine:
        "We don't just optimize a building. We change what the asset is — then scale that advantage portfolio-wide.",
    },
    {
      blockType: 'avoidFailure',
      eyebrow: 'The Cost of Inaction',
      heading: 'Without Owner-Controlled Data & Digital Infrastructure',
      lede: "Delay doesn't buy you optionality. It locks it up.",
      consequences: [
        { text: 'Every new tool becomes another silo' },
        {
          text: 'Data stays inconsistent, operationally ambiguous, and trapped inside dashboards',
        },
        { text: 'AI becomes automation without governance — speed without trust' },
        { text: 'Each property needs custom integration — slow, expensive, brittle' },
        {
          text: 'The portfolio becomes a patchwork of "smart buildings" that can\'t compound value',
        },
        { text: 'You end up with lock-in and dashboards — but no durable capability' },
      ],
      punchLine: 'Governance debt comes due with interest.',
    },
    {
      blockType: 'starterKit',
      eyebrow: 'Free Download',
      heading: 'The Hidden Data Inside Your Buildings',
      lede:
        "Why most CRE owners don't control their most valuable asset — and the framework that changes everything.",
      bulletPoints: [
        { text: 'Chapter 1 from Peak Property Performance® (Fast Company Press)' },
        { text: '1-page PPP 5C™ Framework diagram' },
        { text: 'The five questions every owner should ask about building data' },
        { text: 'PPP Review teaser worksheet' },
      ],
      bookLabel: 'Fast Company Press',
      buttonLabel: 'Get the PPP Starter Kit',
    },
    {
      blockType: 'portfolioGrid',
      eyebrow: 'Portfolio',
      heading: "Infrastructure We've Built",
      // projects filled by seed script with image references
      projects: [
        {
          name: 'ASPIRIA',
          location: 'Overland Park, KS',
          caption:
            'Common pattern: owner-controlled connectivity and data & digital infrastructure repeated across a large mixed-use campus under one standard.',
        },
        {
          name: 'Industry',
          location: 'Denver, CO',
          caption:
            'Common pattern: owner-standard data & digital infrastructure replacing fragmented vendor installs — one backplane, vendors plug in under rules.',
        },
        {
          name: 'AMAZE @ NODA Apartments',
          location: 'Charlotte, NC',
          caption:
            'Common pattern: governed connectivity and ongoing operations without taxing on-site engineers or property managers.',
        },
      ],
    },
    {
      blockType: 'callToAction',
      eyebrow: 'Your Next Step',
      heading: 'Complimentary CRE Data & Digital Review',
      subheading: 'One building. 45 minutes. No software pitch. No rip-and-replace.',
      bulletPoints: [
        { text: 'What you actually own — and what your vendors do' },
        { text: 'Where your data lives, and how portable it is' },
        { text: 'Where operational burden stacks up against your KPIs' },
        { text: "The top 3 monthly plays you'd actually use — not another dashboard" },
      ],
      buttonLabel: 'Schedule Your Review',
      style: 'blue',
    },
  ],
}
