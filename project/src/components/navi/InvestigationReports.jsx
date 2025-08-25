import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  Share, 
  Mail,
  Printer,
  Eye,
  Star,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

export default function InvestigationReports({ profile }) {
  if (!profile) return null;

  const reportSections = [
    {
      title: 'Executive Summary',
      status: 'completed',
      items: [
        'Profile Overview & Key Metrics',
        'Quality Score Assessment',
        'Financial Potential Analysis',
        'Recommendation Summary'
      ]
    },
    {
      title: 'Detailed Profile Analysis',
      status: 'completed',
      items: [
        'Demographic Information',
        'Social Media Presence',
        'Content Analysis',
        'Engagement Patterns'
      ]
    },
    {
      title: 'Visual Intelligence Report',
      status: 'completed',
      items: [
        'Content Category Breakdown',
        'Visual Quality Assessment',
        'Brand Mentions & Luxury Indicators',
        'Location Analysis'
      ]
    },
    {
      title: 'Social Network Mapping',
      status: 'completed',
      items: [
        'Connection Quality Analysis',
        'Influencer Network Assessment',
        'Mutual Connections Report',
        'Network Reach Potential'
      ]
    },
    {
      title: 'Financial Prediction',
      status: 'completed',
      items: [
        'Spending Capacity Assessment',
        'Revenue Potential Calculation',
        'Conversion Probability',
        'Lifetime Value Estimation'
      ]
    },
    {
      title: 'Marketing Recommendations',
      status: 'completed',
      items: [
        'Approach Strategy',
        'Message Templates',
        'Optimal Timing',
        'Offer Recommendations'
      ]
    }
  ];

  const reportStats = {
    totalPages: 24,
    completionRate: 100,
    confidenceScore: 87,
    lastUpdated: new Date().toLocaleDateString()
  };

  const handleDownloadPDF = () => {
    // In a real app, this would generate and download the PDF
    alert('PDF Report generation started. You will receive an email when ready.');
  };

  const handleEmailReport = () => {
    // In a real app, this would send the report via email
    alert('Report will be sent to your email address.');
  };

  const handleShareReport = () => {
    // In a real app, this would create a shareable link
    alert('Shareable link copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Report Overview */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" />
              Investigation Report: {profile.username}
            </CardTitle>
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{reportStats.totalPages}</div>
              <div className="text-sm text-gray-600">Total Pages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{reportStats.completionRate}%</div>
              <div className="text-sm text-gray-600">Complete</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{reportStats.confidenceScore}%</div>
              <div className="text-sm text-gray-600">Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-gray-900">{reportStats.lastUpdated}</div>
              <div className="text-sm text-gray-600">Last Updated</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={handleDownloadPDF}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button 
              onClick={handleEmailReport}
              variant="outline"
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email Report
            </Button>
            <Button 
              onClick={handleShareReport}
              variant="outline"
              className="border-green-200 text-green-600 hover:bg-green-50"
            >
              <Share className="w-4 h-4 mr-2" />
              Share Link
            </Button>
            <Button 
              variant="outline"
              className="border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Sections */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">Report Contents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportSections.map((section, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{section.title}</h3>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {section.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Preview */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-500" />
            Report Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">NAVI Intelligence Report</h2>
              <p className="text-gray-600">Profile Investigation: {profile.username}</p>
              <p className="text-sm text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
            </div>

            <div className="space-y-4">
              <div className="border-l-4 border-indigo-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-2">Executive Summary</h3>
                <p className="text-gray-700 text-sm">
                  {profile.fullName} ({profile.username}) demonstrates high potential for premium nightlife engagement 
                  with a quality score of {profile.qualityScore}% and {profile.financialPotential.toLowerCase()} financial capacity.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-2">Key Findings</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  {profile.keyInsights?.slice(0, 3).map((insight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-2">Recommendations</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  {profile.recommendations?.slice(0, 2).map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="text-center mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                This is a preview. Download the full PDF report for complete analysis.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Actions */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">Report Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={handleDownloadPDF}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 h-auto p-4"
            >
              <div className="text-center">
                <Download className="w-6 h-6 mx-auto mb-2" />
                <div className="font-medium">Download Full Report</div>
                <div className="text-xs opacity-90">PDF • {reportStats.totalPages} pages</div>
              </div>
            </Button>

            <Button 
              onClick={handleEmailReport}
              variant="outline"
              className="border-blue-200 text-blue-600 hover:bg-blue-50 h-auto p-4"
            >
              <div className="text-center">
                <Mail className="w-6 h-6 mx-auto mb-2" />
                <div className="font-medium">Email Report</div>
                <div className="text-xs opacity-70">Send to your inbox</div>
              </div>
            </Button>

            <Button 
              onClick={handleShareReport}
              variant="outline"
              className="border-green-200 text-green-600 hover:bg-green-50 h-auto p-4"
            >
              <div className="text-center">
                <Share className="w-6 h-6 mx-auto mb-2" />
                <div className="font-medium">Share Report</div>
                <div className="text-xs opacity-70">Generate shareable link</div>
              </div>
            </Button>

            <Button 
              variant="outline"
              className="border-gray-200 text-gray-600 hover:bg-gray-50 h-auto p-4"
            >
              <div className="text-center">
                <Star className="w-6 h-6 mx-auto mb-2" />
                <div className="font-medium">Save to Favorites</div>
                <div className="text-xs opacity-70">Quick access later</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}