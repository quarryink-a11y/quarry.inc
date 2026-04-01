import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/shared/infrastructure/modules/prisma/prisma.service';
import { SiteContextService } from '@/shared/services/site-context.service';

@Injectable()
export class AnalyticsDashboardService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly siteContext: SiteContextService
    ) {}

    private getCutoffDate(periodDays: number): Date | null {
        if (periodDays <= 0) return null;
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - periodDays);
        return cutoff;
    }

    async getDashboard(userId: string, periodDays: number) {
        const siteId = await this.siteContext.getSiteIdByUser(userId);
        const cutoff = this.getCutoffDate(periodDays);

        const dateFilter = cutoff ? { gte: cutoff } : undefined;

        const [visits, inquiries, orders, clientInsights, referralSources, sourceConversions] = await Promise.all([
            this.getVisitsAnalytics(siteId, dateFilter),
            this.getInquiriesAnalytics(siteId, dateFilter),
            this.getOrdersAnalytics(siteId, dateFilter),
            this.getClientInsights(siteId, dateFilter),
            this.getReferralSourceBreakdown(siteId, dateFilter),
            this.getSourceConversion(siteId, dateFilter),
        ]);

        return {
            visits,
            inquiries,
            orders,
            client_insights: clientInsights,
            referral_sources: referralSources,
            source_conversions: sourceConversions,
        };
    }

    private async getVisitsAnalytics(siteId: string, dateFilter?: { gte: Date }) {
        const where = {
            site_id: siteId,
            ...(dateFilter && { created_at: dateFilter }),
        };

        const allVisits = await this.prisma.trackVisit.findMany({
            where,
            select: {
                visitor_key: true,
                traffic_source: true,
                created_at: true,
            },
        });

        const uniqueVisitors = new Set(allVisits.map((v) => v.visitor_key).filter(Boolean)).size;

        const bySource = this.groupByField(allVisits, 'traffic_source');
        const byDate = this.groupByDate(allVisits);

        return {
            total: allVisits.length,
            unique_visitors: uniqueVisitors,
            by_source: bySource,
            by_date: byDate,
        };
    }

    private async getInquiriesAnalytics(siteId: string, dateFilter?: { gte: Date }) {
        const where = {
            site_id: siteId,
            ...(dateFilter && { created_at: dateFilter }),
        };

        const allInquiries = await this.prisma.inquiry.findMany({
            where,
            select: {
                status: true,
                referral_source: true,
                created_at: true,
            },
        });

        const byStatus = this.groupByField(allInquiries, 'status');
        const byReferralSource = this.groupByField(allInquiries, 'referral_source');
        const byDate = this.groupByDate(allInquiries);

        return {
            total: allInquiries.length,
            by_status: byStatus,
            by_date: byDate,
            by_referral_source: byReferralSource,
        };
    }

    private async getOrdersAnalytics(siteId: string, dateFilter?: { gte: Date }) {
        const catalogIds = await this.prisma.catalog.findMany({
            where: { site_id: siteId },
            select: { id: true },
        });

        const catalogIdList = catalogIds.map((c) => c.id);

        if (catalogIdList.length === 0) {
            return { total: 0, revenue: 0, by_status: [], by_date: [] };
        }

        const where = {
            catalog_id: { in: catalogIdList },
            ...(dateFilter && { created_at: dateFilter }),
        };

        const allOrders = await this.prisma.order.findMany({
            where,
            select: {
                status: true,
                total_amount: true,
                created_at: true,
            },
        });

        const revenue = allOrders
            .filter((o) => o.status === 'PAID')
            .reduce((sum, o) => sum + Number(o.total_amount), 0);

        const byStatus = this.groupByField(allOrders, 'status');
        const byDate = this.groupByDate(allOrders);

        return {
            total: allOrders.length,
            revenue,
            by_status: byStatus,
            by_date: byDate,
        };
    }

    private async getClientInsights(siteId: string, dateFilter?: { gte: Date }) {
        const where = {
            site_id: siteId,
            ...(dateFilter && { created_at: dateFilter }),
        };

        const grouped = await this.prisma.inquiry.groupBy({
            by: ['client_email'],
            where,
            _count: { client_email: true },
        });

        const totalClients = grouped.length;
        const returningGroups = grouped.filter((g) => g._count.client_email > 1);
        const returningClients = returningGroups.length;
        const newClients = totalClients - returningClients;
        const returnRate = totalClients > 0 ? (returningClients / totalClients) * 100 : 0;

        const topEmails = returningGroups
            .sort((a, b) => b._count.client_email - a._count.client_email)
            .slice(0, 5)
            .map((g) => g.client_email);

        let topReturning: { email: string; name: string; inquiry_count: number }[] = [];

        if (topEmails.length > 0) {
            const clients = await this.prisma.inquiry.findMany({
                where: { client_email: { in: topEmails }, site_id: siteId },
                select: { client_email: true, first_name: true, last_name: true },
                distinct: ['client_email'],
            });

            const countMap = new Map(returningGroups.map((g) => [g.client_email, g._count.client_email]));

            topReturning = clients
                .map((c) => ({
                    email: c.client_email,
                    name: [c.first_name, c.last_name].filter(Boolean).join(' '),
                    inquiry_count: countMap.get(c.client_email) ?? 0,
                }))
                .sort((a, b) => b.inquiry_count - a.inquiry_count);
        }

        return {
            total_clients: totalClients,
            new_clients: newClients,
            returning_clients: returningClients,
            return_rate: Math.round(returnRate * 10) / 10,
            top_returning: topReturning,
        };
    }

    private async getReferralSourceBreakdown(siteId: string, dateFilter?: { gte: Date }) {
        const where = {
            site_id: siteId,
            ...(dateFilter && { created_at: dateFilter }),
        };

        const grouped = await this.prisma.inquiry.groupBy({
            by: ['referral_source'],
            where,
            _count: { referral_source: true },
        });

        const total = grouped.reduce((sum, g) => sum + g._count.referral_source, 0);

        return grouped
            .map((g) => {
                const source = g.referral_source || 'Other';
                return {
                    source,
                    count: g._count.referral_source,
                    percentage: total > 0 ? Math.round((g._count.referral_source / total) * 1000) / 10 : 0,
                };
            })
            .sort((a, b) => b.count - a.count);
    }

    private async getSourceConversion(siteId: string, dateFilter?: { gte: Date }) {
        const where = {
            site_id: siteId,
            ...(dateFilter && { created_at: dateFilter }),
        };

        const grouped = await this.prisma.inquiry.groupBy({
            by: ['referral_source', 'status'],
            where,
            _count: true,
            _sum: { final_price: true },
        });

        const sourceMap = new Map<string, { total: number; completed: number; revenue: number }>();

        for (const row of grouped) {
            const source = row.referral_source || 'Other';
            const existing = sourceMap.get(source) ?? { total: 0, completed: 0, revenue: 0 };

            existing.total += row._count;

            if (row.status === 'COMPLETED') {
                existing.completed += row._count;
                existing.revenue += row._sum.final_price ? Number(row._sum.final_price) : 0;
            }

            sourceMap.set(source, existing);
        }

        return Array.from(sourceMap.entries())
            .map(([source, data]) => ({
                source,
                total_inquiries: data.total,
                completed: data.completed,
                revenue: Math.round(data.revenue * 100) / 100,
                conversion_rate: data.total > 0 ? Math.round((data.completed / data.total) * 1000) / 10 : 0,
            }))
            .sort((a, b) => b.revenue - a.revenue || b.completed - a.completed);
    }

    private groupByField<T extends Record<string, unknown>>(items: T[], field: keyof T) {
        const map = new Map<string, number>();
        for (const item of items) {
            const key = String(item[field] ?? 'unknown');
            map.set(key, (map.get(key) ?? 0) + 1);
        }
        return Array.from(map.entries()).map(([source, count]) => ({ source, count }));
    }

    private groupByDate<T extends { created_at: Date }>(items: T[]) {
        const map = new Map<string, number>();
        for (const item of items) {
            const date = item.created_at.toISOString().split('T')[0];
            map.set(date, (map.get(date) ?? 0) + 1);
        }
        return Array.from(map.entries())
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }
}
