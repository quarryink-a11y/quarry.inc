import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { CurrentUser } from '@/modules/access/permissions/decorators';
import { JwtPayload } from '@/shared/types';

import { BillingService } from './billing.service';
import { BillingCreateSetupIntentDto, BillingStartTrialDto, ConnectOnboardDto } from './dto';
import { BillingCreateSetupIntentResponseDto } from './response/billing-create-setup-intent-response.dto';
import { BillingStartTrialResponseDto } from './response/billing-start-trial-response.dto';
import { BillingStatusResponseDto } from './response/billing-status-response.dto';

@Controller('billing')
@ApiBearerAuth()
export class BillingController {
    constructor(private readonly billingService: BillingService) {}

    @Get()
    @ApiOperation({ summary: 'Get current billing status' })
    @ApiOkResponse({ type: BillingStatusResponseDto })
    getBilling(@CurrentUser() user: JwtPayload) {
        return this.billingService.getBillingForUser(user.sub);
    }

    @Post('start-trial')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: 'Trial subscription started successfully', type: BillingStartTrialResponseDto })
    startTrial(@CurrentUser() user: JwtPayload, @Body() dto: BillingStartTrialDto) {
        return this.billingService.startTrialForUser(user.sub, dto);
    }

    @Post('setup-intent')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Create Stripe setup intent for billing' })
    @ApiOkResponse({ description: 'Setup intent created successfully', type: BillingCreateSetupIntentResponseDto })
    createSetupIntent(@CurrentUser() user: JwtPayload, @Body() dto: BillingCreateSetupIntentDto) {
        return this.billingService.createSetupIntentForUser(user.sub, dto);
    }

    @Post('connect-onboard')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Start Stripe Connect onboarding for catalog payments' })
    connectOnboard(@CurrentUser() user: JwtPayload, @Body() dto: ConnectOnboardDto) {
        return this.billingService.startConnectOnboarding(user.sub, dto);
    }

    @Get('connect-status')
    @ApiOperation({ summary: 'Get Stripe Connect account status' })
    getConnectStatus(@CurrentUser() user: JwtPayload) {
        return this.billingService.getConnectStatus(user.sub);
    }
}
