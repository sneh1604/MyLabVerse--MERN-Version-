const xlsx = require('xlsx');
const path = require('path');

const generateTemplates = () => {
    const templatesPath = path.join(__dirname, '../public/templates');

    // Hemogram Template
    const hemogramData = [
        [
            'clientId', 'clientName', 'hemoglobin', 'rbc_count', 'wbc_count', 
            'platelet_count', 'polymorphs', 'lymphocytes', 'eosinophils', 
            'monocytes', 'basophils', 'pcv', 'mcv', 'mch', 'mchc', 'rdw',
            'rbcs', 'wbcs', 'platelet_option'
        ],
        [
            '65f1234567890abcdef12345', 'John Doe', '14.5', '5.2', '7500',
            '250000', '60', '30', '3', '5', '1', '45', '88', '30',
            '34', '13', 'normal', 'normal', 'normal'
        ]
    ];
    const hemogramWS = xlsx.utils.aoa_to_sheet(hemogramData);
    
    // Add template instructions
    hemogramWS['!cols'] = [
        {wch: 24}, // clientId width
        {wch: 20}, // clientName width
        {wch: 12}, // Other columns
        {wch: 12},
        {wch: 12}
    ];

    const hemogramWB = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(hemogramWB, hemogramWS, 'Hemogram');
    xlsx.writeFile(hemogramWB, path.join(templatesPath, 'hemogram_template.xlsx'));

    // Lipid Template with proper fields
    const lipidData = [
        [
            'clientId', 'clientName', 'serumCholesterol', 'serumTriglyceride',
            'hdlCholesterol', 'ldlCholesterol', 'vldlCholesterol', 'ldlHdlRatio',
            'totalCholesterolHdlRatio', 'totalLipids'
        ],
        [
            '65f1234567890abcdef12345', 'John Doe', '180', '150',
            '45', '110', '25', '2.4',
            '4.0', '600'
        ],
        // Add header descriptions for guidance
        [
            '(24 char hex)', '(Name)', '(150-200 mg/dL)', '(60-150 mg/dL)',
            '(40-60 mg/dL)', '(<100 mg/dL)', '(2-30 mg/dL)', '(<3.0)',
            '(<4.5)', '(400-1000 mg/dL)'
        ]
    ];

    // Add data validation and column widths
    const lipidWS = xlsx.utils.aoa_to_sheet(lipidData);
    lipidWS['!cols'] = [
        {wch: 24}, // clientId
        {wch: 20}, // clientName
        {wch: 15}, // serumCholesterol
        {wch: 15}, // serumTriglyceride
        {wch: 15}, // hdlCholesterol
        {wch: 15}, // ldlCholesterol
        {wch: 15}, // vldlCholesterol
        {wch: 12}, // ldlHdlRatio
        {wch: 20}, // totalCholesterolHdlRatio
        {wch: 12}  // totalLipids
    ];

    // Add colors and styling for the header row
    const headerStyle = {
        fill: { fgColor: { rgb: "FFE6E6FF" } },
        font: { bold: true },
        alignment: { horizontal: "center" }
    };

    // Apply header styling
    const range = xlsx.utils.decode_range(lipidWS['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = xlsx.utils.encode_cell({ r: 0, c: C });
        if (!lipidWS[address]) continue;
        lipidWS[address].s = headerStyle;
    }

    const lipidWB = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(lipidWB, lipidWS, 'Lipid');
    xlsx.writeFile(lipidWB, path.join(templatesPath, 'lipid_template.xlsx'));

    // Blood Sugar Template with proper fields
    const bloodSugarData = [
        [
            'clientId', 'clientName', 'fastingBloodSugar', 'postprandialBloodSugar',
            'hba1c', 'totalCholesterol', 'triglycerides'
        ],
        [
            '65f1234567890abcdef12345', 'John Doe', '95', '140',
            '5.2', '180', '150'
        ]
    ];
    const bloodSugarWS = xlsx.utils.aoa_to_sheet(bloodSugarData);
    bloodSugarWS['!cols'] = [
        {wch: 24}, // clientId width
        {wch: 20}, // clientName width
        {wch: 12}, // Other columns
        {wch: 12},
        {wch: 12}
    ];

    const bloodSugarWB = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(bloodSugarWB, bloodSugarWS, 'Blood Sugar');
    xlsx.writeFile(bloodSugarWB, path.join(templatesPath, 'bloodsugar_template.xlsx'));

    // Update the bulk upload guide
    const guideContent = `# Bulk Upload Guide for MyLabVerse

## Important Notes
- Use valid MongoDB ObjectIds for clientId (24 character hex string)
- All numeric values must be greater than 0
- Client name must match exactly with the database
- All fields are required - no empty values allowed

## Required Fields by Report Type

### Hemogram Report
- clientId (24 char hex)
- clientName
- hemoglobin (13.5-17.5 g/dL)
- rbc_count (4.7-6.1 million/µL)
- wbc_count (4,500-11,000 /µL)
- platelet_count (150,000-450,000 /µL)
- polymorphs (40-75%)
- lymphocytes (20-45%)
- eosinophils (1-6%)
- monocytes (2-10%)
- basophils (0-1%)
- pcv (36-50%)
- mcv (80-100 fL)
- mch (27-32 pg)
- mchc (32-36%)
- rdw (11.5-14.5%)
- rbcs (normal/low/high)
- wbcs (normal/low/high)
- platelet_option (normal/low/high)

### Lipid Profile Report
- clientId (24 char hex)
- clientName
- serumCholesterol (150-200 mg/dL)
- serumTriglyceride (60-150 mg/dL)
- hdlCholesterol (40-60 mg/dL)
- ldlCholesterol (<100 mg/dL)
- vldlCholesterol (2-30 mg/dL)
- ldlHdlRatio (<3.0)
- totalCholesterolHdlRatio (<4.5)
- totalLipids (400-1000 mg/dL)

### Blood Sugar Report
- clientId (24 char hex)
- clientName
- fastingBloodSugar (70-100 mg/dL)
- postprandialBloodSugar (<140 mg/dL)
- hba1c (4.0-5.6%)
- totalCholesterol (150-200 mg/dL)
- triglycerides (60-150 mg/dL)

## Common Errors
- Missing required fields
- Invalid clientId format (must be 24 character hex)
- Invalid numeric values (must be within specified ranges)
- Missing or incorrect client name
`;

    require('fs').writeFileSync(
        path.join(templatesPath, 'bulk_upload_guide.md'),
        guideContent
    );

    console.log('Templates and guide generated successfully!');
};

module.exports = generateTemplates;

// Run this directly if executed as script
if (require.main === module) {
    generateTemplates();
}
