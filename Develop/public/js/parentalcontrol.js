const User = require('./models/activity.js');

document.getElementById('parentalControlSwitch').addEventListener('change', function () {

    /**
     * Fetch activity data for a specific user.
     * 
     * @param {number} userId - The ID of the user for whom to fetch activity data.
     * @returns {Promise<Object|null>} Activity data if found, null otherwise.
     */
    async function fetchUserActivity(userId) {
        try {
            // Find the activity data by user's ID
            const activity = await Activity.findOne({ where: { name_id: userId } });

            // If no activity data is found, return null
            if (!activity) {
                return null;
            }

            // Extracting the values for each day
            const activityData = {
                monday: activity.monday,
                tuesday: activity.tuesday,
                wednesday: activity.wednesday,
                thursday: activity.thursday,
                friday: activity.friday,
                saturday: activity.saturday,
                sunday: activity.sunday,
            };

            return activityData;
        } catch (error) {
            console.error('Error fetching user activity:', error);
            throw error;
        }
    }
}

  
}

    module.exports = { fetchAllUsers };
});

function displayUserData(userData) {
    const userInfoDiv = document.getElementById('userInfo');
    userInfoDiv.innerHTML = `
        <h2>User Information</h2>
        <p>Name: ${userData.name}</p>
        <p>Time Spent: ${userData.timeSpent}</p>
        <p>Logins (Sun-Sat): ${userData.logins.join(', ')}</p>
    `;
}
