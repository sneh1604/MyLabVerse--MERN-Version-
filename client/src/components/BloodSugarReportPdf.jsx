import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import axios from 'axios';

const BloodSugarPdf = () => {
  const { state } = useLocation();
  const { report } = state; // Blood sugar report data passed from ViewReport
  const [summary, setSummary] = useState("");

  // Function to fetch summary and steps
  const fetchSummary = (rep) => {
    axios
      .post("http://localhost:4000/aiml", { report: rep }, {
        withCredentials: true,
      })
      .then((response) => {
        try {
          // Parse response safely
          const parsedResponse =
            typeof response.data === "string"
              ? JSON.parse(response.data.replace(/```json|```/g, "").trim())
              : response.data;

          console.log(parsedResponse);
          setSummary(parsedResponse);
        } catch (error) {
          console.error("Error parsing response JSON:", error);
        }
      })
      .catch((error) => {
        console.error("Error submitting report:", error);
      });
  };

  // PDF download logic
  const handleDownloadPdf = () => {
    const element = document.getElementById("report-content");
    const scale = 3; // Higher scale for better resolution
  
    html2canvas(element, {
      scale: scale, // Increase scale for better clarity
      useCORS: true, // To avoid CORS issues if any external content is present
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
  
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // Width of A4 in mm
      const pageHeight = 297; // Height of A4 in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      let heightLeft = imgHeight;
      let position = 0;
  
      // Add the image to the PDF
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
  
      // If the image is taller than the page, we need to add pages
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
  
      // Add a new page for the summary and steps after the image
      pdf.addPage();
      pdf.setFontSize(12);
      let yPosition = 20; // Initialize yPosition after the image
      
      // Leave some space after the image before adding the summary
      yPosition += 10; // Adjust this value to your preference for spacing
  
      // Add summary to the PDF
      pdf.text(`Summary: ${summary.summary || "No summary available."}`, 10, yPosition);
      yPosition += 10;
  
      // Add recommendations if available
      if (summary.recommendations) {
        pdf.text("Recommendations:", 10, yPosition);
        yPosition += 10;
        summary.recommendations.forEach((rec, index) => {
          pdf.text(`${index + 1}. ${rec}`, 10, yPosition);
          yPosition += 10;
        });
      }
  
      // Add control steps if available
      if (summary.controlSteps) {
        pdf.text("Control Steps:", 10, yPosition);
        yPosition += 10;
        summary.controlSteps.forEach((step, index) => {
          pdf.text(`${index + 1}. ${step}`, 10, yPosition);
          yPosition += 10;
        });
      }
  
      pdf.save("BloodSugar_Report.pdf");
    });
  };
  

  useEffect(() => {
    fetchSummary(report);
  }, [report]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Blood Sugar Report</h1>
        
        <div id="report-content" className="mb-8">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700">Patient Name</h3>
              <p className="text-xl">{report.clientName}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700">Report Date</h3>
              <p className="text-xl">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-3 text-left text-gray-700">Test</th>
                  <th className="border border-gray-200 px-4 py-3 text-left text-gray-700">Result</th>
                  <th className="border border-gray-200 px-4 py-3 text-left text-gray-700">Units</th>
                  <th className="border border-gray-200 px-4 py-3 text-left text-gray-700">Normal Range</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border">
                  <td className="border py-2 px-4 font-bold">
                    Fasting Blood Sugar
                  </td>
                  <td className="border py-2 px-4">{report.fastingBloodSugar}</td>
                  <td className="border py-2 px-4">mg/dL</td>
                  <td className="border py-2 px-4">70-100</td>
                </tr>
                <tr className="border">
                  <td className="border py-2 px-4 font-bold">
                    Postprandial Blood Sugar
                  </td>
                  <td className="border py-2 px-4">
                    {report.postprandialBloodSugar}
                  </td>
                  <td className="border py-2 px-4">mg/dL</td>
                  <td className="border py-2 px-4">Less than 140</td>
                </tr>
                <tr className="border">
                  <td className="border py-2 px-4 font-bold">HbA1c</td>
                  <td className="border py-2 px-4">{report.hba1c}</td>
                  <td className="border py-2 px-4">%</td>
                  <td className="border py-2 px-4">Less than 5.7</td>
                </tr>
                <tr className="border">
                  <td className="border py-2 px-4 font-bold">Total Cholesterol</td>
                  <td className="border py-2 px-4">{report.totalCholesterol}</td>
                  <td className="border py-2 px-4">mg/dL</td>
                  <td className="border py-2 px-4">125-200</td>
                </tr>
                <tr className="border">
                  <td className="border py-2 px-4 font-bold">Triglycerides</td>
                  <td className="border py-2 px-4">{report.triglycerides}</td>
                  <td className="border py-2 px-4">mg/dL</td>
                  <td className="border py-2 px-4">Less than 150</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div id="report-summary" className="mb-8">
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Analysis Summary</h2>
            <p className="text-gray-700 mb-4">{summary.summary || "No summary available."}</p>
          </div>

          {summary.recommendations && (
            <div className="bg-green-50 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recommendations</h2>
              <ul className="space-y-2">
                {summary.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center bg-green-100 rounded-full h-6 w-6 text-sm text-green-800 mr-3">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {summary.controlSteps && (
            <div className="bg-purple-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Control Steps</h2>
              <ul className="space-y-2">
                {summary.controlSteps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center bg-purple-100 rounded-full h-6 w-6 text-sm text-purple-800 mr-3">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleDownloadPdf}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-300 ease-in-out flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default BloodSugarPdf;
