
import { GoogleGenAI, Type } from "@google/genai";
import { IPOAnalysis, Language } from "../types";

// Schema stays the same for structure consistency
const ipoAnalysisSchema = {
  type: Type.OBJECT,
  required: ["companyName", "stockCode", "sector", "listingDate", "priceRange", "marketCap", "business", "financials", "issuanceInfo", "cornerstones", "preIpo", "ipoRadar", "liquidityAnalysis", "valuation", "healthCheck", "scoring", "scenarios", "positionAdvice", "exitStrategies", "lastUpdated", "dataSources"],
  properties: {
    companyName: { type: Type.STRING },
    stockCode: { type: Type.STRING },
    sector: { type: Type.STRING },
    listingDate: { type: Type.STRING },
    priceRange: { type: Type.STRING },
    marketCap: { type: Type.STRING },
    prospectusUrl: { type: Type.STRING },
    business: {
      type: Type.OBJECT,
      properties: {
        description: { type: Type.STRING },
        mainProducts: { type: Type.ARRAY, items: { type: Type.STRING } },
        industryPosition: { type: Type.STRING }
      }
    },
    financials: {
      type: Type.OBJECT,
      properties: {
        yearlyData: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              year: { type: Type.STRING },
              revenue: { type: Type.STRING },
              netProfit: { type: Type.STRING },
              grossMargin: { type: Type.STRING },
              growthRate: { type: Type.STRING }
            }
          }
        },
        cagr: { type: Type.STRING },
        revenueStructure: { type: Type.ARRAY, items: { type: Type.STRING } },
        summary: { type: Type.STRING }
      }
    },
    issuanceInfo: {
      type: Type.OBJECT,
      properties: {
        totalShares: { type: Type.STRING },
        publicTranchePct: { type: Type.STRING },
        internationalTranchePct: { type: Type.STRING },
        cornerstonePctOfOffer: { type: Type.STRING },
        greenshoeOption: { type: Type.STRING }
      }
    },
    cornerstones: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          details: { type: Type.STRING },
          lockup: { type: Type.STRING }
        }
      }
    },
    preIpo: {
      type: Type.OBJECT,
      properties: {
        status: { type: Type.STRING },
        underwriters: { type: Type.ARRAY, items: { type: Type.STRING } },
        keyInvestors: { type: Type.ARRAY, items: { type: Type.STRING } },
        financingRounds: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              round: { type: Type.STRING },
              investors: { type: Type.ARRAY, items: { type: Type.STRING } },
              date: { type: Type.STRING },
              amount: { type: Type.STRING },
              valuation: { type: Type.STRING },
              discount: { type: Type.STRING }
            }
          }
        }
      }
    },
    ipoRadar: {
      type: Type.OBJECT,
      properties: {
        marketSentiment: {
          type: Type.OBJECT,
          properties: {
            internationalSubscription: { type: Type.STRING },
            publicSubscription: { type: Type.STRING },
            sentimentScore: { type: Type.NUMBER },
            sentimentTrend: { type: Type.STRING, enum: ['Bullish', 'Neutral', 'Bearish', 'Pending'] },
            analystConsensus: { type: Type.STRING }
          }
        },
        screeningMetrics: {
          type: Type.OBJECT,
          properties: {
            sector: { type: Type.STRING },
            listingRule: { type: Type.STRING },
            revenueGrowth: { type: Type.STRING },
            grossMargin: { type: Type.STRING },
            valuationBand: { type: Type.STRING },
            pegRatio: { type: Type.STRING },
            keyTags: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    },
    liquidityAnalysis: {
      type: Type.OBJECT,
      properties: {
        anchorHeatIndex: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            status: { type: Type.STRING, enum: ['Cold', 'Neutral', 'Hot', 'Very Hot', 'Pending'] },
            comment: { type: Type.STRING }
          }
        },
        lockUpRisk: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
            sellingPressure: { type: Type.STRING },
            marketVolatilityPrediction: { type: Type.STRING }
          }
        },
        retailSentiment: {
          type: Type.OBJECT,
          properties: {
            subscriptionMultiple: { type: Type.STRING },
            clawbackPrediction: { type: Type.STRING }
          }
        }
      }
    },
    valuation: {
      type: Type.OBJECT,
      properties: {
        peers: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              ticker: { type: Type.STRING },
              pe: { type: Type.STRING },
              pb: { type: Type.STRING },
              marketCap: { type: Type.STRING }
            }
          }
        },
        fairValueRange: { type: Type.STRING },
        fairPrice: { type: Type.STRING },
        valuationComment: { type: Type.STRING }
      }
    },
    healthCheck: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          label: { type: Type.STRING },
          status: { type: Type.STRING, enum: ['GREEN', 'YELLOW', 'RED'] },
          value: { type: Type.STRING },
          issue: { type: Type.STRING }
        }
      }
    },
    scoring: {
      type: Type.OBJECT,
      properties: {
        totalScore: { type: Type.NUMBER },
        summary: { type: Type.STRING },
        dimensions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              score: { type: Type.NUMBER },
              weight: { type: Type.NUMBER },
              comment: { type: Type.STRING }
            }
          }
        }
      }
    },
    scenarios: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, enum: ['Conservative', 'Base', 'Optimistic'] },
          subscriptionMultiple: { type: Type.STRING },
          expectedReturn: { type: Type.STRING },
          liquidity: { type: Type.STRING },
          action: { type: Type.STRING }
        }
      }
    },
    positionAdvice: {
      type: Type.OBJECT,
      properties: {
        recommendation: { type: Type.STRING, enum: ['GO', 'NO-GO', 'WAIT'] },
        rationale: { type: Type.STRING },
        maxDrawdownTolerance: { type: Type.STRING }
      }
    },
    exitStrategies: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          investorType: { type: Type.STRING },
          horizon: { type: Type.STRING },
          primaryAction: { type: Type.STRING },
          keyObservationPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          stopLossOrHedge: { type: Type.STRING }
        }
      }
    },
    suggestedFollowUps: { type: Type.ARRAY, items: { type: Type.STRING } },
    lastUpdated: { type: Type.STRING },
    dataSources: { type: Type.ARRAY, items: { type: Type.STRING } }
  }
};


const API_BASE = '/api/ipo';


export const analyzeIPO = async (
  companyName: string,
  subscriptionMultiple: string,
  file?: File,
  prospectusUrlInput?: string,
  onProgress?: (message: string) => void,
  language: Language = 'zh',
  retryCount = 0
): Promise<IPOAnalysis> => {
  if (onProgress) onProgress(language === 'zh' ? "正在与后端研究枢纽同步..." : "Syncing with Research Hub...");

  const username = localStorage.getItem('ipo_username');
  const token = localStorage.getItem('ipo_token');

  const resp = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      companyName,
      subscriptionMultiple,
      language,
      username
    })
  });

  if (!resp.ok) {
    const err = await resp.json();
    throw new Error(err.message || "Synthesis disrupted");
  }

  return await resp.json();
};

export const getIPOVsHistory = async (username: string): Promise<IPOAnalysis[]> => {
  const token = localStorage.getItem('ipo_token');
  const resp = await fetch(`${API_BASE}/history?username=${username}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!resp.ok) return [];
  return await resp.json();
};



export const askResearchAssistant = async (
  data: IPOAnalysis,
  history: { role: 'user' | 'model'; text: string }[],
  message: string,
  language: Language = 'zh'
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelName = "gemini-3-pro-preview";
  const targetLanguage = language === 'zh' ? 'Simplified Chinese' : 'English';

  const contents = history.map(h => ({
    role: h.role === 'user' ? 'user' : 'model',
    parts: [{ text: h.text }]
  }));

  const response = await ai.models.generateContent({
    model: modelName,
    contents: contents,
    config: {
      systemInstruction: `You are an institutional research analyst. Provide consistent, repeatable analysis for ${data.companyName}. In ${targetLanguage}.`,
      temperature: 0
    }
  });

  return response.text || "Assistant error";
};
