class UnauthorizedError extends Error {
  constructor() {
    super("Must be authorized to access this resource.");
  }
}
class ImpossibleCodeError extends Error {
  constructor(msg) {
    super(`An unexpected error occurred: ${msg}`);
  }
}

export { ImpossibleCodeError as I, UnauthorizedError as U };
//# sourceMappingURL=errors.mjs.map
