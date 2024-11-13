import React,{ useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';


const HemogramReportPdf = () => {
  const { state } = useLocation();
  const { report } = state;   // Report data passed from ViewReport
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
    const element = document.getElementById('report-content');
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297); // A4 size
      pdf.save('Hemogram_Report.pdf');
    });
  };

  useEffect( () => {
    summaryR(report);
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-6">Hemogram Report</h2>
      <div id="report-content" className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto border border-gray-300">
        <div className="flex justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold">Patient Name: {report.clientName}</h3>
          </div>
          <div>
            <p className="text-xl font-bold">Today's Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-center mb-4">HAEMOGRAM REPORT</h3>

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
              <td className="border py-2 px-4 font-bold">Hemoglobin</td>
              <td className="border py-2 px-4">{report.hemoglobin}</td>
              <td className="border py-2 px-4">gm%</td>
              <td className="border py-2 px-4">M: 13.5-18, F: 12-16</td>
            </tr>
            <tr className="border">
              <td className="border py-2 px-4 font-bold">RBC Count</td>
              <td className="border py-2 px-4">{report.rbc_count}</td>
              <td className="border py-2 px-4">million/cu.mm</td>
              <td className="border py-2 px-4">M: 4.5-6.5, F: 4.2-5.4</td>
            </tr>
            <tr className="border">
              <td className="border py-2 px-4 font-bold">WBC Count</td>
              <td className="border py-2 px-4">{report.wbc_count}</td>
              <td className="border py-2 px-4">/cu.mm</td>
              <td className="border py-2 px-4">4000 to 10,000</td>
            </tr>
            <tr className="border">
              <td className="border py-2 px-4 font-bold">Platelet Count</td>
              <td className="border py-2 px-4">{report.platelet_count}</td>
              <td className="border py-2 px-4">/cu.mm</td>
              <td className="border py-2 px-4">150,000 to 450,000</td>
            </tr>
          </tbody>
        </table>

        <h4 className="text-xl font-semibold mb-2">Differential Count:</h4>
        <table className="w-full mb-6 border-collapse border">
          <tbody>
            <tr>
              <td className="border py-2 px-4 font-bold">Polymorphs</td>
              <td className="border py-2 px-4">{report.polymorphs}</td>
              <td className="border py-2 px-4">%</td>
              <td className="border py-2 px-4">50-70</td>
            </tr>
            <tr>
              <td className="border py-2 px-4 font-bold">Lymphocytes</td>
              <td className="border py-2 px-4">{report.lymphocytes}</td>
              <td className="border py-2 px-4">%</td>
              <td className="border py-2 px-4">20-40</td>
            </tr>
            <tr>
              <td className="border py-2 px-4 font-bold">Eosinophils</td>
              <td className="border py-2 px-4">{report.eosinophils}</td>
              <td className="border py-2 px-4">%</td>
              <td className="border py-2 px-4">01-06</td>
            </tr>
            <tr>
              <td className="border py-2 px-4 font-bold">Monocytes</td>
              <td className="border py-2 px-4">{report.monocytes}</td>
              <td className="border py-2 px-4">%</td>
              <td className="border py-2 px-4">02-06</td>
            </tr>
            <tr>
              <td className="border py-2 px-4 font-bold">Basophils</td>
              <td className="border py-2 px-4">{report.basophils}</td>
              <td className="border py-2 px-4">%</td>
              <td className="border py-2 px-4">00-01</td>
            </tr>
          </tbody>
        </table>

        <h4 className="text-xl font-semibold mb-2">Blood Indices:</h4>
        <table className="w-full mb-6 border-collapse border">
          <tbody>
            <tr>
              <td className="border py-2 px-4 font-bold">PCV</td>
              <td className="border py-2 px-4">{report.pcv}</td>
              <td className="border py-2 px-4">%</td>
              <td className="border py-2 px-4">M: 40-54, F: 36-45</td>
            </tr>
            <tr>
              <td className="border py-2 px-4 font-bold">MCV</td>
              <td className="border py-2 px-4">{report.mcv}</td>
              <td className="border py-2 px-4">fl</td>
              <td className="border py-2 px-4">82-92</td>
            </tr>
            <tr>
              <td className="border py-2 px-4 font-bold">MCH</td>
              <td className="border py-2 px-4">{report.mch}</td>
              <td className="border py-2 px-4">pg</td>
              <td className="border py-2 px-4">27-32</td>
            </tr>
            <tr>
              <td className="border py-2 px-4 font-bold">MCHC</td>
              <td className="border py-2 px-4">{report.mchc}</td>
              <td className="border py-2 px-4">g/dL</td>
              <td className="border py-2 px-4">32-36</td>
            </tr>
            <tr>
              <td className="border py-2 px-4 font-bold">RDW</td>
              <td className="border py-2 px-4">{report.rdw}</td>
              <td className="border py-2 px-4">%</td>
              <td className="border py-2 px-4">11.6-14.6</td>
            </tr>
          </tbody>
        </table>

        <h4 className="text-xl font-semibold mb-2">Smear Study:</h4>
        <table className="w-full mb-6 border-collapse border">
          <tbody>
            <tr>
              <td className="border py-2 px-4 font-bold">RBCs</td>
              <td className="border py-2 px-4">{report.rbcs}</td>
            </tr>
            <tr>
              <td className="border py-2 px-4 font-bold">WBCs</td>
              <td className="border py-2 px-4">{report.wbcs}</td>
            </tr>
            <tr>
              <td className="border py-2 px-4 font-bold">Platelets</td>
              <td className="border py-2 px-4">{report.platelet_option}</td>
            </tr>
          </tbody>
        </table>

        <p className="text-right mt-4"><strong>Date Created:</strong> {new Date(report.created_at).toLocaleDateString()}</p>
      </div>

      <div
        id="report-summary"
        className="bg-blue-50 p-6 rounded-lg shadow-lg max-w-4xl mx-auto border border-gray-300 mt-6"
      > <h1 className="text-2xl font-bold text-blue-700 mb-2"> <b>Summary</b></h1><p>{summary.summary}</p> <br></br><p><h2 className="text-xl font-semibold text-blue-600"><b>Recommended Steps</b></h2>{summary.steps}</p> </div>
      
      <button
        onClick={handleDownloadPdf}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
      >
        Download PDF
      </button>
    </div>
  );
};

export default HemogramReportPdf;
