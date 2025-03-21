# Bulk Upload Guide for MyLabVerse

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
