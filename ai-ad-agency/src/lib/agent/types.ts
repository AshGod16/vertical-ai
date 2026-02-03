export type AgentStage = "analyzing" | "researching" | "visualizing" | "planning" | "generating" | "completed" | "failed";

export interface CreativeBrief {
    productName: string;
    category: string;
    targetAudience: string;
    coreMessage: string;
    tone: string[];
    constraints: string[];
    narrativeAngle: string;
}

export interface MarketResearch {
    competitors: string[];
    emotionalDrivers: string[];
    brandArchetype: string;
    culturalContext: string;
    audiencePersona: {
        age: string;
        interests: string[];
        painPoints: string[];
    };
}

export interface VisualDirection {
    lighting: string;
    colorPalette: string[];
    cameraLanguage: string; // e.g., "Handheld", "Dolly Zoom", "Static"
    pacing: "Fast" | "Slow" | "Dynamic" | "Meditative";
    environment: string;
    referenceImagePrompt: string; // For Nano Banana
}

export interface VideoProductionPlan {
    videoPrompt: string; // For Veo 3
    audioDirection: {
        musicStyle: string;
        sfx: string[];
        voiceover?: string;
    };
    durationSeconds: number;
}

export interface AgentContext {
    id: string;
    userPrompt: string;
    currentStage: AgentStage;
    brief?: CreativeBrief;
    research?: MarketResearch;
    visuals?: VisualDirection;
    production?: VideoProductionPlan; // fixed typo
    artifacts: {
        referenceImageUrl?: string;
        videoUrl?: string;
    };
    error?: string;
}
