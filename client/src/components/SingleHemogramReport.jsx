import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaDownload, FaPrint } from 'react-icons/fa';

const SingleHemogramReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          setUserName(user.name);
        }
        
        const response = await axios.get(`http://localhost:4000/hemogram-report/${id}`, {
          withCredentials: true
        });
        
        setReport(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching report:', err);
        setError('Failed to load report. Please try again later.');
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    navigate('/hemogram-reportpdf', { state: { report } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Report Not Found</h2>
          <p className="text-gray-700 mb-4">The requested report could not be found.</p>
          <button 
            onClick={() => navigate('/viewreport')} 
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Back to Reports
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8" style={{ fontFamily: 'Satoshi' }}>
      <div className="max-w-4xl mx-auto">
        {/* Non-printable navigation */}
        <div className="print:hidden mb-6 flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
          
          <div className="flex space-x-4">
            <button 
              onClick={handleDownload} 
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              <FaDownload className="mr-2" /> Download
            </button>
            
            <button 
              onClick={handlePrint} 
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              <FaPrint className="mr-2" /> Print
            </button>
          </div>
        </div>
        
        {/* Report Content */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Report Header */}
          <div className="bg-blue-600 text-white p-6 text-center">
            <h1 className="text-3xl font-bold mb-2">Hemogram Test Report</h1>
            <p className="text-lg">MyLabVerse Laboratories</p>
          </div>
          
          {/* Patient and Report Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-b">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Patient Information</h2>
              <p className="text-gray-600"><span className="font-medium">Name:</span> {userName}</p>
              <p className="text-gray-600"><span className="font-medium">ID:</span> {report.clientId}</p>
              <p className="text-gray-600"><span className="font-medium">Date:</span> {new Date(report.created_at).toLocaleDateString()}</p>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Report Information</h2>
              <p className="text-gray-600"><span className="font-medium">Report ID:</span> {report._id}</p>
              <p className="text-gray-600"><span className="font-medium">Sample Collection:</span> {new Date(report.created_at).toLocaleDateString()}</p>
              <p className="text-gray-600"><span className="font-medium">Report Date:</span> {new Date(report.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          
          {/* Test Results */}
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Test Results</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Normal Range</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Hemoglobin (g/dL)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.hemoglobin}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">13.5 - 17.5</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {report.hemoglobin < 13.5 && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Low</span>}
                      {report.hemoglobin > 17.5 && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">High</span>}
                      {report.hemoglobin >= 13.5 && report.hemoglobin <= 17.5 && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Normal</span>}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Red Blood Cell Count (millions/μL)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.rbc_count}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4.7 - 6.1</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {report.rbc_count < 4.7 && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Low</span>}
                      {report.rbc_count > 6.1 && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">High</span>}
                      {report.rbc_count >= 4.7 && report.rbc_count <= 6.1 && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Normal</span>}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">White Blood Cell Count (per μL)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.wbc_count}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4,500 - 11,000</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {report.wbc_count < 4500 && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Low</span>}
                      {report.wbc_count > 11000 && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">High</span>}
                      {report.wbc_count >= 4500 && report.wbc_count <= 11000 && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Normal</span>}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Platelet Count (per μL)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.platelet_count}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">150,000 - 450,000</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {report.platelet_count < 150000 && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Low</span>}
                      {report.platelet_count > 450000 && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">High</span>}
                      {report.platelet_count >= 150000 && report.platelet_count <= 450000 && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Normal</span>}
                    </td>
                  </tr>
                  {/* Add other hemogram parameters */}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Polymorphs (%)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.polymorphs}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">40 - 70</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {report.platelet_option || 'Recorded'}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Lymphocytes (%)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.lymphocytes}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">20 - 40</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Recorded
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Interpretation */}
          <div className="p-6 bg-gray-50 border-t">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Interpretation</h2>
            <p className="text-gray-700 mb-4">
              This is an automated interpretation of the hemogram results. Please consult with a healthcare professional
              for a comprehensive medical assessment.
            </p>
            
            <div className="bg-white p-4 rounded-md border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Summary</h3>
              <p className="text-gray-700">
                {report.hemoglobin < 13.5 && "Low hemoglobin levels may indicate anemia. "}
                {report.hemoglobin > 17.5 && "High hemoglobin levels may indicate polycythemia or dehydration. "}
                {report.rbc_count < 4.7 && "Low RBC count may suggest blood loss or decreased production of red blood cells. "}
                {report.rbc_count > 6.1 && "Elevated RBC count may indicate polycythemia or dehydration. "}
                {report.wbc_count < 4500 && "Low WBC count might indicate an immune system deficiency or bone marrow problem. "}
                {report.wbc_count > 11000 && "High WBC count could suggest infection, inflammation, or certain blood diseases. "}
                {report.platelet_count < 150000 && "Low platelet count may lead to easy bruising and bleeding. "}
                {report.platelet_count > 450000 && "High platelet count can increase risk of blood clots. "}
                {(report.hemoglobin >= 13.5 && report.hemoglobin <= 17.5 &&
                  report.rbc_count >= 4.7 && report.rbc_count <= 6.1 &&
                  report.wbc_count >= 4500 && report.wbc_count <= 11000 &&
                  report.platelet_count >= 150000 && report.platelet_count <= 450000) && 
                  "All hemogram parameters appear to be within normal ranges."}
              </p>
            </div>
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 p-6 text-center border-t">
            <p className="text-gray-600 text-sm">This report was generated by MyLabVerse Laboratories on {new Date().toLocaleDateString()}</p>
            <p className="text-gray-600 text-sm mt-1">For questions or concerns, please contact us at support@mylabverse.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleHemogramReport;
