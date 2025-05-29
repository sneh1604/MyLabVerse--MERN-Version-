import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';
import { FaDownload, FaArrowLeft, FaHeartbeat, FaPrint, FaFileExport } from 'react-icons/fa';
import { API_BASE_URL } from '../config/api-config';


const LipidPdf = () => {
  const { state } = useLocation();
  const { report } = state;
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchSummary = (rep) => {
    setIsLoading(true);
    axios
      .post(`${API_BASE_URL}/aiml`, { report: rep }, {
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
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDownloadPdf = () => {
    const element = document.getElementById('report-content');
    const scale = 3;  // Higher scale for better resolution

    html2canvas(element, {
      scale: scale,  // Increase scale for better clarity
      useCORS: true  // To avoid CORS issues if any external content is present
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      // Initialize jsPDF with higher resolution and set dimensions
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // Width of A4 in mm
      const pageHeight = 297; // Height of A4 in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Scale image to fit width

      let heightLeft = imgHeight;
      let position = 0;

      // If content overflows, handle multiple pages
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('Lipid_Report.pdf');
    });
  };

  useEffect(() => {
    fetchSummary(report);
  }, [report]);
  

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-6">Lipid Profile Report</h2>
      <div id="report-content" className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto border border-gray-300">
        <div className="flex justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold">Patient Name: {report.clientName}</h3>
          </div>
          <div>
            <p className="text-xl font-bold">Today's Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-center mb-4">LIPID PROFILE REPORT</h3>

        <table className="w-full mb-6 border-collapse border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border py-2 px-4">Test</th>
              <th className="border py-2 px-4">Result</th>
              <th className="border py-2 px-4">Units</th>
              <th className="border py-2 px-4">Normals</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border">
              <td className="border py-2 px-4 font-bold">Total Cholesterol</td>
              <td className="border py-2 px-4">{report.serumCholesterol}</td>
              <td className="border py-2 px-4">mg/dL</td>
              <td className="border py-2 px-4">125-200</td>
            </tr>
            <tr className="border">
              <td className="border py-2 px-4 font-bold">HDL Cholesterol</td>
              <td className="border py-2 px-4">{report.hdlCholesterol}</td>
              <td className="border py-2 px-4">mg/dL</td>
              <td className="border py-2 px-4">40-60</td>
            </tr>
            <tr className="border">
              <td className="border py-2 px-4 font-bold">LDL Cholesterol</td>
              <td className="border py-2 px-4">{report.ldlCholesterol}</td>
              <td className="border py-2 px-4">mg/dL</td>
              <td className="border py-2 px-4">Less than 100</td>
            </tr>
            <tr className="border">
              <td className="border py-2 px-4 font-bold">Triglycerides</td>
              <td className="border py-2 px-4">{report.serumTriglyceride}</td>
              <td className="border py-2 px-4">mg/dL</td>
              <td className="border py-2 px-4">Less than 150</td>
            </tr>
            <tr className="border">
              <td className="border py-2 px-4 font-bold">VLDL</td>
              <td className="border py-2 px-4">{report.vldlCholesterol}</td>
              <td className="border py-2 px-4">mg/dL</td>
              <td className="border py-2 px-4">5-40</td>
            </tr>
            <tr className="border">
              <td className="border py-2 px-4 font-bold">LDL/HDL Ratio</td>
              <td className="border py-2 px-4">{report.ldlHdlRatio}</td>
              <td className="border py-2 px-4"></td>
              <td className="border py-2 px-4">Ideal: &lt; 3.5</td>
            </tr>
            <tr className="border">
              <td className="border py-2 px-4 font-bold">Total Cholesterol/HDL Ratio</td>
              <td className="border py-2 px-4">{report.totalCholesterolHdlRatio}</td>
              <td className="border py-2 px-4"></td>
              <td className="border py-2 px-4">Ideal: &lt; 5.0</td>
            </tr>
            <tr className="border">
              <td className="border py-2 px-4 font-bold">Total Lipids</td>
              <td className="border py-2 px-4">{report.totalLipids}</td>
              <td className="border py-2 px-4">mg/dL</td>
              <td className="border py-2 px-4">400-1000</td>
            </tr>
          </tbody>
        </table>

        <p className="text-right mt-4"><strong>Date Created:</strong> {new Date(report.dateCreated).toLocaleDateString()}</p>
      </div>

      <div
        id="report-summary"
        className="bg-blue-50 p-6 rounded-lg shadow-lg max-w-4xl mx-auto border border-gray-300 mt-6"
      >
        <h1 className="text-2xl font-bold text-blue-700 mb-2">Summary</h1>
        <p>{summary.summary || "No summary available."}</p>

        {summary.recommendations && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold text-blue-600">Recommendations</h2>
            <ul className="list-disc ml-6">
              {summary.recommendations.map((rec, index) => (
                <li key={index} className="mb-1 ">
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {summary.controlSteps && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">Control Steps</h2>
            <ul className="list-disc ml-6">
              {summary.controlSteps.map((step, index) => (
                <li key={index} className="mb-1">
                  {step}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button
        onClick={handleDownloadPdf}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
      >
        Download PDF
      </button>
    </div>
  );
};

export default LipidPdf;
