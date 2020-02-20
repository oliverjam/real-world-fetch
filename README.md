# Real world fetch

The browser's `fetch` method is deliberately low-level. This means there are certain things you'll almost always need to do to make requests in a real application.

## HTTP errors

`fetch` is only concerned with making successful HTTP requests. From its perspective an error is a request that does not receive a response. Unfortunately a `404` response is still a "successful" response.

### Challenge

1. Open `workshop.html` in your editor
1. Add a `fetch` call to `"/njagnja"` (or any nonexistent URL)
1. Add a `.then()` and `.catch()`. Which of these runs? What does the response look like?

<details>
<summary>Answer</summary>

```js
fetch("/njagnja")
  .then(console.log)
  .catch(console.error);

// .then() runs and logs the response object
// { ok: false, status: 404, statusText: "Not Found" ...}
```

</details>

We need to handle HTTP responses we don't want ourself. We can do this by checking the `response.ok` property. This will be `true` for successful status codes (like `200`) and `false` for unsuccessful ones (like `404`).

### Challenge

1. Edit your `.then()` to check the response's `ok` property
1. If the response is not okay throw a new error with the `statusText` property of the response
1. Now does your `.catch()` run?

<details>
<summary>Answer</summary>

```js
fetch("/njagnja")
  .then(response => {
    if (!response.ok) throw new Error(response.statusText);
    console.log(response);
  })
  .catch(console.error);

// .then() runs and sees its a 404
// it throws a new error with the "Not Found" text
// the catch will catch the error and log "Not Found"
```

</details>

## Submitting data

`fetch` allows us to make any kind of HTTP request we like. So far we have only looked at `GET` requests, but those won't allow us to submit data to a server.

### Method

The second argument to `fetch` is an [options object](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters). We can pass a `method` property in here to send requests other than `GET`.

### Headers

We can also use these options to send request headers. For example if we're submitting JSON we should set the `"content-type"` header to `"application/json"`.

### Body

The options object also takes a `body` property. This is where we put data we want to submit with our request. If we're sending JSON we also need to `JSON.stringify` the data.

### Challenge

1. Edit your `fetch` to send a `POST` request to `"https://reqres.in/api/users"`
1. Send a JSON body with whatever properties you like
1. Don't forget the `"content-type"`

<details>
<summary>Answer</summary>

```js
const data = { name: "oli" };

fetch("https://reqres.in/api/users", {
  method: "POST",
  body: JSON.stringify(data),
  headers: { "content-type": "application/json" },
})
  .then(response => {
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  })
  .then(json => console.log(json))
  .catch(error => console.error(error));

// should log something like: { name: "oli", id: "499", createdAt: "2020-02-17T16:03:13.654Z" }
```

</details>

## User input

So far we've only hard-coded our requests. In reality they're usually triggered by a user submitting a form or clicking a button. There are several different ways we can access form data in our JavaScript.

### Forms

Forms are the semantically correct element for receiving user input. We should use them even when we're using JS to handle the request (rather than relying on the native browser submission).

We can add a handler for the submit event like this:

```js
document.querySelector("form").addEventListener("submit", event => {
  event.preventDefault();
}))
```

`event.preventDefault()` will stop the browser trying to send the request for you. We want to handle the request with `fetch` instead.

### `querySelector`

We can use [`querySelector`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) to directly access each form input, then get its value. For example `document.querySelector("#username").value`.

#### Challenge

1. Create a form with two inputs and a submit button
1. Add a `"submit"` event handler to the form (don't forget `preventDefault`)
1. Use `querySelector` to get each input's value
1. Use `fetch` to `POST` the data as JSON to the same URL as before

<details>
<summary>Answer</summary>

```html
<form>
  <label for="username">Post title</label>
  <input id="username" />
  <label for="password">Password</label>
  <input type="password" id="password" />
  <button type="submit">Log in</button>
</form>

<script>
  const form = document.querySelector("form");
  form.addEventListener("submit", event => {
    event.preventDefault();
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;
    const data = { username, password };
    fetch("https://reqres.in/api/users", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "content-type": "application/json" },
    })
      .then(response => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then(json => console.log(json))
      .catch(error => console.error(error));
  });
</script>
```

</details>

### `event.target.elements`

The form's submit event already contains references to each named element within it. We can access this at `event.target.elements.inputName`.

1. Make sure your inputs have unique `name` attributes
1. Use [`event.target.elements`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/elements) to get the input values
1. Submit the values as JSON like before

<details>
<summary>Answer</summary>

```html
<form>
  <label for="username">Post title</label>
  <input id="username" name="username" />
  <label for="password">Password</label>
  <input type="password" id="password" name="password" />
  <button type="submit">Log in</button>
</form>

<script>
  const form = document.querySelector("form");
  form.addEventListener("submit", event => {
    event.preventDefault();
    const username = event.target.elements.username.value;
    const password = event.target.elements.password.value;
    const data = { username, password };
    fetch("https://reqres.in/api/users", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "content-type": "application/json" },
    })
      .then(response => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then(json => console.log(json))
      .catch(error => console.error(error));
  });
</script>
```

</details>

### `new FormData()`

There is a built-in API that mirrors a form's native behaviour. We can use `new FormData(event.target)` to create a [`FormData` interface](https://developer.mozilla.org/en-US/docs/Web/API/FormData). This is what the form would send if we didn't call `preventDefault()`.

If we want to submit this as JSON we need to turn it into a normal object. You can do this with a `for..of` loop or use `Object.fromEntries(data)`. Note: `fromEntries()` is relatively new and isn't supported in Edge/IE yet.

#### Challenge

1. Use `new FormData()` to get all the input values
1. Turn the FormData into an object
1. Submit the values as JSON like before

<details>
<summary>Answer</summary>

```html
<form>
  <label for="username">Post title</label>
  <input id="username" name="username" />
  <label for="password">Password</label>
  <input type="password" id="password" name="password" />
  <button type="submit">Log in</button>
</form>

<script>
  const form = document.querySelector("form");
  form.addEventListener("submit", event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    fetch("https://reqres.in/api/users", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "content-type": "application/json" },
    })
      .then(response => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then(json => console.log(json))
      .catch(error => console.error(error));
  });
</script>
```

</details>

## Workshop

We're going to make a Pokémon search page using the PokéAPI.

1. Create a form with a search input and submit button
1. When the form is submitted request the Pokémon the user typed from `"https://pokeapi.co/api/v2/pokemon/{{NAME}}"`
1. If the request succeeds show the Pokémon's name and sprite
1. If the request fails show a relevant error to the user
