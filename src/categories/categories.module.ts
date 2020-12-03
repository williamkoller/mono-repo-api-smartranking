import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CategoriesController } from './categories.controller'
import { CategoriesService } from './categories.service'
import { CategorySchema } from './schema/category.schema'

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'Category',
                schema: CategorySchema,
            },
        ]),
    ],
    controllers: [CategoriesController],
    providers: [CategoriesService],
})
export class CategoriesModule {}
