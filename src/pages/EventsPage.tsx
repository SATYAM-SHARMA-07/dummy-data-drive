import { useState } from "react";
import { CalendarDays, Clock, Radio } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { masterclassEvents } from "@/data/dummy";

const EventsPage = () => {
  const [registered, setRegistered] = useState<Set<string>>(new Set());

  const toggleRegister = (id: string) => {
    setRegistered((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const liveEvent = masterclassEvents.find((e) => e.live);
  const upcoming = masterclassEvents.filter((e) => !e.live);

  return (
    <div className="space-y-4 px-4 pt-4">
      <h1 className="text-2xl font-bold text-primary">Events & Masterclasses</h1>

      {/* Live Event */}
      {liveEvent && (
        <Card className="overflow-hidden border-primary/30 bg-primary/5">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="gap-1 bg-destructive text-destructive-foreground">
                <Radio className="h-3 w-3 animate-pulse" /> LIVE
              </Badge>
            </div>
            <h2 className="text-base font-bold">{liveEvent.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">Speaker: {liveEvent.speaker}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {liveEvent.date}</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {liveEvent.time}</span>
            </div>
            <Button size="sm" className="mt-3 w-full">
              Join Now
            </Button>
          </div>
        </Card>
      )}

      {/* Upcoming */}
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Upcoming</h2>
      <div className="space-y-3">
        {upcoming.map((event) => {
          const isRegistered = registered.has(event.id);
          return (
            <Card key={event.id} className="p-4">
              <h3 className="text-sm font-semibold">{event.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">Speaker: {event.speaker}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {event.date}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {event.time}</span>
              </div>
              <Button
                size="sm"
                variant={isRegistered ? "secondary" : "default"}
                className="mt-3"
                onClick={() => toggleRegister(event.id)}
              >
                {isRegistered ? "Registered ✓" : "Register"}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default EventsPage;
