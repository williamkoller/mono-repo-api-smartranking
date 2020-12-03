import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { CreateCategoryDTO } from './dto/create-category.dto'
import { Category } from './types/category.type'

@Controller('api/v1/categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}
    @Post()
    @UsePipes(ValidationPipe)
    async createCategory(@Body() createCategoryDto: CreateCategoryDTO): Promise<Category> {
        return await this.categoriesService.createCategory(createCategoryDto)
    }
}
