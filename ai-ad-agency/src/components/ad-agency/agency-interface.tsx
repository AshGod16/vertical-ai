"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Loader2, Sparkles, Play, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { cn } from "@/lib/utils"
// Import types
import { AgentContext } from "@/lib/agent/types";

type GenerationStage = "idle" | "analyzing" | "researching" | "visualizing" | "planning" | "generating" | "completed"

interface StageInfo {
    id: GenerationStage
    label: string
    description: string
    duration: number // ms (mock duration)
}

const STAGES: StageInfo[] = [
    { id: "analyzing", label: "Analyzing Prompt", description: "Interpreting intent, audience, and constraints...", duration: 2000 },
    { id: "researching", label: "Market Research", description: "Analyzing competitors, brand archetypes, and cultural context...", duration: 2500 },
    { id: "visualizing", label: "Visual Direction", description: "Generating reference imagery and defining cinematic style...", duration: 2500 },
    { id: "planning", label: "Video Planning", description: "Drafting shot list and audio direction...", duration: 2000 },
    { id: "generating", label: "Video Production", description: "Producing 10s cinematic advertisement with Google Veo 3...", duration: 4000 },
]

export function AgencyInterface() {
    const [prompt, setPrompt] = React.useState("")
    const [stage, setStage] = React.useState<GenerationStage>("idle")
    const [progress, setProgress] = React.useState(0)
    const [currentStageIndex, setCurrentStageIndex] = React.useState(0)
    const [agentData, setAgentData] = React.useState<AgentContext | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) return
        setStage("analyzing")
        setCurrentStageIndex(0)
        setProgress(0)
        setAgentData(null);

        // Call API in background
        fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt })
        }).then(res => res.json())
            .then(data => setAgentData(data))
            .catch(err => console.error(err));
    }

    // Mock generation process
    React.useEffect(() => {
        if (stage === "idle" || stage === "completed") return

        const currentStage = STAGES[currentStageIndex]
        // If we run out of mock stages but data isn't ready, we might hang? 
        // For now, let's assume API is faster or roughly same time.
        if (!currentStage) {
            if (agentData) {
                setStage("completed")
            } else {
                // Wait for data
            }
            return
        }

        // Update stage ID
        setStage(currentStage.id)

        const startTime = Date.now()
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime
            const stageProgress = Math.min((elapsed / currentStage.duration) * 100, 100)

            // Calculate total progress based on current stage
            const totalProgress = ((currentStageIndex * 100) + stageProgress) / STAGES.length
            setProgress(totalProgress)

            if (elapsed >= currentStage.duration) {
                clearInterval(interval)
                if (currentStageIndex < STAGES.length - 1) {
                    setCurrentStageIndex(prev => prev + 1)
                } else {
                    // Finished animations. Check if data is ready.
                    if (agentData) {
                        setStage("completed")
                        setProgress(100)
                    } else {
                        // Keep waiting/spinning at 99%
                        setProgress(99)
                    }
                }
            }
        }, 50)

        return () => clearInterval(interval)
    }, [stage, currentStageIndex, agentData])

    // If data arrives after animation finished
    React.useEffect(() => {
        if (agentData && progress >= 99 && stage !== "completed" && stage !== "idle") {
            setStage("completed")
            setProgress(100)
        }
    }, [agentData, progress, stage])

    return (
        <div className="w-full max-w-5xl mx-auto min-h-[80vh] flex flex-col justify-center py-10">
            <AnimatePresence mode="wait">
                {stage === "idle" ? (
                    <motion.div
                        key="input"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                    >
                        <div className="space-y-2 text-center">
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                                AI Ad Agency.
                            </h1>
                            <p className="text-xl text-muted-foreground font-light">
                                Turn a simple idea into a production-grade video ad.
                            </p>
                        </div>

                        <Card className="p-1 border-input/40 shadow-xl overflow-hidden bg-background/50 backdrop-blur-sm">
                            <div className="relative">
                                <Textarea
                                    placeholder="Describe your ad concept (e.g., 'A futuristic sneaker commercial set in Tokyo at night, neon lights, fast paced, energetic music')..."
                                    className="min-h-[120px] resize-none border-0 text-lg p-6 focus-visible:ring-0 shadow-none bg-transparent"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault()
                                            handleGenerate()
                                        }
                                    }}
                                />
                                <div className="flex justify-between items-center px-4 pb-4">
                                    <span className="text-xs text-muted-foreground">
                                        Powered by Google Veo 3 & Nano Banana
                                    </span>
                                    <Button
                                        onClick={handleGenerate}
                                        disabled={!prompt.trim()}
                                        size="lg"
                                        className="rounded-full px-8 transition-all hover:scale-105"
                                    >
                                        Generate <Sparkles className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ) : stage === "completed" && agentData ? (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-8 w-full"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-semibold tracking-tight">Campaign Data: {agentData.brief?.productName}</h2>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => window.print()}>Export Brief</Button>
                                <Button variant="ghost" onClick={() => { setPrompt(""); setStage("idle"); }}>
                                    Create Another
                                </Button>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Video Player Main Focus */}
                            <Card className="col-span-2 overflow-hidden border-border/40 shadow-2xl bg-black">
                                <AspectRatio ratio={16 / 9} className="bg-black relative group">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {/* Placeholder for video */}
                                        <div className="text-white/80 text-center space-y-4">
                                            <Play className="w-16 h-16 mx-auto opacity-50 group-hover:opacity-100 transition-opacity cursor-pointer text-white" />
                                            <p className="text-sm font-medium tracking-widest uppercase">Play Campaign Preview</p>
                                        </div>
                                    </div>
                                    {/* Overlay UI */}
                                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-white border border-white/10">
                                        Google Veo 3 Generated
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-white font-medium italic">"{agentData.production?.videoPrompt.substring(0, 120)}..."</p>
                                    </div>
                                </AspectRatio>
                            </Card>

                            {/* Sidebar Info */}
                            <div className="space-y-6">
                                {/* Reference Image */}
                                <Card className="p-4 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Visual Direction</h3>
                                        <span className="text-[10px] bg-secondary px-2 py-0.5 rounded text-muted-foreground">Nano Banana</span>
                                    </div>

                                    <AspectRatio ratio={4 / 3} className="bg-muted rounded-md overflow-hidden relative group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-slate-900 flex items-center justify-center p-4">
                                            <p className="text-white/70 text-center text-xs line-clamp-4 leading-relaxed">
                                                {agentData.visuals?.referenceImagePrompt}
                                            </p>
                                        </div>
                                    </AspectRatio>
                                    <div className="flex gap-2 flex-wrap">
                                        {agentData.visuals?.colorPalette.map(c => (
                                            <div key={c} className="w-6 h-6 rounded-full ring-1 ring-border" style={{ backgroundColor: c }} title={c} />
                                        ))}
                                    </div>
                                </Card>

                                {/* Campaign Details */}
                                <Card className="p-5 space-y-4">
                                    <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Strategy Brief</h3>

                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-xs text-muted-foreground block">Target Audience</span>
                                            <p className="text-sm font-medium">{agentData.research?.audiencePersona.age}, {agentData.brief?.targetAudience}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs text-muted-foreground block">Brand Archetype</span>
                                            <p className="text-sm">{agentData.research?.brandArchetype}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs text-muted-foreground block">Tagline</span>
                                            <p className="text-sm italic">"{agentData.brief?.coreMessage}"</p>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="processing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full max-w-2xl mx-auto space-y-12"
                    >
                        <div className="text-center space-y-4">
                            <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
                            <h2 className="text-2xl font-medium">Creating your campaign...</h2>
                        </div>

                        <div className="space-y-8">
                            <Progress value={progress} className="h-1" />

                            <div className="space-y-6">
                                {STAGES.map((s, idx) => {
                                    // Check if stage matches mock stage or data stage?
                                    // Using local 'stage' state which mocks progress
                                    const isCurrent = s.id === stage;
                                    const isCompleted = STAGES.findIndex(st => st.id === stage) > idx;

                                    return (
                                        <motion.div
                                            key={s.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0, transition: { delay: idx * 0.1 } }}
                                            className={cn(
                                                "flex items-start gap-4 transition-all duration-500",
                                                isCurrent ? "opacity-100 scale-105" : isCompleted ? "opacity-50" : "opacity-30 blur-[1px]"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors",
                                                isCurrent ? "border-primary bg-primary text-primary-foreground" : isCompleted ? "border-primary/50 text-primary/50" : "border-muted-foreground/30 text-muted-foreground/30"
                                            )}>
                                                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                                            </div>
                                            <div className="space-y-1 pt-1">
                                                <h3 className="font-medium leading-none">{s.label}</h3>
                                                <p className="text-sm text-muted-foreground">{s.description}</p>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
