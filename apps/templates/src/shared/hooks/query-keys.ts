export const portfolioKeys = {
  all: ["portfolios"] as const,
  list: () => [...portfolioKeys.all, "list"] as const,
  detail: (id: string) => [...portfolioKeys.all, id] as const,
} as const;

export const reviewKeys = {
  all: ["reviews"] as const,
  list: () => [...reviewKeys.all, "list"] as const,
  detail: (id: string) => [...reviewKeys.all, id] as const,
} as const;

export const eventKeys = {
  all: ["events"] as const,
  list: () => [...eventKeys.all, "list"] as const,
  detail: (id: string) => [...eventKeys.all, id] as const,
} as const;

export const designKeys = {
  all: ["designs"] as const,
  list: () => [...designKeys.all, "list"] as const,
  detail: (id: string) => [...designKeys.all, id] as const,
} as const;

export const adminKeys = {
  all: ["admins"] as const,
  list: () => [...adminKeys.all, "list"] as const,
  detail: (id: string) => [...adminKeys.all, id] as const,
} as const;

export const faqKeys = {
  all: ["faq"] as const,
  categories: () => [...faqKeys.all, "categories"] as const,
} as const;

export const bookingStepKeys = {
  all: ["booking-steps"] as const,
  list: () => [...bookingStepKeys.all, "list"] as const,
  detail: (id: string) => [...bookingStepKeys.all, id] as const,
} as const;

export const inquiryKeys = {
  all: ["inquiries"] as const,
  list: () => [...inquiryKeys.all, "list"] as const,
  detail: (id: string) => [...inquiryKeys.all, id] as const,
} as const;

export const catalogKeys = {
  all: ["catalogs"] as const,
  list: () => [...catalogKeys.all, "list"] as const,
  detail: (id: string) => [...catalogKeys.all, id] as const,
} as const;

export const orderKeys = {
  all: ["orders"] as const,
  list: () => [...orderKeys.all, "list"] as const,
} as const;

export const billingKeys = {
  all: ["billing"] as const,
  status: () => [...billingKeys.all, "status"] as const,
} as const;

export const stripeConnectKeys = {
  all: ["stripe-connect"] as const,
  status: () => [...stripeConnectKeys.all, "status"] as const,
} as const;
