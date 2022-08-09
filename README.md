# Orxata Ajax
Javascript class that facilitates the use of Ajax in jQuery. Having jQuery imported into the project is necessary in order to use it.

## Documentation

| FUNCTION  | ARGUMENTS TYPE | DESCRIPTION |
| --- | --- | -- |
| url (required) | string | Sets the url the request  |
| type | enum('GET','POST','PUT','DELETE','OPTIONS','PATCH') | Sets the type of the request |
| src | string | Sets the data source of the request |
| token (required) | string | Sets the token of the request. You can add it on js or set it on a meta tag with a name ended with "token" |
| data | object | Sets the arguments for the request |
| showLoading | boolean | True will show SweetAlert2 messages when the request starts, ends, or when an error occurs |
| startMessage | string, string | User friendly way to set the start message. Required showLoading = true |
| finishMessage | string, string | User friendly way to set the finish message. Required showLoading = true |
| errorMessage | string, string | User friendly way to set the error message. Required showLoading = true |
| swalLoadingStartMessage | [object](https://sweetalert2.github.io/) | SweetAlert2 way to set the start message. Required showLoading = true |
| swalLoadingFinishMessage | [object](https://sweetalert2.github.io/) | SweetAlert2 way to set the request end message. Required showLoading = true |
| swalLoadingErrorMessage | [object](https://sweetalert2.github.io/) | SweetAlert2 way to set the request error message. Required showLoading = true |
| exec | callback (optional), callback (optional) | Executes the Ajax request. Success and fail callback params will execute the callback functions |
| raw | string | Ables to set up the Ajax request object with raw options (\`url: 'localhost/foo', type: 'POST', data:{foo: "foo"}\`) |
| get | - | Returns the ajax request as a data feeder (for DataTables for example) |

## Usage
You can use **Orxata Ajax** in many different ways. Here are a few examples that I hope will help you understand how this Javascript class works.

### The simplest Orxata Ajax request:
```
let token = "MY_TOKEN";
new OrxataAjax()
  .url('localhost/get/data') // Default request type: GET
  .token(token)
  .exec(data => console.log(data), error => console.error(error)); // Expected: Console log with the request result data.
```

### Posting data with Orxata Ajax request:
```
// HTML <meta name="orxata-token" content="MY_TOKEN" />
new OrxataAjax()
  .type('POST')
  .url('localhost/set/data') 
  .data({foo: 'foo'}) 
  .exec(data => console.log(data), error => console.error(error)); 
```

### Loading data with Orxata Ajax request (with SweetAlert2 messages):
```
// HTML <meta name="csrf-token" content="MY_TOKEN" />
new OrxataAjax()
  .type('GET')
  .url('localhost/get/big_data') 
  .showLoading(true)
  .swalLoadingStartMessage({
    title: 'Loading data',
    text: 'Please wait',
    allowOutsideClick: false,
    showConfirmButton: false,
    didOpen: () => Swal.showLoading()
  })
  .swalLoadingFinishMessage({ 
        title: 'Done!',
        text: 'Everything is ready!',
        icon: 'success'
    })
  .swalLoadingErrorMessage({ 
        title: 'Oops!',
        text: 'Something went wrong...',
        icon: 'error'
    })
  .exec(data => console.log(data), error => console.error(error)); 
```

### Loading data with Orxata Ajax request (with SweetAlert2 messages):
```
// HTML <meta name="token" content="MY_TOKEN" />
new OrxataAjax()
  .type('GET')
  .url('localhost/get/big_data') 
  .showLoading(true)
  .startMessage('Loading data', 'Please wait')
  .finishMessage('Done!', 'The data is loaded successfully')
  .errorMessage('Woops!', 'Something went wrong...')
  .exec(data => console.log(data), error => console.error(error)); 
```

### Using DataTables with OrxataAjax:
```
let token = "MY_TOKEN",
    ajax = new OrxataAjax()
      .type('GET')
      .url('localhost/get/table/data')
      .data({filter: 'foo', _token: token})
      .src('regs')
      .token(token)
      .exec(data => { // Expected server response {status: 200, regs: [0-N]}
        dataTable = $('#dataTable').DataTable({
          data: data.regs,
          columns: [{data: 'id'}, {data: 'name'}, {data: 'value'}],
        })      
      }, error => console.error(error));
```
