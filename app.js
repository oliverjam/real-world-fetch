class fetchInit {
    method = '';
    body = '';
    headers = '';

    constructor (data){
        this.method = "POST";
        this.body = JSON.stringify(data);
        this.headers = { "content-type": "application/json" };
    }
}

document.querySelector("form").addEventListener("submit", event => {
    event.preventDefault();
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;
    const data = { username, password };
    const newInit = new fetchInit(data);

    fetch("https://reqres.in/api/users", newInit)
        .then(response => {
            if (!response.ok) throw new Error(response.status);
            return response.json();
        })
        .then(json => console.log(json))
        .catch(error => console.error(error));
});
