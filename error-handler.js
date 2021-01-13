exports.errorHandler = (error, request, response) => {
    let statusCode = error.statusCode || 500;
    let errorCode = error.message;
    let errorMessage = error.message;
  
    const errors = {
      'todo/not-found': 'Todo cannot be found using the given ID',
      'request/malformed': 'Payload doesn\'t have the necessary properties'
      
    }
  
    if (error.validation && error.validation.length && error.validationContext === 'body') {
      statusCode = 400;
      errorCode = 'request/malformed';
    }
  
    if (errorMessage === errorCode) {
      errorMessage = errors[errorCode];
    }
  
    return response
      .code(statusCode)
      .send({
        sucess: false,
        code: errorCode,
        message: errorMessage
      });
  }
  