'use client';

import { useState, useEffect } from 'react';
import { suggestRelevantContent } from '@/ai/flows/smart-suggestion-tool';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Loader2, Lightbulb } from 'lucide-react';
import Link from 'next/link';

interface SmartSuggestionsProps {
  currentUrl: string;
}

export default function SmartSuggestions({ currentUrl }: SmartSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        const response = await suggestRelevantContent({ currentUrl });
        setSuggestions(response.suggestions);
      } catch (error) {
        console.error("Failed to fetch smart suggestions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [currentUrl]);

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-primary">
          <Lightbulb className="h-5 w-5 text-accent" />
          <span>Related Content</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm text-muted-foreground hover:text-accent transition-colors">
                {/* This assumes suggestions are titles and not links. A real implementation might need a search to find the correct link. */}
                <Link href="/blog">{suggestion}</Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
