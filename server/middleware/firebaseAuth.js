const admin = require('../config/firebase-admin');

const verifyFirebaseToken = async (req, res, next) => {
  try {
    console.log('Headers:', req.headers);
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('No valid authorization header');
      return res.status(401).json({ 
        error: 'No token provided',
        details: 'Authorization header must start with Bearer'
      });
    }

    const idToken = authHeader.split('Bearer ')[1];
    console.log('Verifying token:', idToken.substring(0, 20) + '...');

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log('Token verified for:', decodedToken.email);
    
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Firebase token verification error:', error);
    res.status(401).json({
      error: 'Invalid token',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { verifyFirebaseToken };
