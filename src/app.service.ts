import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { redisClient } from './redis.provider';

@Injectable()
export class AppService {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  async validateUser(username: string, password: string) {
    const key = `login:attempts:${username}`;

    const user = await firstValueFrom(
      this.userServiceClient.send({ cmd: 'get-user' }, { username }),
    );

    if (user && user.password === password) {
      return { message: 'User validated successfully' };
    } else {
      
      const attempts = await redisClient.incr(key);
      await redisClient.expire(key, 3600); // expires in 1 hour
  
      if (attempts >= 42) {
        return { message: 'Too many failed attempts. Try again later.' };
      }
  
      return { message: `Invalid credentials. Attempt ${attempts}/42` };
    }
  }
}
