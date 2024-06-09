class UnauthorizedError extends Error {
  constructor() {
    super("Must be authorized to access this resource.");
  }
}
class FreeTrialExpiredError extends Error {
  constructor() {
    super(
      "You have run out of free messages. Please subscribe or buy some additional credits."
    );
  }
}
class ImpossibleCodeError extends Error {
  constructor(msg) {
    super(`An unexpected error occurred: ${msg}`);
  }
}

export { FreeTrialExpiredError as F, ImpossibleCodeError as I, UnauthorizedError as U };
//# sourceMappingURL=errors.mjs.map
