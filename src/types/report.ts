export type TaxSection = {
  estimatedTaxRate: number;
  fortnightlySetAside: number;
  annualTaxEstimate: number;
  medicareLevy: number;
  hecsRepayment: number;
  explanation: string;
  tips: string[];
};

export type BASSection = {
  required: boolean;
  frequency: string;
  nextDueDate: string;
  gstRecommendation: string;
  explanation: string;
  tips: string[];
};

export type DeductionCategory = {
  name: string;
  items: string[];
  estimatedValue: number;
};

export type DeductionsSection = {
  categories: DeductionCategory[];
  totalEstimatedDeductions: number;
  explanation: string;
};

export type DebtSection = {
  strategy: string;
  priorityOrder: string[];
  explanation: string;
  tips: string[];
};

export type BenefitItem = {
  name: string;
  description: string;
  howToApply: string;
  estimatedValue: string;
};

export type BenefitsSection = {
  eligible: BenefitItem[];
  possiblyEligible: BenefitItem[];
};

export type ActionsSection = {
  immediate: string[];
  thisWeek: string[];
  thisMonth: string[];
  beforeEOFY: string[];
};

export type DiscoveryItem = {
  title: string;
  amount: number;
  description: string;
  howToCapture: string;
  source: string;
};

export type DiscoveriesSection = {
  totalPotentialSavings: number;
  items: DiscoveryItem[];
  disclaimer: string;
};

export type ReportData = {
  discoveries: DiscoveriesSection;
  tax: TaxSection;
  bas: BASSection;
  deductions: DeductionsSection;
  debt: DebtSection;
  benefits: BenefitsSection;
  actions: ActionsSection;
};
