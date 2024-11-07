// utilities/urlParser.js

import axios from 'axios';
import cheerio from 'cheerio';
import { addTrip } from './firebase_helper';

const cleanText = (text) => {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .trim();
};

const extractMainContent = ($) => {
  const contentSelectors = [
    'article',
    '[role="main"]',
    '.post-content',
    '.article-content',
    '.entry-content',
    'main',
    '#content'
  ];

  let content = '';
  
  for (const selector of contentSelectors) {
    const element = $(selector).first();
    if (element.length) {
      element.find('script, style, nav, header, footer, .ad').remove();
      content = element.text();
      if (content.length > 100) {
        break;
      }
    }
  }

  if (!content) {
    content = $('p').map((_, el) => $(el).text()).get().join('\n');
  }

  return cleanText(content);
};

const parseUrl = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const $ = cheerio.load(response.data);
    const content = extractMainContent($);

    if (content.length < 100) {
      throw new Error('Could not extract meaningful content from the URL');
    }

    return content;
  } catch (error) {
    throw new Error(`Failed to parse URL: ${error.message}`);
  }
};

const processWithGPT = async (content, numberOfDays) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{
          role: 'user',
          content: `Based on this article content: "${content}", please create a ${numberOfDays}-day itinerary. Format the response as a JSON object with this structure:
          {
            "tripName": "string",
            "itinerary": [
              {
                "day": "number",
                "location": "string",
                "description": "string with newline characters (\\n) for formatting"
              }
            ]
          }
          Make sure to spread the activities across exactly ${numberOfDays} days.`
        }],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to process with GPT');
    }

    const data = await response.json();
    const parsedResponse = JSON.parse(data.choices[0].message.content);

    // Convert to Firebase format
    const firebaseData = {
      link: content.substring(0, 100) + "...", // Store a preview of the content
      locations: parsedResponse.itinerary.map(item => ({
        day: parseInt(item.day),
        description: item.description,
        destination: item.location
      })),
      total_days: numberOfDays
    };

    // Store in Firebase
    await addTrip(firebaseData);

    return parsedResponse;
  } catch (error) {
    throw new Error('Failed to process with GPT: ' + error.message);
  }
};

export const processArticleUrl = async (url, numberOfDays = 3) => {
  try {
    const content = await parseUrl(url);
    const itinerary = await processWithGPT(content, numberOfDays);
    return itinerary;
  } catch (error) {
    throw new Error(`Error processing article: ${error.message}`);
  }
};