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
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-6">Blood Sugar Report</h2>
      <div
        id="report-content"
        className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto border border-gray-300"
      >
        <div className="flex justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold">Patient Name: {report.clientName}</h3>
          </div>
          <div>
            <p className="text-xl font-bold">
              Today's Date: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-center mb-4">BLOOD SUGAR REPORT</h3>

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

        <p className="text-right mt-4">
          <strong>Date Created:</strong>{" "}
          {new Date(report.dateCreated).toLocaleDateString()}
        </p>
      </div>

      <div
        id="report-summary"
        className="bg-blue-50 p-6 rounded-lg shadow-lg max-w-4xl mx-auto border border-gray-300 mt-6"
      >
        <h1 className="text-2xl font-bold text-blue-700 mb-2">Summary</h1>
        <p>{summary.summary || "No summary available."}</p>

        {summary.recommendations && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">Recommendations</h2>
            <ul className="list-disc ml-6">
              {summary.recommendations.map((rec, index) => (
                <li key={index} className="mb-1">
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

      <div className="flex justify-center mt-6">
        <button
          onClick={handleDownloadPdf}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default BloodSugarPdf;
