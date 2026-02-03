import { AgencyInterface } from "@/components/ad-agency/agency-interface";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <AgencyInterface />

        <footer className="fixed bottom-4 left-0 right-0 text-center text-xs text-muted-foreground pointer-events-none">
          <p>AI Agentic Systems • Vertical AI Demo</p>
        </footer>
      </div>
    </main>
  );
}
