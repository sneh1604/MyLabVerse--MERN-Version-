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
        ]
    ];
    const lipidWS = xlsx.utils.aoa_to_sheet(lipidData);
    lipidWS['!cols'] = [
        {wch: 24}, // clientId width
        {wch: 20}, // clientName width
        {wch: 12}, // Other columns
        {wch: 12},
        {wch: 12}
    ];

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
- String values for rbcs, wbcs, and platelet_option must be one of: 'normal', 'low', 'high'
- Client name is required and must match the client's name in the database

## Normal Ranges
- Hemoglobin: 13.5-17.5 g/dL
- RBC Count: 4.7-6.1 million/µL
- WBC Count: 4,500-11,000 /µL
- Platelet Count: 150,000-450,000 /µL
- Invalid clientId format
- Missing required fields
- Values out of acceptable ranges
- Invalid option values for rbcs/wbcs/platelet_option
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
