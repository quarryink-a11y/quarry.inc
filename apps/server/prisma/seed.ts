import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';
import { SEED_ONBOARDING_TEMPLATES } from 'src/shared/db/seed';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    const onboardingTemplates = await prisma.onboardingTemplate.createMany({
        data: SEED_ONBOARDING_TEMPLATES,
        skipDuplicates: true,
    });
    // eslint-disable-next-line no-console
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
