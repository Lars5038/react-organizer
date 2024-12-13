(function sendTwoRequests() {
    // Funktion für die Anfrage
    const sendRequest = (par) => {
        fetch(`http://127.0.0.1:3000/folders/${par}/self`, {
                method: 'GET',
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.text();
            })
            .then(data => {
                console.log('Response:', data);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    };

    // Zwei Anfragen senden
    for (let i = 0; i < 25; i++)
        sendRequest("" + i);
})();