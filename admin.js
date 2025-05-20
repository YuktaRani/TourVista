document.addEventListener('DOMContentLoaded', function() {
    // Check if user is admin
    fetch('/api/check-auth')
        .then(response => response.json())
        .then(data => {
            if (!data.isAdmin) {
                window.location.href = '/login.html';
            }
        });

    // Load bookings data when bookings tab is shown
    document.querySelector('a[href="#bookings"]').addEventListener('click', loadBookings);
    
    // Initial load if bookings tab is active
    if (window.location.hash === '#bookings') {
        loadBookings();
    }
});

function loadBookings() {
    const bookingsTable = document.getElementById('bookingsTable');
    
    fetch('/api/admin/bookings')
        .then(response => response.json())
        .then(bookings => {
            bookingsTable.innerHTML = bookings.map(booking => `
                <tr>
                    <td>${booking.id}</td>
                    <td>${booking.name}</td>
                    <td>${booking.origin}</td>
                    <td>${booking.destination}</td>
                    <td>${new Date(booking.date_time).toLocaleString()}</td>
                    <td>${booking.special_request || '-'}</td>
                    <td>${new Date(booking.created_at).toLocaleString()}</td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="deleteBooking(${booking.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        })
        .catch(error => {
            console.error('Error loading bookings:', error);
            alert('Error loading bookings. Please try again.');
        });
}

function deleteBooking(id) {
    if (confirm('Are you sure you want to delete this booking?')) {
        fetch(`/api/admin/bookings/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                loadBookings(); // Reload the table
            } else {
                throw new Error('Failed to delete booking');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error deleting booking. Please try again.');
        });
    }
}
