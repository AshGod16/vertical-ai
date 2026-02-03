import { NextResponse } from "next/server";
import { AdAgentService } from "@/lib/agent/service";

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        const service = new AdAgentService();
        // In a real streaming implementation, we would stream the updates.
        // Here we wait for the mock process to complete (~10s)
        const result = await service.generateCampaign(prompt);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Agent Error:", error);
        return NextResponse.json({ error: "Failed to generate campaign" }, { status: 500 });
    }
}
