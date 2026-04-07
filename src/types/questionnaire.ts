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

export type QuestionnaireStep =
  | "employment"
  | "abn"
  | "gst"
  | "hecs"
  | "debt"
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

  // Step 7: State/territory (always shown)
  state: AustralianState;
};
