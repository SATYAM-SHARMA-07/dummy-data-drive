import { useState } from "react";
import { Building2, Landmark, Shield, Rocket, ArrowLeft, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { knowledgeCategories, type KnowledgeCategory } from "@/data/dummy";

const iconMap: Record<string, React.ElementType> = {
  Building2, Landmark, Shield, Rocket,
};

const KnowledgePage = () => {
  const [selected, setSelected] = useState<KnowledgeCategory | null>(null);

  if (selected) {
    return (
      <div className="space-y-4 px-4 pt-4">
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-1 text-sm text-primary font-medium"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="text-xl font-bold">{selected.title}</h1>
        <div className="space-y-3">
          {selected.articles.map((article) => (
            <Card key={article.id} className="p-4">
              <h3 className="text-sm font-semibold">{article.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{article.summary}</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" /> {article.readTime} read
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4 pt-4">
      <h1 className="text-2xl font-bold text-primary">Knowledge Hub</h1>
      <p className="text-sm text-muted-foreground">Learn everything you need to start your company</p>
      <div className="grid grid-cols-2 gap-3">
        {knowledgeCategories.map((cat) => {
          const Icon = iconMap[cat.icon] || Building2;
          return (
            <Card
              key={cat.id}
              className="flex cursor-pointer flex-col items-center justify-center gap-2 p-6 text-center transition-colors hover:bg-muted/50"
              onClick={() => setSelected(cat)}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${cat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-semibold">{cat.title}</h3>
              <p className="text-xs text-muted-foreground">{cat.articles.length} articles</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default KnowledgePage;
