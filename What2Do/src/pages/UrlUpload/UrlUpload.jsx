import React, { useState } from 'react';
import { ArrowLeft, Globe, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { processArticleUrl } from '../../utilities/urlParser';

export function UrlUpload() {
  const [url, setUrl] = useState('');
  const [days, setDays] = useState('3');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await processArticleUrl(url, parseInt(days));
      // Assuming you want to redirect to the trip view or profile after successful processing
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Failed to process URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b to-gray-100 from-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/profile" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Profile
          </Link>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 sm:p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Create Trip from Article
              </h1>
              <p className="text-gray-500 mb-6">
                Paste a URL to a travel article or blog post, and we'll help you create an itinerary.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* URL Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Article URL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com/travel-article"
                      required
                    />
                  </div>
                </div>

                {/* Days Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trip Duration
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      value={days}
                      onChange={(e) => setDays(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {[...Array(14)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i + 1 === 1 ? 'Day' : 'Days'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors
                    ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                      Processing Article...
                    </>
                  ) : (
                    'Create Trip'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Tips for best results:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Use articles that focus on a single destination or region</li>
              <li>• Ensure the article includes day-by-day activities or highlights</li>
              <li>• Choose content from travel blogs, guides, or itineraries</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UrlUpload;