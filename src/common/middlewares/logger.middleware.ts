import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {

  use(req: Request, res: Response, next: Function) {
    const url = req.url;
    if (!url.startsWith('/socket')) {
      const now = new Date().toISOString();
      console.log(`${now}: ${req.method} ${url}`);
    }
    next();
  }
}
