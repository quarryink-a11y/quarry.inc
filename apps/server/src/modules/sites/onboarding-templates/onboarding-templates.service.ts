import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/shared/infrastructure/modules/prisma/prisma.service';

@Injectable()
export class OnboardingTemplatesService {
    constructor(private readonly prisma: PrismaService) {}
    async findAll() {
        return this.prisma.onboardingTemplate.findMany({
            where: {
                is_active: true,
            },
            orderBy: [
                {
                    sort_order: 'asc',
                },
                {
                    created_at: 'desc',
                },
            ],
            select: {
                id: true,
                name: true,
                description: true,
                preview_image: true,
                preview_screens: true,
                sections: true,
                is_popular: true,
                color_scheme: true,
                sort_order: true,
            },
        });
    }
}
