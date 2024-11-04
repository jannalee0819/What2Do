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

  const constructPrompt = (articleUrl) => {
    return `Please analyze this article from ${articleUrl} and extract the following travel-related information:
    1. Location(s) mentioned
    2. Suggested activities or attractions
    3. Best time to visit
    4. Estimated duration for activities
    5. Any specific tips or recommendations
    Please format the response in a structured way that would be useful for itinerary planning.`;
  };

  const fetchGPTResponse = async () => {
    setLoading(true);
    setError('');
    try {
      const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'user',
              content: constructPrompt(url)
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setResponse(data.choices[0].message.content);
      } else {
        setError(`Error: ${data.error?.message || 'Failed to process the article'}`);
      }
    } catch (err) {
      setError('Failed to fetch the API response. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }
    fetchGPTResponse();
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
            <h3 className="font-semibold mb-2">Extracted Information:</h3>
            <div className="whitespace-pre-wrap">{response}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LinkParsing;