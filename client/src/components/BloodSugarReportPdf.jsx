import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import axios from 'axios';


const BloodSugarPdf = () => {
  const { state } = useLocation();
  const { report } = state; // Blood sugar report data passed from ViewReport
  const [summary, setsummary] = useState("");

  const d = { "Patient Details": { "Name": "PRAGNESH BHAI SHAH", "Age": "94 Years", "Sex": "M" }, "Date and Time": "01/10/2024 07:15", "Prescription Details": { "Medications": [ "HAEMOGRAM" ], "Dosage": null, "Duration": null }, "Special Instructions": null, "Test Results": { "Hemoglobin": "14.2 g/dl", "RBC Count": "5.24 nil/", "WBC Count": "5340 /cmm", "Platelet Count": "185000 /cmm", "PCV": "40.8 %", "MCV": "77.9 fl", "MCH": "27.2 pg", "MCHC": "34.9", "RDW": "14.4", "Differential WBC Count": { "Polymorphs": "82", "Lymphocytes": "13", "Eosinophils": "01", "Monocytes": "045" }, "Smear Study": { "RBC": "Premature Cells _ F", "Platelets": "(on the smear", "Malarial Parasite": null } }, "Reference": "R.D, ASITBHAI DAVE (MBBS)" };
  const summaryR = (rep) => {
    axios
      .post("http://localhost:4000/aiml", {'report': rep}, {
        withCredentials: true,
      })
      .then(async (response)  =>  {
        let s = await JSON.parse(response.data);
        console.log(s);
        setsummary(s);
      })
      .catch((error) => console.error("Error submitting report:", error));
  };
  const handleDownloadPdf = () => {
    const element = document.getElementById("report-content");
    const scale = 3; // Higher scale for better resolution

    html2canvas(element, {
      scale: scale, // Increase scale for better clarity
      useCORS: true, // To avoid CORS issues if any external content is present
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      // Initialize jsPDF with higher resolution and set dimensions
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // Width of A4 in mm
      const pageHeight = 297; // Height of A4 in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Scale image to fit width

      let heightLeft = imgHeight;
      let position = 0;

      // If content overflows, handle multiple pages
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("BloodSugar_Report.pdf");
    });
  };

  useEffect( () => {
    summaryR(report);
  }, []);
  

  return (
    <div className="p-8 bg-gray-100 min-h-scrrepen">
      <h2 className="text-3xl font-bold text-center mb-6">
        Blood Sugar Report
      </h2>
      <div
        id="report-content"
        className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto border border-gray-300"
      >
        <div className="flex justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold">
              Patient Name: {report.clientName}
            </h3>
          </div>
          <div>
            <p className="text-xl font-bold">
              Today's Date: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-center mb-4">
          BLOOD SUGAR REPORT
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
      > <h1 className="text-2xl font-bold text-blue-700 mb-2"> <b>Summary</b></h1><p>{summary.summary}</p> <br></br><p><h2 className="text-xl font-semibold text-blue-600"><b>Recommended Steps</b></h2>{summary.steps}</p> </div>
      <button
        onClick={handleDownloadPdf}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 mt-6"
      >
        Download PDF
      </button>
    </div>
  );
};

export default BloodSugarPdf;
