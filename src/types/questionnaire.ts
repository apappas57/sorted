export type EmploymentType =
  | "employee"
  | "sole_trader"
  | "both"
  | "casual"
  | "not_working";

export type ABNStatus = "has_abn" | "side_income_no_abn" | "no";

export type GSTStatus = "registered" | "not_registered" | "unsure";

export type HECSStatus = "yes" | "no" | "unsure";

export type DebtType =
  | "credit_card"
  | "car_loan"
  | "personal_loan"
  | "afterpay_bnpl";

export type JobHuntingStatus = "actively" | "casually" | "no";

export type WorkFromHome = "yes" | "sometimes" | "no";

export type CarForWork = "yes" | "no";

export type AnnualKmsRange =
  | "under_5000"
  | "5000_15000"
  | "15000_25000"
  | "25000_40000"
  | "over_40000";

export type PrivateHealthInsurance = "yes" | "no";

export type HousingStatus = "renting" | "mortgage" | "neither";

export type AgeRange = "18-29" | "30-39" | "40-49" | "50-59" | "60+";

export type FamilyStatus =
  | "single"
  | "partner_no_kids"
  | "partner_with_kids"
  | "single_parent";

export type AustralianState =
  | "NSW"
  | "VIC"
  | "QLD"
  | "SA"
  | "WA"
  | "TAS"
  | "NT"
  | "ACT";

export type DebtEntry = {
  type: DebtType;
  amount?: number;
};

export type HomeOfficeMethod = "hours" | "actual";

export type BusinessDeductions = {
  toolsAndEquipment: number;
  technology: number;
  vehicleExpenses: number;
  homeOfficeMethod: HomeOfficeMethod;
  homeOfficeHoursPerWeek: number;
  subscriptions: number;
  professionalDevelopment: number;
  clothing: number;
  otherDeductions: number;
  totalAssetPurchases: number;
};

export type QuestionnaireStep =
  | "employment"
  | "abn"
  | "gst"
  | "hecs"
  | "debt"
  | "salary"
  | "work_from_home"
  | "car_for_work"
  | "health_insurance"
  | "business_deductions"
  | "housing"
  | "life_situation"
  | "job_hunting"
  | "state";

export type QuestionnaireAnswers = {
  // Step 1: Employment (always shown)
  employment: EmploymentType;

  // Step 2: ABN & side income (conditional: sole_trader, both, or casual)
  abnStatus?: ABNStatus;
  annualRevenue?: number;

  // Step 3: GST status (conditional: has ABN or side income)
  gstStatus?: GSTStatus;

  // Step 4: HECS-HELP debt (always shown)
  hecsDebt: HECSStatus;
  hecsAmount?: number;

  // Step 5: Personal debt (always shown)
  debts: DebtEntry[];

  // Step 6: Job hunting (always shown)
  jobHunting: JobHuntingStatus;

  // Step 1b: Annual salary (conditional: employee, both, or casual)
  annualSalary?: number;

  // Step 4: Work from home (always shown)
  workFromHome?: WorkFromHome;
  workFromHomeHours?: number;

  // Step 5: Car for work (conditional: if employed)
  carForWork?: CarForWork;
  estimatedWorkKms?: number;
  annualKms?: AnnualKmsRange;

  // Step 6: Private health insurance (conditional: salary > $90K)
  privateHealth?: PrivateHealthInsurance;

  // Step 9: Housing situation (always shown)
  housingStatus?: HousingStatus;
  weeklyRent?: number;

  // Step 11: Life situation (always shown)
  ageRange?: AgeRange;
  familyStatus?: FamilyStatus;

  // Business deductions (conditional: sole_trader, both, or casual with ABN)
  businessDeductions?: BusinessDeductions;

  // Step 7: State/territory (always shown)
  state: AustralianState;
};
