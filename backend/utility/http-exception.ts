class HttpException<T = any> {
  private readonly _response;
  private readonly _status;

  constructor(response: HttpResponse<T>, status: number) {
    this._response = response;
    this._status = status;
  }

  get response() {
    return this._response;
  }

  get status() {
    return this._status;
  }
}

export default HttpException;
