import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { EducationTopic } from '../data/educationalContent';

interface EducationTopicCardProps {
  topic: EducationTopic;
  isSelected: boolean;
  onSelect: () => void;
}

const colorMap: Record<string, { bg: string; border: string; icon: string; heading: string }> = {
  rose: {
    bg: 'bg-rose-500/8',
    border: 'border-rose-500/20',
    icon: 'bg-rose-500/15 text-rose-600',
    heading: 'text-rose-700',
  },
  green: {
    bg: 'bg-emerald-500/8',
    border: 'border-emerald-500/20',
    icon: 'bg-emerald-500/15 text-emerald-600',
    heading: 'text-emerald-700',
  },
  amber: {
    bg: 'bg-amber-400/8',
    border: 'border-amber-400/20',
    icon: 'bg-amber-400/15 text-amber-600',
    heading: 'text-amber-700',
  },
  purple: {
    bg: 'bg-violet-400/8',
    border: 'border-violet-400/20',
    icon: 'bg-violet-400/15 text-violet-600',
    heading: 'text-violet-700',
  },
};

export default function EducationTopicCard({ topic, isSelected, onSelect }: EducationTopicCardProps) {
  const colors = colorMap[topic.color] || colorMap.rose;

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        isSelected ? `${colors.bg} ${colors.border} shadow-soft` : 'bg-card border-border hover:border-primary/30 hover:shadow-xs'
      }`}
    >
      {/* Header */}
      <button
        onClick={onSelect}
        className="w-full text-left p-5 flex items-start gap-4"
      >
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${colors.icon}`}>
          {topic.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-serif font-semibold text-base text-foreground">{topic.title}</h3>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{topic.summary}</p>
        </div>
        <div className="flex-shrink-0 mt-1">
          {isSelected ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isSelected && (
        <div className="px-5 pb-5 space-y-5 animate-fade-in">
          <div className="h-px bg-border" />
          {topic.sections.map((section, i) => (
            <div key={i}>
              <h4 className={`font-semibold text-sm mb-2 ${colors.heading}`}>{section.heading}</h4>
              <p className="text-sm text-foreground/80 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
