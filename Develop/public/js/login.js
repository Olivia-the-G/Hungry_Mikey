const loginFormHandler = async (event) => {
    event.preventDefault();
  
    // Collect userinput from login form
    const username = document.querySelector('#username-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();
  
    if (username && password) {
      // send post request to API endpoint
      const response = await fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        // Redirect to the profile page
        document.location.replace('/game');
      } else {
        alert(response.statusText);
      }
    }
  };
  
  const signupFormHandler = async (event) => {
    event.preventDefault();
    generateDate();

    const fname = document.querySelector('#first-name-signup').value.trim();
    const username = document.querySelector('#username-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();
    const dateJoined = document.querySelector('#dateHidden').value.trim();
  
    if (fname && username && password && dateJoined) {
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({ fname, username, password, dateJoined }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        document.location.replace('/game');
      } else {
        alert(response.statusText);
      }
    }
  };
  
  function generateDate(){
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var currentTime = new Date();                
    var curdate = currentTime.toLocaleDateString(options);
    document.getElementById("dateHidden").value = curdate;
    console.log(curdate)
}

  document
    .querySelector('.login-form')
    .addEventListener('submit', loginFormHandler);
  
  document
    .querySelector('.signup-form')
    .addEventListener('submit', signupFormHandler);
  