export class HealthResponse {
  status: boolean;

  constructor(status = false) {
    this.status = status;
  }
}
