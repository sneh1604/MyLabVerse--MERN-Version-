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
dotenv.config();
const app = express();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyCmJIeonwGIeqQc2T2vL3EhetARTT4cuEA");

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const ProfileModel = require('./models/Profile');


app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(cookieParser());

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
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


app.get("/dashboard", verifyUser, (req, res) => {
    res.json("Success");
    return res.json({ message: "Successfully logged in admin" });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email: email })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, (err, response) => {
                    if (response) {
                        const token = jwt.sign({ email: user.email, role: user.role }, "wfiefcwmim", { expiresIn: '1d' });
                        res.cookie('token', token);
                        return res.json({ Status: "Success", role: user.role });
                    } else {
                        return res.json({ message: "The Password is incorrect" });
                    }
                });
            } else {
                return res.json({ message: "No Record Existed!" });
            }
        });
});

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

app.delete('/test-list/:id', verifyUser, (req, res) => {
    const { id } = req.params;
    TestListModel.findByIdAndUpdate(id, { delete_flag: true, date_updated: Date.now() }, { new: true })
        .then(test => res.json(test))
        .catch(err => res.status(400).json(err));
});

app.post('/hemogram-report', verifyUser, (req, res) => {
    const reportData = req.body;
    console.log('Received report data:', reportData);  // Log the data sent from the client

    // Validate required fields (adjust as needed based on your model)
    if (!reportData.clientId || !reportData.hemoglobin || !reportData.rbc_count || !reportData.wbc_count || !reportData.platelet_count) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    HemogramReportModel.create(reportData)
        .then(report => res.json({ message: 'Report submitted successfully', report }))
        .catch(err => {
            console.error('Error saving report:', err);
            res.status(400).json({ error: 'Failed to submit report', details: err });
        });
});

app.get('/hemogram-reports', verifyUser, async (req, res) => {
    var r = await UserModel.find({ 'email': req.user.email });
    console.log(r[0]._id);
    HemogramReportModel.find({ "clientId": r[0]._id })
        .then(reports => res.json(reports))
        .catch(err => res.status(500).json({ error: 'Failed to fetch reports', details: err }));

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

app.post('/lipid-report', verifyUser, (req, res) => {
    const reportData = req.body;
    LipidReport.create(reportData)
        .then(report => res.json({ message: 'Report submitted successfully', report }))
        .catch(err => res.status(400).json({ error: 'Failed to submit report', details: err }));
});

app.get('/lipid-report', verifyUser, async (req, res) => {
    var r = await UserModel.find({ 'email': req.user.email });
    console.log(r[0]._id);
    LipidReport.find({ "clientId": r[0]._id })
        .then(reports => res.json(reports))
        .catch(err => res.status(500).json({ error: 'Failed to fetch reports', details: err }));

});

app.post('/blood-sugar-report', verifyUser, (req, res) => {
    const reportData = req.body;
    BloodSugarReport.create(reportData)
        .then(report => res.json({ message: 'Report submitted successfully', report }))
        .catch(err => res.status(400).json({ error: 'Failed to submit report', details: err }));
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
        // Check if profile already exists for the user
        const existingProfile = await ProfileModel.findOne({ userId: req.user._id });
        if (existingProfile) {
            return res.status(400).json({ message: "Profile already exists" });
        }

        // Create new profile
        const profile = await ProfileModel.create({
            userId: req.user._id,
            firstName,
            lastName,
            age,
            gender,
            contact,
            address,
            medicalHistory
        });

        res.json({ message: 'Profile created successfully', profile });
    } catch (err) {
        console.error('Error creating profile:', err);
        res.status(500).json({ error: 'Failed to create profile' });
    }
});

// Endpoint to fetch the profile of the logged-in user
app.get('/profile', verifyUser, async (req, res) => {
    try {
        const profile = await ProfileModel.findOne({ userId: req.user._id });
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        res.json(profile);
    } catch (err) {
        console.error('Error fetching profile:', err);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

app.listen(4000, () => {
    console.log("Server is Running");
});
