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