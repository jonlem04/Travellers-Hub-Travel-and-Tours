document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting immediately

    const password = document.getElementById('Password-Field-Register').value;
    const confirmPassword = document.getElementById('Confirm-Password-Field-Register').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
    } else {
        const formData = new FormData(this);
        
        fetch(this.action, {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            alert(data); // Display whatever message the server sends
        })
        .catch(error => console.error('Error:', error));
    }
});
