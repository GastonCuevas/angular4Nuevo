export class ReportUseCase {
  code?: string;
  description?: string;
  config?: string;
  reportName?: string;

  constructor(code?: string, description?: string, config?: string, reportName?: string) {
    this.code = code;
    this.description = description;
    this.config = config;
    this.reportName = reportName;
  }
}
