export class UnauthorizedError extends Error {
  constructor() {
    super("Must be authorized to access this resource.");
  }
}

export class FreeTrialExpiredError extends Error {
  constructor() {
    super(
      "You have run out of free messages. Please subscribe or buy some additional credits.",
    );
  }
}

export class ImpossibleCodeError extends Error {
  constructor(msg: string) {
    super(`An unexpected error occurred: ${msg}`);
  }
}
