import { ArgumentsHost, Catch, RpcExceptionFilter } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { Observable, throwError } from 'rxjs'

@Catch(RpcException)
export class ExceptionFilter implements RpcExceptionFilter<RpcException> {
  public catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const exceptionError = exception.getError() as any
    const { response = {}, ...error } = {
      ...exceptionError,
      error: exceptionError.response.error,
      message: exceptionError.response.message,
      status: exceptionError.response.statusCode,
    }
    return throwError(error)
  }
}
