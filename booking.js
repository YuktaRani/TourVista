document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    const toast = document.getElementById('successToast');
    const progress = toast.querySelector('.progress');
    const successMessage = toast.querySelector('.text.text-2');

    bookingForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Check if user is logged in
        const response = await fetch('/api/check-auth');
        const authData = await response.json();

        if (!authData.authenticated) {
            window.location.href = '/login.html';
            return;
        }

        const formData = {
            name: document.getElementById('name').value,
            origin: document.getElementById('origin').value,
            destination: document.getElementById('select1').value,
            dateTime: document.getElementById('datetime').value,
            specialRequest: document.getElementById('message').value
        };

        try {
            const response = await fetch('/api/booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                successMessage.textContent = 'Booking confirmed! ID: ' + data.bookingId;
                toast.classList.add('active');
                progress.classList.add('active');

                // Reset form and hide toast after delay
                setTimeout(() => {
                    toast.classList.remove('active');
                    progress.classList.remove('active');
                    bookingForm.reset();
                    // Redirect to homepage after successful booking
                    window.location.href = 'index.html';
                }, 3000);
            } else {
                const error = await response.json();
                alert(error.message || 'Error creating booking. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error creating booking. Please try again.');
        }
    });
});
