const mongoose = require('mongoose');
require('dotenv').config();

const UserModel = require('../models/User');

function generateTokenID() {
  const randomNum = Math.floor(Math.random() * 900) + 100;
  return `LIMSGL-${randomNum}`;
}

async function fixTokenIds() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const users = await UserModel.find({
      $or: [
        { userTokenID: { $exists: false } },
        { userTokenID: null },
        { userTokenID: { $not: /^LIMSGL-[0-9]{3}$/ } }
      ]
    });

    console.log(`Found ${users.length} users to fix`);

    for (const user of users) {
      user.userTokenID = generateTokenID();
      await user.save();
      console.log(`Fixed token for user ${user.email}: ${user.userTokenID}`);
    }

    console.log('Token ID migration completed');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

fixTokenIds();
