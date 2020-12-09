import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalFilters(new HttpExceptionFilter())
  await app.listen(process.env.PORT)
}

bootstrap().then(() => {
  console.log({
    projectName: 'API Smart Ranking',
    date: new Date(),
    started: `Server running on ${process.env.HOST}:${process.env.PORT}`,
  })
})
