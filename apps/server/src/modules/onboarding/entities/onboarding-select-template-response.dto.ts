export class OnboardingSelectTemplateResponseDto {
    success: boolean;
    site: {
        id: string;
        name: string;
        onboarding_template_id: string;
        onboarding_status: string;
        onboarding_template: {
            id: string;
            name: string;
            description: string;
        } | null;
    };
}
