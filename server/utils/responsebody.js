//These object will be used as template for error responses

const errorResponseBody = {
  err: {},
  data: {},
  message: "Something went wrong,cannot process the request",
  success: false,
};

//These object will be used as template for success responses

const successResponseBody = {
  err: {},
  data: {},
  message: "Successfully processes the request",
  success: true,
}


export { errorResponseBody, successResponseBody };
