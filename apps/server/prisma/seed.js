"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("../generated/prisma/client");
const seed_1 = require("../src/shared/db/seed");
const adapter = new adapter_pg_1.PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    // const superAdmins = await prisma.superAdmin.createMany({
    //     data: SEED_SUPER_ADMINS.map((cred) => ({
    //         email: cred.email,
    //         passwordHash: cred.passwordHash,
    //         role: 'SUPER_ADMIN' as Role,
    //     })),
    //     skipDuplicates: true,
    // });
    // console.log('DB SEED DATA:', superAdmins);
    // const authIdentities = await prisma.authIdentity.createMany({
    //     data: SEED_SUPER_ADMINS.concat(SEED_OWNERS).map((cred) => ({
    //         email: cred.email,
    //         role: cred.role as Role,
    //         subjectId: cred.id,
    //     })),
    //     skipDuplicates: true,
    // });
    // console.log('DB SEED DATA:', authIdentities);
    // const owners = await prisma.owner.createMany({
    //     data: SEED_OWNERS.map((cred) => ({
    //         email: cred.email,
    //         passwordHash: cred.passwordHash,
    //         role: cred.role as Role,
    //         templateKind: cred.templateKind as TemplateKind,
    //     })),
    //     skipDuplicates: true,
    // });
    // console.log('DB SEED DATA:', owners);
    // const template = await prisma.template.createMany({
    //     data: SEED_OWNERS.map((cred) => ({
    //         ownerId: cred.id,
    //         kind: cred.templateKind as TemplateKind,
    //         data: SEED_TEMPLATE_CONTENT,
    //         canonicalUrl: cred.canonicalUrl, // Assuming websiteUrl is the canonical URL for the template
    //     })),
    //     skipDuplicates: true,
    // });
    // console.log('DB SEED DATA:', template);
    // const siteSettings = await prisma.siteSettings.createMany({
    //     data: SEED_OWNERS.map((owner) => SEED_SITE_SETTINGS(owner.id, owner.canonicalUrl)),
    //     skipDuplicates: true,
    // });
    // console.log('DB SEED DATA:', siteSettings);
    const onboardingTemplates = await prisma.onboardingTemplate.createMany({
        data: seed_1.SEED_ONBOARDING_TEMPLATES,
        skipDuplicates: true,
    });
    console.log('DB SEED DATA:', onboardingTemplates);
}
main()
    .then(async () => {
    // eslint-disable-next-line no-console
    console.log('Seeding completed successfully');
    await prisma.$disconnect();
})
    .catch(async (e) => {
    console.error('Error during seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map