import { ColorScheme, SiteSection, TemplateKind } from 'generated/prisma/enums';

const SEED_SUPER_ADMINS = [
    {
        id: 1,
        email: 'superadmin@example.com',
        password: 'superadminpassword',
        passwordHash: '$2a$12$z7kC5JTE8eG3nSJ8RH6QJO6reERgL54132WlODxecCdeFEYRsn2mO',
        role: 'SUPER_ADMIN',
    },
    {
        id: 2,
        email: 'superadmin2@example.com',
        password: 'superadmin2password',
        passwordHash: '$2a$12$hhyqUegk/.AA7wjjfT/ExumF5i5f36tscTsNth8DaG1SHrP7BDmwO',
        role: 'SUPER_ADMIN',
    },
];

const SEED_OWNERS = [
    {
        id: 1,
        email: 'owner@example.com',
        password: 'ownerpassword',
        passwordHash: '$2a$12$wO.X9m8ezcf1WtOa2glore83IYAY0o.dbd7QdYHy2D0EwPe3iSfq2',
        canonicalUrl: 'http://localhost',
        templateKind: 'TEMPLATE1',
        role: 'OWNER',
    },
    {
        id: 2,
        email: 'owner2@example.com',
        password: 'owner2password',
        passwordHash: '$2a$12$zqw4sm/DnLihCx3qzyOgQekslG5tgab1wbeve2LAWEaxJzjujjLqK',
        canonicalUrl: 'https://owner2-website.com',
        templateKind: 'TEMPLATE2',
        role: 'OWNER',
    },
];

const SEED_TEMPLATE_CONTENT = {
    schemaVersion: 1,
    content: {
        draft: {},
        published: {},
    },
    meta: {
        version: 0,
        publishedAt: null,
    },
};

const SEED_SITE_SETTINGS = (siteId: number, domain: string) => ({
    siteId,
    domain,
    domainName: 'Example Domain',
    siteTitle: 'My Example Site',
    siteDescription: 'This is an example site for seeding purposes.',
    seoKeywords: 'example, seed, site settings',
    ogImageUrl: 'https://example.com/og-image.jpg',
    logoUrl: 'https://example.com/logo.png',
    analyticsEnabled: true,
    siteSections: {
        hero: true,
        about: true,
        how_to_book: true,
        portfolio: true,
        designs: true,
        catalog: true,
        events: true,
        reviews: true,
        faq: true,
        booking_form: true,
    },
});

const SEED_ONBOARDING_TEMPLATES = [
    {
        name: 'Bento Style',
        description:
            'Modern bento-grid layout with rounded cards, neon-green accents, and bold typography. Same features, fresh look.',
        preview_image:
            'https://base44.app/api/apps/69a262fd3289be5507a23e6f/files/public/69a262fd3289be5507a23e6f/9ca6d0cbc_2026-03-04235924.png',
        preview_screens: [],
        is_popular: false,
        is_active: true,
        sections: [
            SiteSection.HERO,
            SiteSection.ABOUT,
            SiteSection.HOW_TO_BOOK,
            SiteSection.PORTFOLIO,
            SiteSection.DESIGNS,
            SiteSection.CATALOG,
            SiteSection.EVENTS,
            SiteSection.REVIEWS,
            SiteSection.FAQ,
            SiteSection.BOOKING_FORM,
        ],
        kind: TemplateKind.TEMPLATE2,
        color_scheme: ColorScheme.BENTO,
        sort_order: 0,
    },
    {
        name: 'Dark minimalism',
        description:
            'Elegant dark theme with smooth animations and bold typography. Perfect for tattoo artists who want a premium feel.',
        preview_image:
            'https://base44.app/api/apps/69a262fd3289be5507a23e6f/files/public/69a262fd3289be5507a23e6f/607467117_2026-02-2852131.png',
        preview_screens: [
            'https://base44.app/api/apps/69a262fd3289be5507a23e6f/files/public/69a262fd3289be5507a23e6f/6c10801f4_2026-03-01123756.png',
        ],
        is_popular: true,
        is_active: true,
        sections: [
            SiteSection.HERO,
            SiteSection.ABOUT,
            SiteSection.HOW_TO_BOOK,
            SiteSection.PORTFOLIO,
            SiteSection.DESIGNS,
            SiteSection.CATALOG,
            SiteSection.EVENTS,
            SiteSection.REVIEWS,
            SiteSection.FAQ,
            SiteSection.BOOKING_FORM,
        ],
        kind: TemplateKind.TEMPLATE1,
        color_scheme: ColorScheme.DARK,
        sort_order: 1,
    },
];
export { SEED_ONBOARDING_TEMPLATES, SEED_OWNERS, SEED_SITE_SETTINGS, SEED_SUPER_ADMINS, SEED_TEMPLATE_CONTENT };
