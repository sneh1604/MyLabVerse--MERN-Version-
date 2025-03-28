import React, { useState } from 'react';
import axios from 'axios';
import { 
    FaUpload, FaFileExcel, FaCheck, FaTimes, FaInfoCircle, 
    FaDownload, FaSpinner, FaBars, FaUserCircle 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const reportTypes = {
    hemogram: {
        name: 'Hemogram',
        template: 'hemogram_template.xlsx',
        description: 'Complete blood count analysis',
        fields: [
            'Client ID', 'Client Name', 'Hemoglobin (g/dL)', 'RBC Count (million/µL)',
            'WBC Count (/µL)', 'Platelet Count (/µL)', '+ 13 more parameters'
        ],
        ranges: [
            'Hemoglobin: 13.5-17.5 g/dL',
            'RBC Count: 4.7-6.1 million/µL',
            'WBC Count: 4,500-11,000 /µL',
            'Platelet Count: 150,000-450,000 /µL'
        ]
    },
    lipid: {
        name: 'Lipid Profile',
        template: 'lipid_template.xlsx',
        description: 'Comprehensive lipid analysis',
        fields: [
            'Client ID', 'Client Name', 'Serum Cholesterol', 'Serum Triglyceride',
            'HDL/LDL Cholesterol', 'Total Lipids', '+ 4 more parameters'
        ],
        ranges: [
            'Serum Cholesterol: 150-200 mg/dL',
            'HDL Cholesterol: 40-60 mg/dL',
            'LDL Cholesterol: <100 mg/dL',
            'Total Lipids: 400-1000 mg/dL'
        ]
    },
    bloodsugar: {
        name: 'Blood Sugar',
        template: 'bloodsugar_template.xlsx',
        description: 'Blood glucose analysis',
        fields: [
            'Client ID', 'Client Name', 'Fasting Blood Sugar', 'Postprandial Blood Sugar',
            'HbA1c', 'Total Cholesterol', 'Triglycerides'
        ],
        ranges: [
            'Fasting Blood Sugar: 70-100 mg/dL',
            'Postprandial: <140 mg/dL',
            'HbA1c: 4.0-5.6%'
        ]
    }
};

const ValidationRules = () => (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
            <FaInfoCircle className="mr-3 text-blue-500" />
            Validation Guidelines
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
                { icon: "🆔", text: "Client ID must be a valid MongoDB ObjectId (24 characters)" },
                { icon: "👤", text: "Client name must match exactly with database records" },
                { icon: "📊", text: "All numeric values must be within specified ranges" },
                { icon: "✅", text: "All fields in the template are mandatory" },
                { icon: "📝", text: "Text options must match exactly (e.g., normal/low/high)" },
                { icon: "⚠️", text: "Empty or invalid values will cause upload failure" }
            ].map((rule, idx) => (
                <li key={idx} className="flex items-start space-x-3 bg-white p-4 rounded-lg shadow-sm">
                    <span className="text-2xl">{rule.icon}</span>
                    <span className="text-gray-700">{rule.text}</span>
                </li>
            ))}
        </ul>
    </div>
);

const ReportTypeCard = ({ type, details, selected, onSelect }) => (
    <div 
        className={`transform transition-all duration-200 hover:scale-102 cursor-pointer rounded-xl overflow-hidden ${
            selected === type 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:shadow-lg border border-gray-200'
        }`}
        onClick={() => onSelect(type)}
    >
        <div className="p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">{details.name}</h4>
                    <p className="text-gray-600 text-sm">{details.description}</p>
                </div>
                <div className={`p-3 rounded-full ${
                    selected === type ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                    <FaFileExcel className="text-xl" />
                </div>
            </div>
            
            <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h5 className="font-semibold text-gray-700 mb-2">Required Fields</h5>
                    <ul className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        {details.fields.map((field, idx) => (
                            <li key={idx} className="flex items-center">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                {field}
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h5 className="font-semibold text-gray-700 mb-2">Normal Ranges</h5>
                    <ul className="space-y-1 text-sm text-gray-600">
                        {details.ranges.map((range, idx) => (
                            <li key={idx} className="flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                {range}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </div>
);

const BulkUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [reportType, setReportType] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const handleFileSelect = (event) => {
        setSelectedFile(event.target.files[0]);
        setError(null);
    };

    const downloadTemplate = async (type) => {
        if (!type) {
            setError('Please select a report type first');
            return;
        }
        
        try {
            const template = reportTypes[type].template;
            const response = await fetch(`http://localhost:4000/templates/${template}`, {
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error('Template download failed');
            }
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = template;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            setError('Failed to download template: ' + err.message);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !reportType) {
            setError('Please select both a file and report type');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(
                `http://localhost:4000/bulk-upload/${reportType}`,
                formData,
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );
            setResults(response.data);
            if (response.data.successCount > 0) {
                setUploadSuccess(true);
                setTimeout(() => setUploadSuccess(false), 3000);
            }
        } catch (error) {
            setError(error.response?.data?.error || 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100" style={{ fontFamily: 'Satoshi' }}>
            {/* Header */}
            <div className="flex-1 flex flex-col">
                <header className="bg-white shadow-md z-10">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center">
                            <FaBars
                                className="lg:hidden cursor-pointer text-2xl mr-4 text-gray-700"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                            />
                            <h2 className="text-xl font-bold text-gray-800">Bulk Upload Management</h2>
                        </div>
                        <div className="relative">
                            <div
                                className="flex items-center space-x-4 cursor-pointer"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                <FaUserCircle className="text-2xl text-indigo-700" />
                                <span className="font-medium">Administrator</span>
                            </div>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
                                    <button
                                        onClick={() => navigate('/administrator-dashboard')}
                                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                                    >
                                        Back to Dashboard
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-auto p-6">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-gray-500 text-sm">Available Templates</p>
                                        <p className="text-3xl font-bold">{Object.keys(reportTypes).length}</p>
                                    </div>
                                    <div className="p-3 bg-blue-100 rounded-full">
                                        <FaFileExcel className="text-2xl text-blue-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-gray-500 text-sm">Upload Status</p>
                                        <p className="text-3xl font-bold">{loading ? 'Processing' : 'Ready'}</p>
                                    </div>
                                    <div className="p-3 bg-green-100 rounded-full">
                                        <FaUpload className="text-2xl text-green-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-gray-500 text-sm">Success Rate</p>
                                        <p className="text-3xl font-bold">
                                            {results ? 
                                                `${Math.round((results.successCount / (results.successCount + results.failureCount)) * 100)}%` 
                                                : '0%'}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-purple-100 rounded-full">
                                        <FaCheck className="text-2xl text-purple-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Existing Content */}
                        <ValidationRules />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            {Object.entries(reportTypes).map(([type, details]) => (
                                <ReportTypeCard
                                    key={type}
                                    type={type}
                                    details={details}
                                    selected={reportType}
                                    onSelect={setReportType}
                                />
                            ))}
                        </div>

                        {reportType && (
                            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">Upload {reportTypes[reportType].name} Reports</h3>
                                    <button
                                        onClick={() => downloadTemplate(reportType)}
                                        className="text-indigo-600 hover:text-indigo-800 flex items-center"
                                    >
                                        <FaFileExcel className="mr-2" /> Download Template
                                    </button>
                                </div>

                                <UploadZone 
                                    selectedFile={selectedFile} 
                                    handleFileSelect={handleFileSelect} 
                                    error={error} 
                                    loading={loading} 
                                    handleUpload={handleUpload} 
                                />
                            </div>
                        )}

                        {results && (
                            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold mb-4">Upload Results</h3>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center text-green-600">
                                        <FaCheck className="mr-2" />
                                        {results.successCount} records uploaded successfully
                                    </div>
                                    {results.failureCount > 0 && (
                                        <div className="flex items-center text-red-600">
                                            <FaTimes className="mr-2" />
                                            {results.failureCount} records failed
                                        </div>
                                    )}
                                </div>
                                
                                {results.errors.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="font-medium mb-2 text-red-600">Errors:</h4>
                                        <div className="max-h-60 overflow-y-auto">
                                            <ul className="list-disc pl-5 space-y-1">
                                                {results.errors.map((error, index) => (
                                                    <li key={index} className="text-red-600">
                                                        Row {error.row}: {error.message}
                                                        {error.details && error.details.length > 0 && (
                                                            <ul className="ml-4 mt-1 list-disc">
                                                                {error.details.map((detail, idx) => (
                                                                    <li key={idx} className="text-red-500 text-sm">
                                                                        {detail}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

const UploadZone = ({ selectedFile, handleFileSelect, error, loading, handleUpload }) => (
    <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
            <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
            />
            <label
                htmlFor="file-upload"
                className="cursor-pointer"
            >
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
                        {selectedFile ? (
                            <FaFileExcel className="text-4xl text-blue-500" />
                        ) : (
                            <FaUpload className="text-4xl text-blue-500" />
                        )}
                    </div>
                    <div className="space-y-2">
                        <p className="text-lg font-medium text-gray-700">
                            {selectedFile ? selectedFile.name : 'Choose a file or drag & drop'}
                        </p>
                        <p className="text-sm text-gray-500">
                            Only Excel files (.xlsx, .xls) are supported
                        </p>
                    </div>
                </div>
            </label>
        </div>

        {error && (
            <div className="mt-4 bg-red-50 text-red-700 p-4 rounded-lg flex items-center">
                <FaInfoCircle className="mr-2" />
                {error}
            </div>
        )}

        <button
            onClick={handleUpload}
            disabled={loading || !selectedFile}
            className="w-full mt-6 py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg 
                      hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                      flex items-center justify-center space-x-2 transform transition-transform hover:scale-102"
        >
            {loading ? (
                <>
                    <FaSpinner className="animate-spin" />
                    <span>Processing...</span>
                </>
            ) : (
                <>
                    <FaUpload />
                    <span>Upload Reports</span>
                </>
            )}
        </button>
    </div>
);

export default BulkUpload;
