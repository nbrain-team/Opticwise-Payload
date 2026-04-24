export const forTenantsPage = {
  title: 'For Tenants',
  slug: 'for-tenants',
  audience: 'tenants',
  excerpt: 'What the 5S® standard actually means for tenants — and why it matters for lease decisions.',
  layout: [
    {
      blockType: 'hero',
      eyebrow: 'For Tenants',
      heading: 'What OpticWise Means for Your Lease',
      lede:
        "If you're evaluating a building operated under the OpticWise standard — here's what it means for your team. No marketing language. Just what changes.",
      reframeLine: 'Property tech is usually sold to the owner. This page is written for you.',
      audienceLine: 'For corporate tenants, GCs, lease negotiators, and workplace teams.',
      style: 'dark',
    },
    {
      blockType: 'fiveStandard',
      eyebrow: 'The Standard',
      heading: 'What 5S® Means in Your Suite',
      tagline: 'Every OpticWise building is measured against five tenant-facing standards.',
      standards: [
        { title: 'Seamless Mobility', description: 'One network identity from your suite to the common area. No re-logging in as you move.' },
        { title: 'Security', description: 'Segmented from other tenants and from building operational systems. Your traffic is your traffic.' },
        { title: 'Stability', description: 'Building-system outages don\'t take down your connectivity. Vendor failures are isolated.' },
        { title: 'Speed', description: 'Performance targeted to what your team actually runs — not building-minimum specs.' },
        { title: 'Service', description: 'Human support. Known contacts. Not a generic tenant services portal.' },
      ],
    },
    {
      blockType: 'cardGrid',
      eyebrow: "What This Replaces",
      heading: 'The Patterns You\'ve Probably Lived With',
      columns: '2',
      style: 'nearwhite',
      cards: [
        { title: 'Tenant Wi-Fi That "Just Happens"', description: 'Installed by a vendor, on their hardware, on their network. Outages traced to nobody.' },
        { title: 'Building-Wide Slowdowns', description: 'One tenant or system consumes the building. Yours suffers.' },
        { title: 'Fragmented Access', description: 'Your building credential, your parking credential, your Wi-Fi credential — three different vendors, three different problems.' },
        { title: 'Vendor Finger-Pointing', description: "When something breaks, nobody owns it. You've been the root-cause investigator more than once." },
      ],
    },
    {
      blockType: 'twoColumn',
      eyebrow: 'Privacy Non-Negotiables',
      heading: 'What OpticWise Does Not Do',
      subheading:
        'OpticWise does not monetize tenant browsing behavior. OpticWise does not sell user data. Owner control and tenant trust are non-negotiable.',
      authorityNote:
        'Building-level connectivity and data & digital infrastructure is what we govern. What happens on your traffic, inside your suite, is yours.',
      style: 'dark',
    },
    {
      blockType: 'callToAction',
      eyebrow: 'Your Next Step',
      heading: 'Evaluating a Building with OpticWise Inside?',
      subheading:
        'If you\'re a tenant or broker evaluating a building operated under the OpticWise standard, we\'re happy to walk your team through what that means — with the building\'s owner or operator present.',
      buttonLabel: 'Schedule a Conversation',
      style: 'blue',
    },
  ],
}
