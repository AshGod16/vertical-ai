import { AgentContext, CreativeBrief, MarketResearch, VisualDirection, VideoProductionPlan } from "./types";
import { BRIEF_ENHANCEMENT_PROMPT, MARKET_RESEARCH_PROMPT, VISUAL_DIRECTION_PROMPT, VEO_VIDEO_PROMPT } from "./prompts";

// Mock delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class AdAgentService {

    async generateCampaign(userPrompt: string): Promise<AgentContext> {
        // initialize context
        const context: AgentContext = {
            id: crypto.randomUUID(),
            userPrompt,
            currentStage: "analyzing",
            artifacts: {}
        };

        try {
            // 1. Analyze / Brief Enhancement
            context.currentStage = "analyzing";
            // In a real app, calls LLM with BRIEF_ENHANCEMENT_PROMPT
            await delay(1500);
            context.brief = this.mockBrief(userPrompt);

            // 2. Market Research
            context.currentStage = "researching";
            // Calls LLM with MARKET_RESEARCH_PROMPT
            await delay(2000);
            context.research = this.mockResearch(context.brief);

            // 3. Visual Direction
            context.currentStage = "visualizing";
            // Calls LLM with VISUAL_DIRECTION_PROMPT
            await delay(2000);
            context.visuals = this.mockVisuals(context.brief, context.research);

            // Simulate Image Generation (Nano Banana)
            context.artifacts.referenceImageUrl = "/api/placeholder/image"; // In real app, call generation API

            // 4. Video Production Plan
            context.currentStage = "planning";
            await delay(1500);
            context.production = this.mockProduction(context.brief, context.visuals);

            // 5. Video Generation (Veo 3)
            context.currentStage = "generating";
            await delay(3000); // Veo takes time
            context.artifacts.videoUrl = "/api/placeholder/video"; // In real app, call Veo API

            context.currentStage = "completed";
            return context;

        } catch (error) {
            context.currentStage = "failed";
            context.error = error instanceof Error ? error.message : "Unknown error";
            return context;
        }
    }

    // --- MOCK GENERATORS (Replace with LLM Calls) ---

    private mockBrief(prompt: string): CreativeBrief {
        // Simple logic to extract potential product name or default
        const words = prompt.split(" ");
        const product = words.length > 5 ? "Concept Brand" : prompt; // Very naive

        return {
            productName: "Lumina " + (words[0] || "X"),
            category: "Consumer Tech",
            targetAudience: "Urban professionals, 25-40, tech-savvy",
            coreMessage: "Experience the future today.",
            tone: ["Futuristic", "Sleek", "Premium"],
            constraints: ["10 seconds", "No dialogue"],
            narrativeAngle: "The seamless integration of technology into daily life."
        };
    }

    private mockResearch(brief: CreativeBrief): MarketResearch {
        return {
            competitors: ["Competitor A", "Global Corp B", "Startup C"],
            emotionalDrivers: ["Desire for status", "Fear of missing out", "Love of beauty"],
            brandArchetype: "The Magician",
            culturalContext: "Rising trend of minimalistic cyber-aesthetics in 2026.",
            audiencePersona: {
                age: "25-35",
                interests: ["AI", "Design", "Wellness"],
                painPoints: ["Complexity", "Ugly interfaces"]
            }
        };
    }

    private mockVisuals(brief: CreativeBrief, research: MarketResearch): VisualDirection {
        return {
            lighting: "Cinematic, high-contrast neon noir with soft fill.",
            colorPalette: ["#000000", "#FF00FF", "#00FFFF"],
            cameraLanguage: "Slow, steady dolly push-in to reveal the product.",
            pacing: "Slow",
            environment: "A futuristic Tokyo penthouse at night.",
            referenceImagePrompt: `Hyper-realistic product shot of ${brief.productName}, cinematic lighting, 8k resolution, shot on RED.`
        };
    }

    private mockProduction(brief: CreativeBrief, visuals: VisualDirection): VideoProductionPlan {
        return {
            videoPrompt: `Cinematic shot of ${brief.productName} in a ${visuals.environment}. The lighting is ${visuals.lighting}. Camera moves with a ${visuals.cameraLanguage}. Highly detailed, photorealistic, 4k.`,
            audioDirection: {
                musicStyle: "Ambient electronic, deep bass, futuristic.",
                sfx: ["Subtle hum", "City ambience"],
                voiceover: undefined
            },
            durationSeconds: 10
        };
    }
}
