export class ZephyrResponse<T> {
  constructor(
    public code = 200,
    public body?: string | object,
  ) {}

  public status(code: number): this {
    this.code = code;
    return this;
  }

  public send<T extends string | object = string>(body: T): this {
    this.body = body;
    return this;
  }

  public json<T extends string | object = object>(body: T): this {
    this.body = body;
    return this;
  }
}