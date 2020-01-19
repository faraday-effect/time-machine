// This is a little weird; I'm encapsulating it here and not exporting it.
// At the very least, it captures my incomplete understanding of Apollo.
//
// It's helpful when decoding errors created on the server side like this:
//
// throw new BadRequestException(
//     `The email address '${createInput.email}' is already registered.`
// );

interface ClientSideError {
  message: {
    statusCode: number;
    error: string;
    message: string;
  };
  locations: [];
  path: [];
  extensions: {};
}

export function collectErrorMessages(errors: ClientSideError[]) {
  return errors.map(error => error.message.message).join(" ");
}
