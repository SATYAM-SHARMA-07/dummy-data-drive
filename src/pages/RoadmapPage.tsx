import { useState } from "react";
import { CheckCircle2, Circle, Clock, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { defaultRoadmapSteps, type RoadmapStep } from "@/data/dummy";
import { cn } from "@/lib/utils";

const statusConfig = {
  "not-started": { icon: Circle, label: "Not Started", badge: "outline" as const, color: "text-muted-foreground" },
  "in-progress": { icon: Clock, label: "In Progress", badge: "secondary" as const, color: "text-primary" },
  completed: { icon: CheckCircle2, label: "Completed", badge: "default" as const, color: "text-primary" },
};

const statusCycle: RoadmapStep["status"][] = ["not-started", "in-progress", "completed"];

const RoadmapPage = () => {
  const [steps, setSteps] = useState<RoadmapStep[]>(defaultRoadmapSteps);

  const completed = steps.filter((s) => s.status === "completed").length;
  const progress = Math.round((completed / steps.length) * 100);

  const cycleStatus = (id: string) => {
    setSteps((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const idx = statusCycle.indexOf(s.status);
        return { ...s, status: statusCycle[(idx + 1) % 3] };
      })
    );
  };

  return (
    <div className="space-y-4 px-4 pt-4">
      <h1 className="text-2xl font-bold text-primary">Your Roadmap</h1>

      {/* Progress */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-sm font-bold text-primary">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2.5" />
        <p className="mt-2 text-xs text-muted-foreground">
          {completed} of {steps.length} steps completed
        </p>
      </Card>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, i) => {
          const config = statusConfig[step.status];
          const Icon = config.icon;
          return (
            <Card
              key={step.id}
              className="flex cursor-pointer items-start gap-3 p-4 transition-colors hover:bg-muted/50"
              onClick={() => cycleStatus(step.id)}
            >
              <div className="flex flex-col items-center gap-1 pt-0.5">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full",
                    step.status === "completed"
                      ? "bg-primary text-primary-foreground"
                      : step.status === "in-progress"
                      ? "bg-secondary text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                {i < steps.length - 1 && <div className="h-4 w-0.5 bg-border" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">{step.title}</h3>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                <Badge variant={config.badge} className="mt-2 text-xs">
                  {config.label}
                </Badge>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RoadmapPage;
