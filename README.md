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

1. Edit your `fetch` to send a `POST` request to `"https://jsonplaceholder.typicode.com/posts"`
1. Send a JSON body with whatever properties you like
1. Don't forget the `"content-type"`
