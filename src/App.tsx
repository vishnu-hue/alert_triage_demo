import React, { useState } from 'react';
import { Bell, AlertTriangle, CheckCircle, Clock, ChevronRight, Filter, Search, ExternalLink, Shield, User, Database } from 'lucide-react';


interface Alert {
  id: string;
  title: string;
  severity: string;
  resource: string;
  account: string;
  time: string;
  status: string;
  description: string;
  impact: string;
  affectedResources: number;
  recommendation: string;
}

const AlertTriageWireframe = () => {
  const [currentScreen, setCurrentScreen] = useState<string>('queue');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const alerts: Alert[] = [
    {
      id: 'ALT-2847',
      title: 'S3 Bucket Publicly Accessible',
      severity: 'critical',
      resource: 'customer-data-backup',
      account: 'prod-us-east-1',
      time: '5 min ago',
      status: 'new',
      description: 'S3 bucket has public read access enabled',
      impact: 'Potential data exposure of customer PII',
      affectedResources: 1,
      recommendation: 'Remove public access and enable bucket encryption'
    },
    {
      id: 'ALT-2846',
      title: 'IAM User with Admin Access Unused',
      severity: 'high',
      resource: 'deploy-bot-user',
      account: 'prod-us-east-1',
      time: '2 hours ago',
      status: 'investigating',
      description: 'IAM user has not been used in 90+ days',
      impact: 'Excessive permissions create attack surface',
      affectedResources: 1,
      recommendation: 'Disable or delete unused IAM user'
    },
    {
      id: 'ALT-2845',
      title: 'Security Group Allows 0.0.0.0/0',
      severity: 'medium',
      resource: 'web-server-sg',
      account: 'staging-eu-west-1',
      time: '4 hours ago',
      status: 'new',
      description: 'Security group allows unrestricted inbound traffic',
      impact: 'Potential unauthorized access to instances',
      affectedResources: 3,
      recommendation: 'Restrict ingress to specific IP ranges'
    }
  ];

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-100 text-red-800 border-red-300',
      high: 'bg-orange-100 text-orange-800 border-orange-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      low: 'bg-blue-100 text-blue-800 border-blue-300'
    };
    return colors[severity] || colors.medium;
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { text: string; color: string }> = {
      new: { text: 'New', color: 'bg-purple-100 text-purple-800' },
      investigating: { text: 'Investigating', color: 'bg-blue-100 text-blue-800' },
      resolved: { text: 'Resolved', color: 'bg-green-100 text-green-800' },
      ignored: { text: 'Ignored', color: 'bg-gray-100 text-gray-800' }
    };
    return badges[status] || badges.new;
  };

  const QueueScreen = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Security Alerts</h1>
            <p className="text-sm text-gray-500 mt-1">Monitor and triage cloud security findings</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Filter size={16} />
              Filter
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Create Rule
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="text-2xl font-bold text-red-700">3</div>
            <div className="text-xs text-red-600">Critical</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="text-2xl font-bold text-orange-700">12</div>
            <div className="text-xs text-orange-600">High</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="text-2xl font-bold text-yellow-700">28</div>
            <div className="text-xs text-yellow-600">Medium</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="text-2xl font-bold text-gray-700">2.4h</div>
            <div className="text-xs text-gray-600">Avg Response Time</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-50 border-b px-6 py-3 flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search alerts by resource, account, or keyword..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <select className="px-3 py-2 border border-gray-300 rounded-lg bg-white">
          <option>All Severities</option>
          <option>Critical</option>
          <option>High</option>
        </select>
        <select className="px-3 py-2 border border-gray-300 rounded-lg bg-white">
          <option>All Statuses</option>
          <option>New</option>
          <option>Investigating</option>
        </select>
      </div>

      {/* Alert List */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6 space-y-3">
          {alerts.map(alert => (
            <div
              key={alert.id}
              onClick={() => {
                setSelectedAlert(alert);
                setCurrentScreen('detail');
              }}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(alert.status).color}`}>
                      {getStatusBadge(alert.status).text}
                    </span>
                    <span className="text-xs text-gray-500">{alert.id}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{alert.title}</h3>
                  <div className="text-sm text-gray-600 mb-2">{alert.description}</div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Database size={14} />
                      {alert.resource}
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield size={14} />
                      {alert.account}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {alert.time}
                    </span>
                  </div>
                </div>
                <ChevronRight className="text-gray-400" size={20} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const DetailScreen = () => {
    const [activeTab, setActiveTab] = useState<string>('overview');

    if (!selectedAlert) return null;

    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4">
          <button
            onClick={() => setCurrentScreen('queue')}
            className="text-blue-600 hover:text-blue-700 text-sm mb-3 flex items-center gap-1"
          >
            ← Back to Queue
          </button>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(selectedAlert.severity)}`}>
                  {selectedAlert.severity.toUpperCase()}
                </span>
                <span className="text-sm text-gray-500">{selectedAlert.id}</span>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">{selectedAlert.title}</h1>
              <p className="text-sm text-gray-600">{selectedAlert.description}</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Assign to Me
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Mark Resolved
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b px-6">
          <div className="flex gap-6">
            {['overview', 'investigation', 'remediation'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 border-b-2 font-medium text-sm ${activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Impact Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertTriangle size={18} className="text-red-600" />
                    Impact Assessment
                  </h3>
                  <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
                    <p className="text-sm text-red-800">{selectedAlert.impact}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500 mb-1">Affected Resources</div>
                      <div className="font-semibold">{selectedAlert.affectedResources}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Data Classification</div>
                      <div className="font-semibold">Confidential</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Compliance Impact</div>
                      <div className="font-semibold">GDPR, SOC 2</div>
                    </div>
                  </div>
                </div>

                {/* Resource Details */}
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">Resource Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Resource Name</span>
                      <span className="font-medium">{selectedAlert.resource}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Account</span>
                      <span className="font-medium">{selectedAlert.account}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Resource Type</span>
                      <span className="font-medium">AWS S3 Bucket</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Owner</span>
                      <span className="font-medium">data-engineering@company.com</span>
                    </div>
                  </div>
                  <button className="mt-4 text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
                    View in AWS Console <ExternalLink size={14} />
                  </button>
                </div>

                {/* Timeline */}
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">Activity Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-600 mt-1.5"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Alert Created</div>
                        <div className="text-xs text-gray-500">5 minutes ago • System</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-gray-300 mt-1.5"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Public Access Enabled</div>
                        <div className="text-xs text-gray-500">2 hours ago • john.doe@company.com</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'investigation' && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">Investigation Steps</h3>
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input type="checkbox" className="mt-1" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">Verify public access configuration</div>
                        <div className="text-xs text-gray-500 mt-1">Check bucket policy and ACLs</div>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input type="checkbox" className="mt-1" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">Review access logs</div>
                        <div className="text-xs text-gray-500 mt-1">Check for unauthorized access attempts</div>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input type="checkbox" className="mt-1" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">Contact resource owner</div>
                        <div className="text-xs text-gray-500 mt-1">Verify if public access is intentional</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">Investigation Notes</h3>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                    rows={4}
                    placeholder="Add investigation findings, context, or notes..."
                  ></textarea>
                  <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                    Save Notes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'remediation' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <CheckCircle size={18} />
                    Recommended Action
                  </h3>
                  <p className="text-sm text-blue-800 mb-3">{selectedAlert.recommendation}</p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                    Apply Fix Automatically
                  </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">Manual Remediation Steps</h3>
                  <ol className="space-y-3 text-sm">
                    <li className="flex gap-3">
                      <span className="font-semibold">1.</span>
                      <div>
                        <div className="font-medium mb-1">Navigate to S3 Console</div>
                        <div className="text-gray-600">Open AWS Console and go to S3 service</div>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-semibold">2.</span>
                      <div>
                        <div className="font-medium mb-1">Select the bucket</div>
                        <div className="text-gray-600">Find and select {selectedAlert.resource}</div>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-semibold">3.</span>
                      <div>
                        <div className="font-medium mb-1">Edit permissions</div>
                        <div className="text-gray-600">Go to Permissions tab and block public access</div>
                      </div>
                    </li>
                  </ol>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">Prevention</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Create an automation rule to prevent this issue in the future
                  </p>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    Create Prevention Rule
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ResolutionScreen = () => (
    <div className="h-full flex items-center justify-center bg-gray-50">
      <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-md text-center">
        <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Alert Resolved</h2>
        <p className="text-sm text-gray-600 mb-6">
          The security issue has been successfully remediated
        </p>
        <button
          onClick={() => setCurrentScreen('queue')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Queue
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col">
      {/* Top Navigation */}
      <div className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield size={24} />
          <span className="font-semibold">CloudSec Platform</span>
        </div>
        <div className="flex items-center gap-4">
          <Bell size={20} />
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <User size={16} />
          </div>
        </div>
      </div>

      {/* Screen Navigation */}
      <div className="bg-white border-b px-6 py-2 flex gap-4 text-sm">
        <button
          onClick={() => setCurrentScreen('queue')}
          className={`px-3 py-2 rounded ${currentScreen === 'queue' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          Alert Queue (Wireframe 1)
        </button>
        <button
          onClick={() => {
            setSelectedAlert(alerts[0]);
            setCurrentScreen('detail');
          }}
          className={`px-3 py-2 rounded ${currentScreen === 'detail' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          Alert Details (Wireframe 2)
        </button>
        <button
          onClick={() => setCurrentScreen('resolution')}
          className={`px-3 py-2 rounded ${currentScreen === 'resolution' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          Resolution (Wireframe 3)
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {currentScreen === 'queue' && <QueueScreen />}
        {currentScreen === 'detail' && selectedAlert && <DetailScreen />}
        {currentScreen === 'resolution' && <ResolutionScreen />}
      </div>

      {/* Annotation Footer */}
      <div className="bg-yellow-50 border-t border-yellow-200 px-6 py-3 text-xs text-gray-700">
        <strong>Note:</strong> This is an interactive wireframe. Click the navigation buttons above to switch between screens, or click on alerts in the queue to view details.
      </div>
    </div>
  );
};

export default AlertTriageWireframe;