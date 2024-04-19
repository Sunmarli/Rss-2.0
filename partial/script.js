document.addEventListener('DOMContentLoaded', () => {
    const addForm = document.getElementById('addForm');
    const rssList = document.getElementById('rssList');

    addForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        const urlInput = document.getElementById('urlInput');
        const url = urlInput.value.trim();

        if (!url) {
            alert('Please enter a valid URL.');
            return;
        }

        try {
            const response = await fetch('/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url })
            });

            if (response.ok) {
                alert('RSS feed URL added successfully.');
                urlInput.value = ''; // Clear input field

                // Update the list of RSS feed URLs
                const listItem = document.createElement('li');
                listItem.textContent = url;
                
                // Add buttons for edit and remove actions
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.onclick = () => editUrl(url);
                
                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.onclick = () => removeUrl(url);
                
                listItem.appendChild(editButton);
                listItem.appendChild(removeButton);
                
                rssList.appendChild(listItem);
            } else {
                throw new Error('Failed to add RSS feed URL.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding the RSS feed URL. Please try again.');
        }
    });

    // Function to handle URL removal
    function removeUrl(url) {
        // Logic to remove the URL from the server or data structure
        console.log('Removing URL:', url);
        // Remove the corresponding list item from the DOM
        event.target.parentElement.remove();
    }

    // Function to handle URL editing
    function editUrl(url) {
        const newUrl = prompt('Enter the new URL:', url);
        if (newUrl && newUrl.trim() !== '') {
            // Logic to edit the URL on the server or data structure
            console.log('Editing URL:', url, 'to', newUrl);
            // Update the text content of the corresponding list item
            event.target.parentElement.textContent = newUrl;
        }
    }
});
