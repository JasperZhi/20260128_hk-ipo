
// Enums
export enum HealthStatus {
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
  RED = 'RED'
}

export enum Recommendation {
  GO = 'GO',
  NO_GO = 'NO-GO'
}

export enum ScenarioType {
  CONSERVATIVE = 'Conservative',
  BASE = 'Base',
  OPTIMISTIC = 'Optimistic'
}

export type Language = 'en' | 'zh';
export type Theme = 'light' | 'dark';

// User Auth
export interface User {
  username: string;
  createdAt: string;
  isPremium: boolean;
  isAdmin?: boolean;
  usageCount: number; // Added to track free limit
}

// System Logging
export interface SystemLog {
  id: string;
  timestamp: string;
  username: string;
  action: 'SEARCH_ATTEMPT' | 'SEARCH_SUCCESS' | 'SEARCH_FAILURE' | 'UPGRADE_SUCCESS' | 'LOGIN' | 'LOGOUT';
  details: string;
  metadata?: any;
}

// Interfaces
export interface DimensionScore {
  name: string;
  score: number;
  weight: number;
  comment: string;
}

export interface ScoringModel {
  totalScore: number;
  dimensions: DimensionScore[];
  summary: string;
}

export interface HealthCheckItem {
  id: string;
  label: string;
  status: HealthStatus;
  value: string;
  issue?: string;
}

export interface MarketSentiment {
  internationalSubscription: string;
  publicSubscription: string;
  sentimentScore: number;
  sentimentTrend: 'Bullish' | 'Neutral' | 'Bearish' | 'Pending';
  analystConsensus: string;
}

export interface ScreeningMetrics {
  sector: string;
  listingRule: string;
  revenueGrowth: string;
  grossMargin: string;
  valuationBand: string;
  pegRatio: string;
  keyTags: string[];
}

export interface IPORadar {
  marketSentiment: MarketSentiment;
  screeningMetrics: ScreeningMetrics;
}

export interface LiquidityAnalysis {
  anchorHeatIndex: {
    score: number;
    status: 'Cold' | 'Neutral' | 'Hot' | 'Very Hot' | 'Pending';
    comment: string;
  };
  lockUpRisk: {
    riskLevel: 'Low' | 'Medium' | 'High';
    sellingPressure: string;
    marketVolatilityPrediction: string;
  };
  retailSentiment: {
    subscriptionMultiple: string;
    clawbackPrediction: string;
  };
}

export interface PeerComparison {
  name: string;
  ticker: string;
  pe?: string;
  pb?: string;
  marketCap?: string;
}

export interface ValuationData {
  peers: PeerComparison[];
  fairValueRange: string;
  fairPrice?: string;
  valuationComment: string;
}

export interface ExitStrategy {
  investorType: 'Anchor (Short-Term)' | 'Cornerstone (Long-Term)';
  horizon: string;
  primaryAction: string;
  keyObservationPoints: string[];
  stopLossOrHedge: string;
}

export interface ScenarioResult {
  type: ScenarioType;
  subscriptionMultiple: string;
  expectedReturn: string;
  liquidity: string;
  action: string;
}

export interface PositionAdvice {
  recommendation: Recommendation;
  rationale: string;
  maxDrawdownTolerance: string;
}

export interface PreIPORound {
  round: string;
  investors: string[];
  date: string;
  amount: string;
  valuation: string;
  discount: string;
}

export interface PreIPOInfo {
  status: string;
  underwriters: string[];
  financingRounds: PreIPORound[];
  keyInvestors: string[];
}

export interface IssuanceInfo {
    totalShares: string;
    publicTranchePct: string;
    internationalTranchePct: string;
    cornerstonePctOfOffer: string;
    greenshoeOption: string;
}

export interface BusinessInfo {
  description: string;
  mainProducts: string[];
  industryPosition: string;
}

export interface FinancialYearData {
  year: string;
  revenue: string;
  netProfit: string;
  grossMargin: string;
  growthRate?: string;
}

export interface FinancialInfo {
  yearlyData: FinancialYearData[];
  cagr: string;
  revenueStructure: string[];
  summary: string;
}

export interface CornerstoneItem {
  name: string;
  details?: string;
  lockup?: string;
}

export interface IPOAnalysis {
  companyName: string;
  stockCode: string;
  sector: string;
  listingDate: string;
  priceRange: string;
  marketCap: string;
  prospectusUrl?: string; 
  business: BusinessInfo; 
  financials: FinancialInfo; 
  issuanceInfo: IssuanceInfo;
  cornerstones: CornerstoneItem[]; 
  preIpo: PreIPOInfo;
  ipoRadar: IPORadar; 
  liquidityAnalysis: LiquidityAnalysis; 
  valuation: ValuationData; 
  exitStrategies: ExitStrategy[];
  healthCheck: HealthCheckItem[];
  scoring: ScoringModel;
  scenarios: ScenarioResult[];
  positionAdvice: PositionAdvice;
  suggestedFollowUps?: string[];
  lastUpdated: string;
  dataSources: string[];
}
