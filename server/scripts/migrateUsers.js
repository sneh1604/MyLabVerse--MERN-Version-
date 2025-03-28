const mongoose = require('mongoose');
const UserModel = require('../models/User');

// Function to get the highest existing LIMSGL number
async function getHighestLIMSGLNumber() {
  const users = await UserModel.find({
    userTokenID: { $regex: /^LIMSGL-\d{3}$/ }
  }).sort({ userTokenID: -1 }).limit(1);

  if (users.length > 0) {
    const highestId = users[0].userTokenID;
    return parseInt(highestId.split('-')[1]);
  }
  return 0;
}

// Function to generate sequential token ID
async function generateTokenID() {
  const highestNumber = await getHighestLIMSGLNumber();
  const nextNumber = highestNumber + 1;
  return `LIMSGL-${nextNumber.toString().padStart(3, '0')}`;
}

async function migrateUsers() {
  try {
    await mongoose.connect('mongodb+srv://22it140:sneh5721@cluster0.qeah5qm.mongodb.net/limsbackup');
    console.log('Connected to MongoDB');

    // Get all users
    const users = await UserModel.find({}).sort({ createdAt: 1 });
    console.log(`Found ${users.length} total users`);

    let migrated = 0;
    let skipped = 0;

    for (const user of users) {
      try {
        // Skip if user already has a valid LIMSGL ID
        if (user.userTokenID && /^LIMSGL-\d{3}$/.test(user.userTokenID)) {
          console.log(`Skipping user ${user.email} - already has valid ID ${user.userTokenID}`);
          skipped++;
          continue;
        }

        // Generate new token ID
        const newTokenID = await generateTokenID();
        
        // Update user
        await UserModel.findByIdAndUpdate(
          user._id,
          { 
            $set: { 
              userTokenID: newTokenID,
              name: user.name || 'Unknown',
              email: user.email || `user_${newTokenID}@placeholder.com`
            }
          },
          { new: true, runValidators: true }
        );

        console.log(`Updated user ${user.email} with token ${newTokenID}`);
        migrated++;
      } catch (userError) {
        console.error(`Error updating user ${user.email}:`, userError.message);
      }
    }

    console.log('\nMigration Summary:');
    console.log(`Total users: ${users.length}`);
    console.log(`Migrated: ${migrated}`);
    console.log(`Skipped (already had valid ID): ${skipped}`);
    console.log('\nMigration completed successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

// Handle process errors
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

migrateUsers();
