import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import { FaDownload, FaArrowLeft, FaPrint, FaSpinner } from "react-icons/fa";

const BloodSugarPdf = () => {
  const { state } = useLocation();
  const { report } = state; // Blood sugar report data passed from ViewReport
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();

  // Function to fetch summary and steps
  const fetchSummary = (rep) => {
    setIsLoading(true);
    axios
      .post("http://localhost:4000/aiml", { report: rep }, {
        withCredentials: true,
      })
      .then((response) => {
        try {
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

  // PDF download logic (Fixed for proper layout)
  const handleDownloadPdf = () => {
    setIsPdfGenerating(true);
    const element = document.getElementById("report-content");

    html2canvas(element, {
      scale: 2, // Improves resolution
      useCORS: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4"); // A4 size
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

      let position = 10;
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

      if (imgHeight > 280) {
        let heightLeft = imgHeight - 280;
        position = -280;
        while (heightLeft > 0) {
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= 280;
          position -= 280;
        }
      }

      pdf.save("blood_sugar_report.pdf");
      setIsPdfGenerating(false);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    });
  };

  useEffect(() => {
    fetchSummary(report);
  }, [report]);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <h2 className="text-3xl font-bold text-center">Blood Sugar Report</h2>
        <div className="flex space-x-4">
          <button
            onClick={handleDownloadPdf}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
            disabled={isPdfGenerating}
          >
            {isPdfGenerating ? (
              <>
                <FaSpinner className="mr-2 animate-spin" /> Generating PDF...
              </>
            ) : (
              <>
                <FaDownload className="mr-2" /> Download PDF
              </>
            )}
          </button>
          <button
            onClick={() => window.print()}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
          >
            <FaPrint className="mr-2" /> Print
          </button>
        </div>
      </div>

      {showSuccessMessage && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">
            PDF generated and downloaded successfully!
          </span>
        </div>
      )}

      <div
        id="report-content"
        className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto border border-gray-300"
      >
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-bold">Patient Name: {report.clientName}</h3>
          <p className="text-xl font-bold">
            Today's Date: {new Date().toLocaleDateString()}
          </p>
        </div>

        <h3 className="text-2xl font-semibold text-center mb-4">
          Blood Sugar Report
        </h3>
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
            {[
              ["Fasting Blood Sugar", report.fastingBloodSugar, "mg/dL", "70-100"],
              ["Postprandial Blood Sugar", report.postprandialBloodSugar, "mg/dL", "Less than 140"],
              ["HbA1c", report.hba1c, "%", "Less than 5.7"],
              ["Total Cholesterol", report.totalCholesterol, "mg/dL", "125-200"],
              ["Triglycerides", report.triglycerides, "mg/dL", "Less than 150"],
            ].map(([test, result, unit, normal], index) => (
              <tr key={index} className="border">
                <td className="border py-2 px-4 font-bold">{test}</td>
                <td className="border py-2 px-4">{result}</td>
                <td className="border py-2 px-4">{unit}</td>
                <td className="border py-2 px-4">{normal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto border border-gray-300 mt-4">
        <h1 className="text-xl font-bold mb-2">Summary</h1>
        {isLoading ? (
          <p>Loading summary...</p>
        ) : (
          <p>{summary.summary || "No summary available."}</p>
        )}
      </div>
    </div>
  );
};

export default BloodSugarPdf;
