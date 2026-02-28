import { useState } from 'react';
import EducationTopicCard from '../components/EducationTopicCard';
import { educationalTopics } from '../data/educationalContent';
import { BookOpen } from 'lucide-react';

export default function Education() {
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(educationalTopics[0].id);

  const handleSelect = (id: string) => {
    setSelectedTopicId(prev => prev === id ? null : id);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Health Education</h1>
          <p className="text-muted-foreground mt-1">
            Science-based information about reproductive health, fertility, and your menstrual cycle.
          </p>
        </div>
      </div>

      {/* Hero image */}
      <div className="relative rounded-3xl overflow-hidden mb-8 h-40 md:h-52">
        <img
          src="/assets/generated/hero-bloom.dim_800x400.png"
          alt="Reproductive health education"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent flex items-center px-8">
          <div>
            <p className="text-xs font-medium text-primary uppercase tracking-widest mb-1">Knowledge is power</p>
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Understand your body
            </h2>
          </div>
        </div>
      </div>

      {/* Topics */}
      <div className="space-y-4">
        {educationalTopics.map(topic => (
          <EducationTopicCard
            key={topic.id}
            topic={topic}
            isSelected={selectedTopicId === topic.id}
            onSelect={() => handleSelect(topic.id)}
          />
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-8 rounded-xl bg-secondary/60 p-4">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Medical Disclaimer:</strong> The information provided in this section is for educational purposes only and is not intended as medical advice. Always consult a qualified healthcare provider for diagnosis, treatment, and personalized medical guidance.
        </p>
      </div>
    </div>
  );
}
