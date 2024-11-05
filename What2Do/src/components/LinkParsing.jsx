import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LinkParsing = () => {
  const [url, setUrl] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const constructPrompt = (articleContent) => {
    return `Based on this article content: "${articleContent}", please create a detailed travel itinerary. The response must be in valid JSON format with the following structure:
    {
      "tripName": "string",
      "itinerary": [
        {
          "day": "string",
          "location": "string",
          "description": "string with newline characters (\\n) for formatting"
        }
      ]
    }
    Include all locations, activities, times, and recommendations from the article. Format times in 24-hour format (e.g., "14:00"). Make the description detailed with specific times and activities.`;
  };

  const fetchArticleContent = async (articleUrl) => {
    try {
      const response = await fetch('/api/fetch-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: articleUrl }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch article content');
      }
      
      const data = await response.json();
      return data.content;
    } catch (error) {
      throw new Error('Failed to fetch article content: ' + error.message);
    }
  };

  const fetchGPTResponse = async (articleContent) => {
    const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: constructPrompt(articleContent)
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to process the article');
    }

    return JSON.parse(data.choices[0].message.content);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const articleContent = await fetchArticleContent(url);
      const gptResponse = await fetchGPTResponse(articleContent);
      setResponse(gptResponse);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDescription = (description) => {
    return description.split('\n').map((line, index) => (
      <div key={index} className="ml-4">
        {line}
      </div>
    ));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Travel Article Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter article URL..."
              className="w-full"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Article...
              </>
            ) : (
              'Extract Travel Information'
            )}
          </Button>
        </form>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {response && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">{response.tripName}</h3>
            {response.itinerary.map((day, index) => (
              <div key={index} className="mb-4">
                <h4 className="font-semibold">Day {day.day} - {day.location}</h4>
                {formatDescription(day.description)}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LinkParsing;