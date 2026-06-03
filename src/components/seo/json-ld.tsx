// Server component: emits JSON-LD structured data.
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Code Hacker Placement Hub',
    url: BASE,
    description:
      'Premium placement preparation platform with company-wise questions, PYQs, quick notes, interview questions and aptitude resources.',
    sameAs: [] as string[],
  };
}

export function courseSchema(args: { name: string; description?: string | null; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: args.name,
    description: args.description ?? `${args.name} placement preparation material.`,
    provider: { '@type': 'EducationalOrganization', name: 'Code Hacker Placement Hub', sameAs: BASE },
    url: args.url,
  };
}

export function articleSchema(args: { title: string; description?: string | null; url: string; datePublished?: string; image?: string | null }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: args.title,
    description: args.description ?? undefined,
    datePublished: args.datePublished,
    image: args.image ?? undefined,
    mainEntityOfPage: args.url,
    publisher: { '@type': 'EducationalOrganization', name: 'Code Hacker Placement Hub' },
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.question,
      acceptedAnswer: { '@type': 'Answer', text: i.answer },
    })),
  };
}
