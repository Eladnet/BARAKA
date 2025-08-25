
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress"; // Keep import even if not directly used for progress bar, might be useful.
import {
  Camera,
  Download,
  Instagram,
  Facebook,
  Linkedin,
  User,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Image as ImageIcon,
  Eye,
  Scan
} from "lucide-react";
// InvokeLLM is removed as per the outline's simulation
// import { InvokeLLM } from "@/api/integrations"; 

export default function ProfileImageExtractor({ leadData, onImageExtracted }) {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedImages, setExtractedImages] = useState(null); // Changed to null for initial state
  const [extractionCost] = useState(0.15); // Cost for image extraction
  const [userBalance, setUserBalance] = useState(50.00);
  const [showConfirmation, setShowConfirmation] = useState(false);
  // progress, currentStep, error states removed as LLM integration is simulated out

  const handleImageExtraction = async () => {
    if (!leadData?.first_name) {
      alert('Missing basic data to search for images (e.g., first name).');
      return;
    }
    if (userBalance < extractionCost) {
      alert(`Insufficient balance. You need $${extractionCost.toFixed(2)} but have $${userBalance.toFixed(2)}`);
      return;
    }

    setShowConfirmation(true);
  };

  const confirmExtraction = async () => {
    setShowConfirmation(false);
    setIsExtracting(true);
    setExtractedImages(null); // Clear previous results

    try {
      // Simulate image extraction process
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate delay

      const mockExtractedImages = [
        {
          image_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b5e5?w=150',
          platform: 'instagram',
          quality_score: 95,
          face_detected: true,
          recommended_for_id: true,
          extracted_features: ['professional_photo', 'clear_facial_features', 'high_resolution']
        },
        {
          image_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
          platform: 'facebook',
          quality_score: 87,
          face_detected: true,
          recommended_for_id: false,
          extracted_features: ['casual_photo', 'good_lighting', 'smiling']
        },
        {
          image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
          platform: 'linkedin',
          quality_score: 92,
          face_detected: true,
          recommended_for_id: true,
          extracted_features: ['professional_headshot', 'business_attire', 'high_quality', 'formal']
        },
        {
          image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
          platform: 'twitter',
          quality_score: 78,
          face_detected: false, // Example of no face detected
          recommended_for_id: false,
          extracted_features: ['blurred_background', 'distance_shot']
        }
      ];

      setExtractedImages(mockExtractedImages);
      setUserBalance(prev => prev - extractionCost); // Deduct cost

      if (onImageExtracted) {
        onImageExtracted(mockExtractedImages);
      }

    } catch (error) {
      console.error('Image extraction failed:', error);
      alert('Image extraction failed. Please try again.');
    }
    setIsExtracting(false);
  };

  // getPlatformIcon and getPlatformColor remain relevant for rendering mock data
  const getPlatformIcon = (platform) => {
    const platformLower = platform?.toLowerCase() || '';
    if (platformLower.includes('instagram')) return Instagram;
    if (platformLower.includes('facebook')) return Facebook;
    if (platformLower.includes('linkedin')) return Linkedin;
    if (platformLower.includes('twitter')) return Scan; // Using Scan for Twitter as no specific Twitter icon is imported
    return User;
  };

  const getPlatformColor = (platform) => {
    const platformLower = platform?.toLowerCase() || '';
    if (platformLower.includes('instagram')) return 'text-pink-400';
    if (platformLower.includes('facebook')) return 'text-blue-400';
    if (platformLower.includes('linkedin')) return 'text-indigo-400';
    if (platformLower.includes('twitter')) return 'text-blue-300';
    return 'text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Header with Balance */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Camera className="w-5 h-5 text-pink-400" />
          Profile Image Extraction
        </h3>
        <div className="text-sm">
          <span className="text-slate-400">Balance: </span>
          <span className="text-emerald-400 font-bold">${userBalance.toFixed(2)}</span>
        </div>
      </div>

      {/* Pricing Info */}
      <div className="p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg border border-pink-500/30">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-medium mb-1">Smart Image Extraction</h4>
            <p className="text-pink-200 text-sm">AI-powered profile photo collection and analysis</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-pink-300">${extractionCost.toFixed(2)}</div>
            <div className="text-xs text-slate-400">per extraction</div>
          </div>
        </div>
      </div>

      {/* Target Info & Extraction Button */}
      {/* This section replaces the initial state card content from the original file */}
      {extractedImages === null && !isExtracting && ( // Only show this if no extraction has happened yet
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Target:</span>
                <span className="text-white ml-2">{leadData.first_name} {leadData.last_name}</span>
              </div>
              <div>
                <span className="text-slate-400">Instagram:</span>
                <span className="text-pink-300 ml-2">{leadData.instagram_handle || 'Not available'}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/50">
              <h5 className="text-white font-medium mb-3">Extraction Features:</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2 text-pink-200">
                  <CheckCircle className="w-4 h-4" />
                  Multi-platform Scan
                </div>
                <div className="flex items-center gap-2 text-pink-200">
                  <CheckCircle className="w-4 h-4" />
                  Face Detection
                </div>
                <div className="flex items-center gap-2 text-pink-200">
                  <CheckCircle className="w-4 h-4" />
                  Quality Assessment
                </div>
                <div className="flex items-center gap-2 text-pink-200">
                  <CheckCircle className="w-4 h-4" />
                  ID Photo Recommendation
                </div>
              </div>
            </div>

            <Button
              onClick={handleImageExtraction}
              disabled={isExtracting || userBalance < extractionCost || !leadData?.first_name}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 mt-6"
            >
              {isExtracting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Extracting Images...
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 mr-2" />
                  Extract Profile Images (${extractionCost.toFixed(2)})
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-pink-500/30 p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-white mb-4">Confirm Image Extraction</h3>
            <div className="space-y-4">
              <p className="text-slate-300">
                This will extract profile images for <strong>{leadData.first_name} {leadData.last_name}</strong> for <strong>${extractionCost.toFixed(2)}</strong>.
              </p>
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Current Balance:</span>
                  <span className="text-emerald-400">${userBalance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Extraction Cost:</span>
                  <span className="text-red-400">-${extractionCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-700 mt-2">
                  <span className="text-white">Remaining Balance:</span>
                  <span className="text-emerald-400">${(userBalance - extractionCost).toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
                className="flex-1 border-slate-600 text-slate-300"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmExtraction}
                className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600"
              >
                Confirm & Pay
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Extraction in progress (simple spinner) */}
      {isExtracting && (
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-white">Extracting images...</p>
          <p className="text-slate-400 text-sm mt-2">This may take a few moments.</p>
        </div>
      )}

      {/* Extraction Results */}
      {extractedImages !== null && !isExtracting && ( // Show results if extractedImages is not null and not extracting
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-pink-500/30 pb-2">
            <h5 className="text-white font-medium">Extracted Images</h5>
            <Badge className="bg-pink-500/20 text-pink-300">
              {extractedImages.length} images found
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {extractedImages.map((image, index) => {
              const PlatformIcon = getPlatformIcon(image.platform);
              const platformColor = getPlatformColor(image.platform);

              return (
                <Card key={index} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                  <div className="flex-shrink-0 mb-3">
                    <div className="w-full aspect-square bg-slate-800 rounded-lg border border-slate-600 overflow-hidden flex items-center justify-center">
                      {image.image_url ? (
                        <img
                          src={image.image_url}
                          alt={`Profile ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center" style={{ display: image.image_url ? 'none' : 'flex' }}>
                        <User className="w-12 h-12 text-slate-600" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <PlatformIcon className={`w-4 h-4 ${platformColor}`} />
                        <span className="text-white font-medium capitalize">{image.platform}</span>
                      </div>
                      {image.recommended_for_id && (
                        <Badge className="bg-emerald-500/20 text-emerald-300">
                          ⭐ Recommended
                        </Badge>
                      )}
                    </div>

                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Quality:</span>
                        <span className="text-white">{image.quality_score}/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Face Detected:</span>
                        <span className={image.face_detected ? "text-emerald-400" : "text-red-400"}>
                          {image.face_detected ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>

                    {image.extracted_features && image.extracted_features.length > 0 && (
                      <div>
                        <span className="text-slate-400 text-sm">Features:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {image.extracted_features.map((feature, i) => (
                            <Badge key={i} className="text-xs bg-slate-700/50 text-slate-300">
                              {feature.replace(/_/g, ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs border-slate-600 text-slate-300 hover:bg-slate-700"
                        onClick={() => window.open(image.image_url, '_blank')}
                        disabled={!image.image_url}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs border-slate-600 text-slate-300 hover:bg-slate-700"
                        onClick={() => {
                          if (image.image_url) {
                            const link = document.createElement('a');
                            link.href = image.image_url;
                            link.download = `profile_image_${index + 1}.jpg`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }
                        }}
                        disabled={!image.image_url}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Cost Summary */}
          <div className="mt-4 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Images extracted on:</span>
              <span className="text-white">{new Date().toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-slate-400">Cost charged:</span>
              <span className="text-red-400 font-bold">${extractionCost.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Scan className="w-4 h-4 text-green-400" />
              <span className="text-green-300 text-sm font-medium">Extraction Completed Successfully</span>
            </div>
            <p className="text-green-200 text-xs mt-1">
              Profile images have been extracted.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
