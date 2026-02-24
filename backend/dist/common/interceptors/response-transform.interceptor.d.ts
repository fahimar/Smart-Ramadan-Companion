import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
export interface StandardResponse<T> {
    success: boolean;
    data: T;
    timestamp: string;
}
export declare class ResponseTransformInterceptor<T> implements NestInterceptor<T, StandardResponse<T>> {
    intercept(_context: ExecutionContext, next: CallHandler): Observable<StandardResponse<T>>;
}
