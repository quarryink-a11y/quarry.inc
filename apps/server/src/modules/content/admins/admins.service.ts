import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AppException, ErrorCode, HttpStatus } from '@/shared/errors';
import { PrismaService } from '@/shared/infrastructure/modules/prisma/prisma.service';
import { SiteContextService } from '@/shared/services/site-context.service';

import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

const ADMIN_SELECT = {
    id: true,
    site_id: true,
    first_name: true,
    last_name: true,
    email: true,
    phone_code: true,
    phone_country_code: true,
    phone_number: true,
    role: true,
    access_modules: true,
    created_at: true,
    updated_at: true,
};

@Injectable()
export class AdminsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly siteContext: SiteContextService
    ) {}

    async create(userId: string, dto: CreateAdminDto) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        const { password, ...rest } = dto;
        const password_hash = await bcrypt.hash(password, 10);
        return this.prisma.admin.create({
            data: { ...rest, password_hash, site_id },
            select: ADMIN_SELECT,
        });
    }

    async findAll(userId: string) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        return this.prisma.admin.findMany({ where: { site_id }, select: ADMIN_SELECT });
    }

    async findOne(userId: string, id: string) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        const admin = await this.prisma.admin.findFirst({ where: { id, site_id }, select: ADMIN_SELECT });
        if (!admin) {
            throw new AppException({
                status: HttpStatus.NOT_FOUND,
                code: ErrorCode.NOT_FOUND,
                message: `Admin #${id} not found`,
            });
        }
        return admin;
    }

    async update(userId: string, id: string, dto: UpdateAdminDto) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        const { password, ...rest } = dto;
        const data: Record<string, unknown> = { ...rest };
        if (password) {
            data.password_hash = await bcrypt.hash(password, 10);
        }
        await this.prisma.admin.updateMany({ where: { id, site_id }, data });
        return this.prisma.admin.findFirst({ where: { id, site_id }, select: ADMIN_SELECT });
    }

    async remove(userId: string, id: string) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        return this.prisma.admin.deleteMany({ where: { id, site_id } });
    }
}
