import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    await app.listen(process.env.PORT)
}

bootstrap().then(() => {
    console.log({
        projectName: 'API Smart Ranking',
        date: new Date(),
        started: `Server running on ${process.env.HOST}:${process.env.PORT}`,
    })
})
