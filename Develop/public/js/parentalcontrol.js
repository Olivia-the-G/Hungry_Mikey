document.getElementById('parentalControlSwitch').addEventListener('change', function() {
    let userInfoDiv = document.getElementById('userInfo');
    if(this.checked) {
        // Parental Controls Enabled
        const userData = {
            name: "John Doe",
            timeSpent: "2 hours",
            logins: [1, 0, 2, 1, 3, 1, 0] // Example data for each day of the week
        };
        displayUserData(userData);
        userInfoDiv.style.display = 'block';
    } else {
        // Parental Controls Disabled
        userInfoDiv.style.display = 'none';
    }
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
