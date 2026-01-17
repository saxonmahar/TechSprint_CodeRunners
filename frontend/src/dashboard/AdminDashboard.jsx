// src/components/AdminDashboard.jsx
import { useState, useEffect } from "react";
import {
  Shield, FileText, MapPin, Clock, Search,
  CheckCircle, XCircle, Users, AlertCircle,
  Download, RefreshCw, Filter
} from "lucide-react";

// Import the service functions
import {
  getAllAccidentReports,
  acceptReport,
  rejectReport
} from '../services/admin';

const AdminDashboard = () => {
  // States
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Calculate stats from reports
  const calculateStats = () => {
    const total = reports.length;
    const pending = reports.filter(r => r.status === 'reported').length;
    const accepted = reports.filter(r => r.status === 'accepted').length;
    const rejected = reports.filter(r => r.status === 'rejected').length;
    
    return { total, pending, accepted, rejected };
  };

  const stats = calculateStats();

  // Fetch reports from API using service function
  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getAllAccidentReports();
      
      if (response.data && Array.isArray(response.data)) {
        // Add title based on description or location
        const reportsWithTitle = response.data.map(report => ({
          ...report,
          title: report.description 
            ? report.description.substring(0, 50) + (report.description.length > 50 ? '...' : '')
            : `Report from ${report.phoneNumber}`
        }));
        
        setReports(reportsWithTitle);
        setFilteredReports(reportsWithTitle);
      } else {
        setReports([]);
        setFilteredReports([]);
      }
      
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle accept report using service function
  const handleAccept = async (reportId) => {
    try {
      await acceptReport(reportId);
      
      // Update local state
      setReports(prev => prev.map(report =>
        report._id === reportId
          ? { ...report, status: 'accepted' }
          : report
      ));
      
      alert('Report accepted successfully!');
      
    } catch (err) {
      console.error('Error accepting report:', err);
      alert(err.message || 'Failed to accept report');
    }
  };

  // Handle reject report using service function
  const handleReject = async (reportId) => {
    try {
      await rejectReport(reportId);
      
      // Update local state
      setReports(prev => prev.map(report =>
        report._id === reportId
          ? { ...report, status: 'rejected' }
          : report
      ));
      
      alert('Report rejected successfully!');
      
    } catch (err) {
      console.error('Error rejecting report:', err);
      alert(err.message || 'Failed to reject report');
    }
  };

  // Handle export
  const handleExport = () => {
    const data = JSON.stringify(filteredReports, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `accident-reports-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    alert('Reports exported successfully!');
  };

  // Filter reports based on search and status
  useEffect(() => {
    let filtered = [...reports];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location?.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReports(filtered);
  }, [searchTerm, statusFilter, reports]);

  // Fetch reports on component mount
  useEffect(() => {
    fetchReports();
  }, []);

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'reported': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'reported': return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Accident Reports Admin</h1>
                <p className="text-sm text-gray-500">Manage and review submitted reports</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={fetchReports}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Reports</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Accepted</p>
                <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg p-4 shadow border mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="reported">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
              
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reports List */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <RefreshCw className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">Loading reports...</h3>
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">Error loading reports</h3>
                <p className="text-gray-500 mb-4">{error}</p>
                <button
                  onClick={fetchReports}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">No reports found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <div
                    key={report._id}
                    className="bg-white rounded-lg p-4 shadow border hover:shadow-md cursor-pointer"
                    onClick={() => setSelectedReport(report)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-bold text-gray-900">
                            {report.title || `Report #${report._id.substring(0, 8)}`}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                            <span className="flex items-center space-x-1">
                              {getStatusIcon(report.status)}
                              <span>{report.status}</span>
                            </span>
                          </span>
                        </div>

                        {report.description && (
                          <p className="text-gray-600 mb-3">{report.description}</p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {report.location?.address || `Lat: ${report.location?.latitude}, Lng: ${report.location?.longitude}`}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatDate(report.createdAt)}
                          </span>
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {report.phoneNumber}
                          </span>
                        </div>
                      </div>

                      {report.status === 'reported' && (
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAccept(report._id);
                            }}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                          >
                            Accept
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReject(report._id);
                            }}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Report Details Sidebar */}
          <div>
            {selectedReport ? (
              <div className="bg-white rounded-lg p-6 shadow border">
                <h2 className="font-bold text-gray-900 mb-4">Report Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Description</h4>
                    <p className="mt-1 p-2 bg-gray-50 rounded">
                      {selectedReport.description || 'No description provided'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Status</h4>
                      <span className={`mt-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedReport.status)}`}>
                        {selectedReport.status}
                      </span>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Phone Number</h4>
                      <p className="mt-1 font-medium">{selectedReport.phoneNumber}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Location</h4>
                    <div className="mt-1 space-y-1">
                      <p className="font-medium">{selectedReport.location?.address || 'No address'}</p>
                      <p className="text-sm text-gray-500">
                        Lat: {selectedReport.location?.latitude}, Lng: {selectedReport.location?.longitude}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Submitted</h4>
                    <p className="mt-1">{formatDate(selectedReport.createdAt)}</p>
                  </div>

                  {selectedReport.images && selectedReport.images.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Images</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedReport.images.map((img, index) => (
                          <img
                            key={index}
                            src={img.url}
                            alt={`Report ${selectedReport._id} - ${index + 1}`}
                            className="rounded-lg object-cover w-full h-24 border"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedReport.status === 'reported' && (
                    <div className="flex space-x-3 pt-4 border-t">
                      <button
                        onClick={() => handleAccept(selectedReport._id)}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Accept Report
                      </button>
                      <button
                        onClick={() => handleReject(selectedReport._id)}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Reject Report
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 shadow border">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Select a Report</h3>
                  <p className="text-gray-500">Click on any report to view detailed information</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;