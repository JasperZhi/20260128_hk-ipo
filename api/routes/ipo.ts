
import express from 'express';
import { GoogleGenAI, Type } from "@google/genai";
import prisma from '../prisma.ts';

const router = express.Router();

// Schema definition (moved from frontend)
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

router.post('/analyze', async (req, res) => {
    const { companyName, subscriptionMultiple, language, username } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ message: "API Key not configured on server" });
    }

    try {
        const user = await prisma.user.findUnique({ where: { username: username || '' } });
        if (!user) return res.status(401).json({ message: "User not identified" });

        // Usage limit check
        if (!user.isPremium && user.usageCount >= 3) {
            return res.status(403).json({ message: "Usage limit reached" });
        }

        const ai = new GoogleGenAI({ apiKey });
        const modelName = "gemini-1.5-pro";
        const targetLanguage = language === 'zh' ? 'Simplified Chinese' : 'English';

        const prompt = `
            TASK: INSTITUTIONAL RESEARCH SYNTHESIS PRO
            ENTITY: "${companyName}". 
            USER PARAMETER - SUBSCRIPTION MULTIPLE: ${subscriptionMultiple || 'Latest Market Estimate'}
            
            SYSTEM INSTRUCTIONS (DETERMINISM FIRST):
            1. STRICT REPRODUCIBILITY: Your output must be clinical, factual, and deterministic.
            2. GROUNDING: Mandatory Google Search for official filings (HKEX Prospectus/PHIP). Rely ONLY on public disclosures.
            3. PARAMETER WEIGHT: Use the "${subscriptionMultiple}" value as the primary anchor for Liquidity Risk and Scenarios modeling. 
            4. HKEX RULES: Apply standard HKEX clawback rules (10x-50x -> 30%, 50x-100x -> 40%, 100x+ -> 50%) based on the multiple.
            5. LANGUAGE: Respond entirely in ${targetLanguage}.
        `;

        const response = await ai.models.generateContent({
            model: modelName,
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                tools: [{ googleSearch: {} } as any],
                temperature: 0,
                responseMimeType: "application/json",
                responseSchema: ipoAnalysisSchema as any
            }
        });

        const analysis = JSON.parse(response.text);

        // Save to User Analyses History
        await prisma.analysis.create({
            data: {
                companyName: analysis.companyName,
                stockCode: analysis.stockCode,
                data: JSON.stringify(analysis),
                subscription: subscriptionMultiple,
                userId: user.id
            }
        });

        // Increment usage count
        await prisma.user.update({
            where: { id: user.id },
            data: { usageCount: { increment: 1 } }
        });

        // Log Success
        await prisma.log.create({
            data: {
                username: user.username,
                action: 'SEARCH_SUCCESS',
                details: `Successfully analyzed ${analysis.companyName}`,
                userId: user.id
            }
        });

        res.json(analysis);
    } catch (error: any) {
        console.error("Analysis Error:", error);
        res.status(500).json({ message: error.message || "Synthesis failed" });
    }
});

// Fetch user history
router.get('/history', async (req, res) => {
    const username = req.query.username as string;
    if (!username) return res.status(400).send();

    try {
        const user = await prisma.user.findUnique({
            where: { username },
            include: { analyses: { orderBy: { createdAt: 'desc' }, take: 20 } }
        });

        if (!user) return res.status(404).send();

        const history = user.analyses.map(a => JSON.parse(a.data));
        res.json(history);
    } catch (e) {
        res.status(500).send();
    }
});

export default router;
