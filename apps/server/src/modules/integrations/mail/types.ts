// This file defines TypeScript types related to the mail functionality of the application, including the structure of mail templates and options for sending templated emails.

// General structure of mail templates, where each template has a specific context that defines the variables used in the template.
interface MailTemplates {
    requestResetPassword: {
        userName?: string;
        resetLink: string;
        expiryTime?: string;
        companyName?: string;
        companyAddress?: string;
        unsubscribeLink?: string;
    };
    successResetPassword: {
        userName: string;
        companyName: string;
        loginLink: string;
        supportEmail: string;
        companyAddress?: string;
        unsubscribeLink?: string;
    };
    verifyEmail: {
        userName: string;
        companyName: string;
        codeDigits: string[];
        expiryTime: string;
        verifyEmailLink: string;
        companyAddress?: string;
        unsubscribeLink?: string;
    };
    newInquiry: {
        clientName: string;
        clientEmail: string;
        clientPhone: string;
        firstName: string;
        lastName: string;
        ideaDescription: string;
        placement: string;
        size: string;
        preferredDate: string;
        city: string;
        referralSource: string;
        hasInspiration: boolean;
        inspirationUrls: string[];
    };
    trialWelcome: {
        userName: string;
        planName: string;
        trialEndDate: string;
        loginLink: string;
    };
    paymentSucceeded: {
        userName: string;
        planName: string;
        amount: string;
        nextBillingDate: string;
    };
    paymentFailed: {
        userName: string;
        planName: string;
        retryInfo: string;
    };
    subscriptionCanceled: {
        userName: string;
        planName: string;
        supportEmail: string;
    };
    newOrder: {
        ownerName: string;
        customerName: string;
        customerEmail: string;
        totalAmount: string;
        currency: string;
        orderId: string;
    };
}

type TemplateName = keyof MailTemplates;

type EmailAddress = string | { name: string; address: string };

type EmailAddressLike = EmailAddress | EmailAddress[];

interface SendTemplateMailOptions<T extends TemplateName> {
    template: T;
    to: EmailAddressLike;
    from?: string | EmailAddress;
    context: MailTemplates[T];
    replyTo?: EmailAddressLike;
    subject?: string;
}

type MailTemplateConfig = {
    [K in TemplateName]: {
        template: string;
        subject: string;
    };
};

const MAIL_TEMPLATES = {
    requestResetPassword: {
        template: 'request-reset-password',
        subject: 'Reset password',
    },
    successResetPassword: {
        template: 'success-reset-password',
        subject: 'Your password has been reset',
    },
    verifyEmail: {
        template: 'verify-email',
        subject: 'Verify your email address',
    },
    newInquiry: {
        template: 'inquiry',
        subject: 'New inquiry',
    },
    trialWelcome: {
        template: 'trial-welcome',
        subject: 'Welcome to your free trial!',
    },
    paymentSucceeded: {
        template: 'payment-succeeded',
        subject: 'Payment received',
    },
    paymentFailed: {
        template: 'payment-failed',
        subject: 'Payment failed — action required',
    },
    subscriptionCanceled: {
        template: 'subscription-canceled',
        subject: 'Your subscription has been canceled',
    },
    newOrder: {
        template: 'new-order',
        subject: 'New order received',
    },
} satisfies MailTemplateConfig;

export type { EmailAddress, EmailAddressLike, MailTemplates, SendTemplateMailOptions, TemplateName };
export { MAIL_TEMPLATES };
