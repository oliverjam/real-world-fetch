window.onload = (event) => {
    document.getElementById('start-fetch-button')
        .onclick = (event) => {
            const data = { name: "oli" };
            const newInit = new fetchInit(data);

            fetch(event.target.form.fetchUrl.value, newInit)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(response.status);
                    }
                    return response.json();
                })
                .then(json => console.log(json))
                .catch(err => console.error('Erroooor: ' + err.message));
        }
};