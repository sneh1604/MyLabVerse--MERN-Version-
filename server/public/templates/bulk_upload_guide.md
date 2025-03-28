# Bulk Upload Guide for MyLabVerse

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
