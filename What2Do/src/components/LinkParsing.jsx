import React, { useState } from 'react';
import { Card } from './Card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { processArticleUrl } from '@/utilities/urlParser';

const LinkParsing = () => {
  const [url, setUrl] = useState('');
  const [numberOfDays, setNumberOfDays] = useState('3');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await processArticleUrl(url, parseInt(numberOfDays));
      setResponse(result);
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
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Travel Article Analysis</h2>
        
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

          <div>
            <Select
              value={numberOfDays}
              onValueChange={setNumberOfDays}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select number of days" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(14)].map((_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {i + 1} {i === 0 ? 'day' : 'days'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
      </div>
    </Card>
  );
};

export default LinkParsing;