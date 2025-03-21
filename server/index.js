const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

const UserModel = require("./models/User");
const TestListModel = require("./models/TestList");
const HemogramReportModel = require('./models/HemogramReport');
const LipidReportModel = require('./models/LipidReport');
const LipidReport = require('./models/LipidReport');
const BloodSugarReport = require('./models/BloodSugar');
const AdministratorModel = require('./models/Administrator');
const StaffActivityModel = require('./models/StaffActivity');
const PerformanceMetricsModel = require('./models/PerformanceMetrics');
dotenv.config();
const app = express();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyAr7rZzlbvBfhKa9fFekY4-LIFW4J2fILQ");

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const ProfileModel = require('./models/Profile');
const multer = require('multer');
const xlsx = require('xlsx');
const UploadHistory = require('./models/UploadHistory');

const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Add PATCH to allowed methods
    credentials: true
}));
app.use(cookieParser());

app.use('/templates', express.static('public/templates'));

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        // Generate templates after successful database connection
        try {
            generateTemplates();
            console.log('Templates generated successfully');
        } catch (error) {
            console.error('Error generating templates:', error);
        }
    })
    .catch((err) => console.log('Failed to connect to MongoDB', err));

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    bcrypt.hash(password, 10)
        .then(hash => {
            UserModel.create({ name, email, password: hash })
                .then(user => {
                    res.json("Success");
                    console.log("Register Successfully!");
                })
                .catch(err => res.json(err));
        }).catch(error => res.json(error));
});

const verifyUser = (req, res, next) => {
    const token = req.cookies.token || req.query.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(403).json("Token is missing");
    } else {
        jwt.verify(token, 'wfiefcwmim', (err, decoded) => {
            if (err) {
                return res.status(403).json("Error with token");
            } else {
                req.user = decoded; // Add the decoded user data to the request object
                next();
            }
        });
    }
};

// Verify Administrator middleware
const verifyAdministrator = (req, res, next) => {
    const token = req.cookies.token || req.query.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(403).json("Token is missing");
    } else {
        jwt.verify(token, 'wfiefcwmim', (err, decoded) => {
            if (err) {
                return res.status(403).json("Error with token");
            } else {
                if (decoded.role !== 'administrator') {
                    return res.status(403).json("Access denied: Administrator role required");
                }
                req.user = decoded;
                next();
            }
        });
    }
};

app.get("/dashboard", verifyUser, (req, res) => {
    res.json("Success");
    return res.json({ message: "Successfully logged in admin" });
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email: email });
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const token = jwt.sign({ email: user.email, role: user.role, id: user._id }, "wfiefcwmim", { expiresIn: '1d' });
                res.cookie('token', token);
                
                // Track login for admin users
                if (user.role === 'admin') {
                    await trackStaffActivity(user._id, 'login');
                }
                
                return res.json({ 
                    Status: "Success", 
                    role: user.role, 
                    name: user.name, 
                    email: user.email 
                });
            } else {
                return res.json({ message: "The Password is incorrect" });
            }
        } else {
            return res.json({ message: "No Record Existed!" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error during login" });
    }
});

app.post("/administrator/login", (req, res) => {
    const { email, password } = req.body;
    AdministratorModel.findOne({ email: email })
        .then(admin => {
            if (admin) {
                bcrypt.compare(password, admin.password, (err, response) => {
                    if (response) {
                        const token = jwt.sign(
                            { email: admin.email, role: admin.role, id: admin._id }, 
                            "wfiefcwmim", 
                            { expiresIn: '1d' }
                        );
                        res.cookie('token', token);
                        return res.json({ 
                            Status: "Success", 
                            role: admin.role, 
                            name: admin.name, 
                            email: admin.email 
                        });
                    } else {
                        return res.json({ message: "The Password is incorrect" });
                    }
                });
            } else {
                return res.json({ message: "No Administrator Found!" });
            }
        });
});

// Register new administrator (only existing administrators can create new ones)
app.post('/administrator/register', verifyAdministrator, (req, res) => {
    const { name, email, password, contactNumber, position } = req.body;
    bcrypt.hash(password, 10)
        .then(hash => {
            AdministratorModel.create({ 
                name, 
                email, 
                password: hash, 
                contactNumber, 
                position 
            })
                .then(admin => {
                    res.json({
                        status: "Success",
                        message: "Administrator registered successfully"
                    });
                })
                .catch(err => res.status(500).json({ error: err.message }));
        }).catch(error => res.status(500).json({ error: error.message }));
});

// Get all staff members (admins)
app.get('/administrator/staff', verifyAdministrator, (req, res) => {
    UserModel.find({ role: 'admin' })
        .select('name email _id')
        .then(staff => res.json(staff))
        .catch(err => res.status(500).json({ error: 'Failed to fetch staff list', details: err }));
});

// Get staff activity logs
app.get('/administrator/staff-activities', verifyAdministrator, async (req, res) => {
    try {
        const { staffId, startDate, endDate, activityType } = req.query;
        
        let query = {};
        
        if (staffId) query.staffId = staffId;
        if (activityType) query.activityType = activityType;
        
        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }
        
        const activities = await StaffActivityModel.find(query)
            .sort({ timestamp: -1 })
            .populate('staffId', 'name email')
            .limit(100);
            
        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch staff activities', details: error.message });
    }
});

// Get performance metrics for staff
app.get('/administrator/performance-metrics', verifyAdministrator, async (req, res) => {
    try {
        const { staffId, startDate, endDate } = req.query;
        
        let query = {};
        
        if (staffId) query.staffId = staffId;
        
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }
        
        const metrics = await PerformanceMetricsModel.find(query)
            .sort({ date: -1 })
            .populate('staffId', 'name email');
            
        res.json(metrics);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch performance metrics', details: error.message });
    }
});

// Get aggregated laboratory statistics
app.get('/administrator/lab-statistics', verifyAdministrator, async (req, res) => {
    try {
        // Total reports by type
        const hemogramCount = await HemogramReportModel.countDocuments();
        const lipidCount = await LipidReportModel.countDocuments();
        const bloodSugarCount = await BloodSugarReport.countDocuments();
        
        // Total clients
        const clientCount = await UserModel.countDocuments({ role: { $ne: 'admin' } });
        
        // Total staff (admins)
        const staffCount = await UserModel.countDocuments({ role: 'admin' });
        
        // Reports per day (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const dailyReports = await Promise.all([
            HemogramReportModel.aggregate([
                { $match: { created_at: { $gte: sevenDaysAgo } } },
                { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } }, count: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ]),
            LipidReport.aggregate([
                { $match: { dateCreated: { $gte: sevenDaysAgo } } },
                { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$dateCreated" } }, count: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ]),
            BloodSugarReport.aggregate([
                { $match: { dateCreated: { $gte: sevenDaysAgo } } },
                { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$dateCreated" } }, count: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ])
        ]);
        
        res.json({
            totalReports: {
                hemogram: hemogramCount,
                lipid: lipidCount,
                bloodSugar: bloodSugarCount,
                total: hemogramCount + lipidCount + bloodSugarCount
            },
            clientCount,
            staffCount,
            dailyReports: {
                hemogram: dailyReports[0],
                lipid: dailyReports[1],
                bloodSugar: dailyReports[2]
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch laboratory statistics', details: error.message });
    }
});

// Track staff activity (middleware or direct call)
const trackStaffActivity = async (staffId, activityType, details = {}) => {
    try {
        await StaffActivityModel.create({
            staffId,
            activityType,
            details,
            timestamp: new Date()
        });
    } catch (error) {
        console.error('Error tracking staff activity:', error);
    }
};

app.get('/registered-users', verifyUser, (req, res) => {
    UserModel.find()
        .then(users => {
            res.json(users);
        })
        .catch(err => res.json(err));
});

app.get('/clients', verifyUser, (req, res) => {
    UserModel.find({ role: { $ne: 'admin' } })
        .then(clients => res.json(clients))
        .catch(err => res.status(500).json({ error: 'Failed to fetch clients', details: err }));
});

app.post('/test-list', verifyUser, (req, res) => {
    const { name, description, cost, status, delete_flag } = req.body;
    TestListModel.create({ name, description, cost, status, delete_flag })
        .then(test => res.json(test))
        .catch(err => res.status(400).json(err));
});

app.get('/test-list', verifyUser, (req, res) => {
    TestListModel.find({ delete_flag: false })
        .then(tests => res.json(tests))
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch test list' });
        });
});

app.put('/test-list/:id', verifyUser, (req, res) => {
    const { id } = req.params;
    const { name, description, cost, status, delete_flag } = req.body;
    TestListModel.findByIdAndUpdate(id, { name, description, cost, status, delete_flag, date_updated: Date.now() }, { new: true })
        .then(test => res.json(test))
        .catch(err => res.status(400).json(err));
});

app.patch('/test-list/:id', verifyUser, (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    
    TestListModel.findByIdAndUpdate(
        id, 
        { ...updateData, date_updated: Date.now() },
        { new: true }
    )
    .then(test => {
        if (!test) {
            return res.status(404).json({ error: 'Test not found' });
        }
        res.json(test);
    })
    .catch(err => {
        console.error('Error updating test:', err);
        res.status(400).json({ error: 'Failed to update test', details: err.message });
    });
});

app.delete('/test-list/:id', verifyUser, (req, res) => {
    const { id } = req.params;
    TestListModel.findByIdAndUpdate(id, { delete_flag: true, date_updated: Date.now() }, { new: true })
        .then(test => res.json(test))
        .catch(err => res.status(400).json(err));
});

app.post('/hemogram-report', verifyUser, async (req, res) => {
    const reportData = req.body;
    
    try {
        if (!reportData.clientId || !reportData.hemoglobin || !reportData.rbc_count || !reportData.wbc_count || !reportData.platelet_count) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const report = await HemogramReportModel.create(reportData);
        
        // Track activity if the user is an admin
        if (req.user.role === 'admin') {
            await trackStaffActivity(
                req.user.id, 
                'report_creation', 
                { 
                    reportType: 'hemogram', 
                    clientId: reportData.clientId,
                    action: 'create'
                }
            );
            
            // Update performance metrics
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const metrics = await PerformanceMetricsModel.findOne({
                staffId: req.user.id,
                date: { $gte: today }
            });
            
            if (metrics) {
                metrics.reportsGenerated += 1;
                metrics.testsProcessed += 1;
                metrics.reportTypes.hemogram += 1;
                await metrics.save();
            } else {
                await PerformanceMetricsModel.create({
                    staffId: req.user.id,
                    reportsGenerated: 1,
                    testsProcessed: 1,
                    clientsServed: 1,
                    reportTypes: {
                        hemogram: 1
                    }
                });
            }
        }
        
        res.json({ message: 'Report submitted successfully', report });
    } catch (err) {
        console.error('Error saving report:', err);
        res.status(400).json({ error: 'Failed to submit report', details: err });
    }
});

app.get('/hemogram-reports', verifyUser, async (req, res) => {
    var r = await UserModel.find({ 'email': req.user.email });
    console.log(r[0]._id);
    HemogramReportModel.find({ "clientId": r[0]._id })
        .then(reports => res.json(reports))
        .catch(err => res.status(500).json({ error: 'Failed to fetch reports', details: err }));

});

// Add the missing hemogram-report route (single report endpoint)
app.get('/hemogram-report/:id', verifyUser, async (req, res) => {
    try {
        const report = await HemogramReportModel.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }
        res.json(report);
    } catch (err) {
        console.error('Error fetching hemogram report:', err);
        res.status(500).json({ error: 'Failed to fetch report', details: err });
    }
});

// Add a general route to fetch a single hemogram report by ID (without authentication)
// This can be used for sharing reports with healthcare providers
app.get('/public/hemogram-report/:id/:token', async (req, res) => {
    try {
        // Simple token validation - in production, use a more secure method
        const { id, token } = req.params;
        
        // Check if token is valid (this is a simple example)
        if (token !== 'public-access-token') {
            return res.status(403).json({ error: 'Invalid access token' });
        }
        
        const report = await HemogramReportModel.findById(id);
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }
        res.json(report);
    } catch (err) {
        console.error('Error fetching public hemogram report:', err);
        res.status(500).json({ error: 'Failed to fetch report', details: err });
    }
});

app.get('/hemogram-graph', verifyUser, async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find hemogram reports for the user
        const reports = await HemogramReportModel.find({ clientId: user._id });

        // Prepare data for the graph (e.g., dates, hemoglobin, RBC count, WBC count)
        const graphData = reports.map(report => ({
            date: new Date(report.created_at).toLocaleDateString(),
            hemoglobin: report.hemoglobin,
            rbc_count: report.rbc_count,
            wbc_count: report.wbc_count,
            platelet_count: report.platelet_count
        }));

        // Normal ranges for comparison
        const normalRanges = {
            hemoglobin: { min: 13.5, max: 17.5 },
            rbc_count: { min: 4.7, max: 6.1 },
            wbc_count: { min: 4500, max: 11000 },
            platelet_count: { min: 150000, max: 450000 }
        };

        return res.json({ graphData, normalRanges });
    } catch (error) {
        console.error('Error fetching hemogram graph data:', error);
        return res.status(500).json({ error: 'Failed to fetch graph data', details: error });
    }
});


app.post('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'Logout successful' });
});

app.post('/admin-logout', verifyUser, async (req, res) => {
    try {
        // Track logout for admin users
        if (req.user.role === 'admin') {
            await trackStaffActivity(req.user.id, 'logout');
        }
        
        res.clearCookie('token');
        return res.json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ error: 'Error during logout' });
    }
});

app.get('/is-logged-in', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ loggedIn: false });
    }

    jwt.verify(token, 'wfiefcwmim', (err, decoded) => {
        if (err) {
            return res.json({ loggedIn: false });
        }
        return res.json({ loggedIn: true, user: decoded });
    });
});

app.post('/lipid-report', verifyUser, async (req, res) => {
    const reportData = req.body;
    try {
        if (!reportData.clientId || !reportData.serumCholesterol || !reportData.ldlCholesterol || !reportData.totalCholesterolHdlRatio || !reportData.totalLipids) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const report = await LipidReportModel.create(reportData);
        
        // Track activity if the user is an admin
        if (req.user.role === 'admin') {
            await trackStaffActivity(
                req.user.id, 
                'report_creation', 
                { 
                    reportType: 'lipid', 
                    clientId: reportData.clientId,
                    action: 'create'
                }
            );
            
            // Update performance metrics
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const metrics = await PerformanceMetricsModel.findOne({
                staffId: req.user.id,
                date: { $gte: today }
            });
            
            if (metrics) {
                metrics.reportsGenerated += 1;
                metrics.testsProcessed += 1;
                metrics.reportTypes.lipid += 1;
                await metrics.save();
            } else {
                await PerformanceMetricsModel.create({
                    staffId: req.user.id,
                    reportsGenerated: 1,
                    testsProcessed: 1,
                    clientsServed: 1,
                    reportTypes: {
                        lipid: 1
                    }
                });
            }
        }
        
        res.json({ message: 'Report submitted successfully', report });
    } catch (err) {
        console.error('Error saving report:', err);
        res.status(400).json({ error: 'Failed to submit report', details: err });
    }
});

app.get('/lipid-report', verifyUser, async (req, res) => {
    var r = await UserModel.find({ 'email': req.user.email });
    console.log(r[0]._id);
    LipidReport.find({ "clientId": r[0]._id })
        .then(reports => res.json(reports))
        .catch(err => res.status(500).json({ error: 'Failed to fetch reports', details: err }));

});

app.post('/blood-sugar-report', verifyUser, async (req, res) => {
    const reportData = req.body;
    try {
        if (!reportData.clientId || !reportData.fastingBloodSugar || !reportData.totalCholesterol || !reportData.postprandialBloodSugar) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const report = await BloodSugarReport.create(reportData);
        
        // Track activity if the user is an admin
        if (req.user.role === 'admin') {
            await trackStaffActivity(
                req.user.id, 
                'report_creation', 
                { 
                    reportType: 'blood_sugar', 
                    clientId: reportData.clientId,
                    action: 'create'
                }
            );
            
            // Update performance metrics
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const metrics = await PerformanceMetricsModel.findOne({
                staffId: req.user.id,
                date: { $gte: today }
            });
            
            if (metrics) {
                metrics.reportsGenerated += 1;
                metrics.testsProcessed += 1;
                metrics.reportTypes.bloodSugar += 1;
                await metrics.save();
            } else {
                await PerformanceMetricsModel.create({
                    staffId: req.user.id,
                    reportsGenerated: 1,
                    testsProcessed: 1,
                    clientsServed: 1,
                    reportTypes: {
                        bloodSugar: 1
                    }
                });
            }
        }
        
        res.json({ message: 'Report submitted successfully', report });
    } catch (err) {
        console.error('Error saving report:', err);
        res.status(400).json({ error: 'Failed to submit report', details: err });
    }
});

app.get('/blood-sugar-report', verifyUser, async (req, res) => {
    var r = await UserModel.find({ 'email': req.user.email });
    BloodSugarReport.find({ "clientId": r[0]._id })
        .then(reports => res.json(reports))
        .catch(err => res.status(500).json({ error: 'Failed to fetch reports', details: err }));

});

app.get('/blood-sugar-graph', verifyUser, async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.user.email });
        const reports = await BloodSugarReport.find({ clientId: user._id }); // Fetch reports for the user
        res.json(reports);
    } catch (error) {
        console.error('Error fetching blood sugar reports:', error);
        res.status(500).json({ error: 'Failed to fetch blood sugar reports' });
    }
});

app.post('/aiml', async (req, res) => {
    try {
        // console.log(req.body);
//         let keys = [];
//         for (var k in req.body) keys.push(k);
// console.log(keys);
        const prompt = `Here is my medical report in json format. create overall summary of it, also provide steps to control it . OUTPUT in JSON ONLY no output formating, just raw json as output. <report>${JSON.stringify( req.body)}</report>`;
        let result = await model.generateContent([prompt]);
        res.json(result.response.text());
        // res.json("AA");

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: `Failed ${error}` });

    }
});

app.post('/profile', verifyUser, async (req, res) => {
    const { firstName, lastName, age, gender, contact, address, medicalHistory } = req.body;
    
    try {
        // Validate input data
        if (!firstName || !lastName || !age || !gender || !contact || !address) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate age
        if (age < 0 || age > 150) {
            return res.status(400).json({ error: 'Invalid age' });
        }

        // Validate contact number
        const contactRegex = /^\d{10}$/;  // Assumes 10-digit phone number
        if (!contactRegex.test(contact)) {
            return res.status(400).json({ error: 'Invalid contact number format' });
        }

        // Find existing profile or create new one (upsert)
        const profile = await ProfileModel.findOneAndUpdate(
            { userId: req.user.id },
            {
                firstName,
                lastName,
                age,
                gender,
                contact,
                address,
                medicalHistory,
                updatedAt: new Date()
            },
            { 
                new: true,        // Return updated document
                upsert: true,     // Create if doesn't exist
                runValidators: true // Run model validations
            }
        );

        res.json({ 
            message: 'Profile saved successfully', 
            profile,
            isNewProfile: !profile.createdAt
        });
    } catch (err) {
        console.error('Error saving profile:', err);
        res.status(500).json({ 
            error: 'Failed to save profile',
            details: err.message 
        });
    }
});

app.get('/profile', verifyUser, async (req, res) => {
    try {
        const profile = await ProfileModel.findOne({ userId: req.user.id })
            .select('-__v'); // Exclude version key

        if (!profile) {
            return res.status(404).json({ 
                message: "Profile not found",
                shouldCreate: true
            });
        }

        res.json({
            profile,
            lastUpdated: profile.updatedAt
        });
    } catch (err) {
        console.error('Error fetching profile:', err);
        res.status(500).json({ 
            error: 'Failed to fetch profile',
            details: err.message 
        });
    }
});

// Add endpoint to check if profile exists
app.get('/profile/exists', verifyUser, async (req, res) => {
    try {
        const profile = await ProfileModel.findOne({ userId: req.user.id });
        res.json({ exists: !!profile });
    } catch (err) {
        console.error('Error checking profile existence:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Initial administrator setup endpoint (used only for the first administrator)
app.post('/initial-administrator-setup', async (req, res) => {
    try {
        // Check if there are any existing administrators
        const existingAdmin = await AdministratorModel.findOne();
        if (existingAdmin) {
            return res.status(403).json({ error: 'Administrator already exists. Initial setup is not allowed.' });
        }

        const { name, email, password, contactNumber, position } = req.body;
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create the administrator
        const admin = await AdministratorModel.create({
            name,
            email,
            password: hashedPassword,
            contactNumber,
            position
        });
        
        res.json({
            status: "Success",
            message: "Initial administrator setup completed successfully"
        });
    } catch (err) {
        console.error('Error during initial administrator setup:', err);
        res.status(500).json({ error: err.message });
    }
});

// Check if any administrators exist
app.get('/check-admin-exists', async (req, res) => {
  try {
    const adminCount = await AdministratorModel.countDocuments();
    res.json({ exists: adminCount > 0 });
  } catch (err) {
    console.error('Error checking admin existence:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Bulk upload endpoint for Hemogram reports
app.post('/bulk-upload/hemogram', verifyAdministrator, upload.single('file'), async (req, res) => {
    try {
        const workbook = xlsx.read(req.file.buffer);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);

        let successCount = 0;
        let failureCount = 0;
        let errors = [];

        for (let i = 0; i < data.length; i++) {
            try {
                const row = data[i];
                // Validate clientId format
                if (!mongoose.Types.ObjectId.isValid(row.clientId)) {
                    throw new Error('Invalid clientId format');
                }

                const report = await HemogramReportModel.create({
                    clientId: row.clientId,
                    clientName: row.clientName,
                    hemoglobin: row.hemoglobin,
                    rbc_count: row.rbc_count,
                    wbc_count: row.wbc_count,
                    platelet_count: row.platelet_count,
                    polymorphs: row.polymorphs,
                    lymphocytes: row.lymphocytes,
                    eosinophils: row.eosinophils,
                    monocytes: row.monocytes,
                    basophils: row.basophils,
                    pcv: row.pcv,
                    mcv: row.mcv,
                    mch: row.mch,
                    mchc: row.mchc,
                    rdw: row.rdw,
                    rbcs: row.rbcs,
                    wbcs: row.wbcs,
                    platelet_option: row.platelet_option
                });
                successCount++;
            } catch (err) {
                failureCount++;
                errors.push({ 
                    row: i + 2, 
                    message: err.message,
                    details: err.errors ? Object.values(err.errors).map(e => e.message) : []
                });
            }
        }

        // Record upload history
        await UploadHistory.create({
            adminId: req.user.id,
            fileName: req.file.originalname,
            reportType: 'hemogram',
            successCount,
            failureCount,
            errors
        });

        res.json({ successCount, failureCount, errors });
    } catch (error) {
        res.status(500).json({ error: 'Failed to process file', details: error.message });
    }
});

// Bulk upload endpoint for Lipid reports
app.post('/bulk-upload/lipid', verifyAdministrator, upload.single('file'), async (req, res) => {
    try {
        const workbook = xlsx.read(req.file.buffer);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);

        let successCount = 0;
        let failureCount = 0;
        let errors = [];

        for (let i = 0; i < data.length; i++) {
            try {
                const row = data[i];
                const report = await LipidReportModel.create({
                    clientId: row.clientId,
                    serumCholesterol: row.serumCholesterol,
                    ldlCholesterol: row.ldlCholesterol,
                    totalCholesterolHdlRatio: row.totalCholesterolHdlRatio,
                    totalLipids: row.totalLipids
                });
                successCount++;
            } catch (err) {
                failureCount++;
                errors.push({ row: i + 2, message: err.message });
            }
        }

        await UploadHistory.create({
            adminId: req.user.id,
            fileName: req.file.originalname,
            reportType: 'lipid',
            successCount,
            failureCount,
            errors
        });

        res.json({ successCount, failureCount, errors });
    } catch (error) {
        res.status(500).json({ error: 'Failed to process file', details: error.message });
    }
});

// Bulk upload endpoint for Blood Sugar reports
app.post('/bulk-upload/bloodsugar', verifyAdministrator, upload.single('file'), async (req, res) => {
    try {
        const workbook = xlsx.read(req.file.buffer);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);

        let successCount = 0;
        let failureCount = 0;
        let errors = [];

        for (let i = 0; i < data.length; i++) {
            try {
                const row = data[i];
                const report = await BloodSugarReport.create({
                    clientId: row.clientId,
                    fastingBloodSugar: row.fastingBloodSugar,
                    totalCholesterol: row.totalCholesterol,
                    postprandialBloodSugar: row.postprandialBloodSugar
                });
                successCount++;
            } catch (err) {
                failureCount++;
                errors.push({ row: i + 2, message: err.message });
            }
        }

        await UploadHistory.create({
            adminId: req.user.id,
            fileName: req.file.originalname,
            reportType: 'bloodsugar',
            successCount,
            failureCount,
            errors
        });

        res.json({ successCount, failureCount, errors });
    } catch (error) {
        res.status(500).json({ error: 'Failed to process file', details: error.message });
    }
});

// Get upload history for an administrator
app.get('/upload-history', verifyAdministrator, async (req, res) => {
    try {
        const history = await UploadHistory.find({ adminId: req.user.id })
            .sort({ uploadDate: -1 })
            .limit(50);
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch upload history' });
    }
});

const generateTemplates = require('./utils/generateTemplates');

app.listen(4000, () => {
    console.log("Server is Running");
});
