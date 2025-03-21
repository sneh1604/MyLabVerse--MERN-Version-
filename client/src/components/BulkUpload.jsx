import React, { useState } from 'react';
import axios from 'axios';
import { FaUpload, FaFileExcel, FaCheck, FaTimes, FaInfoCircle } from 'react-icons/fa';

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
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Validation Rules</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Client ID must be a valid MongoDB ObjectId (24 characters)</li>
            <li>Client name must match an existing client in the database</li>
            <li>All numeric values must be within their specified ranges</li>
            <li>All fields marked in the template are required</li>
            <li>Text options (like normal/low/high) must match exactly</li>
        </ul>
    </div>
);

const ReportTypeCard = ({ type, details, selected, onSelect }) => (
    <div 
        className={`border rounded-lg p-4 cursor-pointer transition-all ${
            selected === type ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'
        }`}
        onClick={() => onSelect(type)}
    >
        <h4 className="font-semibold text-lg mb-2">{details.name}</h4>
        <p className="text-gray-600 text-sm mb-3">{details.description}</p>
        <div className="space-y-2">
            <div className="text-sm text-gray-500">
                <strong>Fields:</strong>
                <ul className="ml-4 mt-1 list-disc">
                    {details.fields.map((field, idx) => (
                        <li key={idx}>{field}</li>
                    ))}
                </ul>
            </div>
            <div className="text-sm text-gray-500">
                <strong>Normal Ranges:</strong>
                <ul className="ml-4 mt-1 list-disc">
                    {details.ranges.map((range, idx) => (
                        <li key={idx}>{range}</li>
                    ))}
                </ul>
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

    const handleFileSelect = (event) => {
        setSelectedFile(event.target.files[0]);
        setError(null);
    };

    // Add the downloadTemplate function
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
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Bulk Upload Reports</h2>

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

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="file-upload"
                        />
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer flex flex-col items-center space-y-2"
                        >
                            <FaUpload className="text-gray-400 text-3xl" />
                            <span className="text-gray-600">
                                {selectedFile ? selectedFile.name : 'Click to select file or drag and drop'}
                            </span>
                            <span className="text-sm text-gray-500">
                                Only Excel files (.xlsx, .xls) are supported
                            </span>
                        </label>
                    </div>

                    {error && (
                        <div className="flex items-center text-red-600 bg-red-50 p-3 rounded">
                            <FaInfoCircle className="mr-2" />
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleUpload}
                        disabled={loading || !selectedFile}
                        className="w-full mt-4 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? (
                            <span>Uploading...</span>
                        ) : (
                            <span className="flex items-center">
                                <FaUpload className="mr-2" /> Upload Reports
                            </span>
                        )}
                    </button>
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
    );
};

export default BulkUpload;
