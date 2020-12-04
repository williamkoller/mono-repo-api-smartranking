import { Body, Controller, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { CreateCategoryDTO } from './dto/create-category.dto'
import { UpdateCategoryDTO } from './dto/update-category.dto'
import { Category } from './types/category.type'

@Controller('api/v1/categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}
    @Post()
    @UsePipes(ValidationPipe)
    async createCategory(@Body() createCategoryDto: CreateCategoryDTO): Promise<Category> {
        return await this.categoriesService.createCategory(createCategoryDto)
    }

    @Get()
    async searchForAllCategories(): Promise<Array<Category | CreateCategoryDTO>> {
        return await this.categoriesService.searchForAllCategories()
    }

    @Get('/:category')
    async searchByCategory(@Param('category') category: string): Promise<CreateCategoryDTO> {
        return await this.categoriesService.searchByCategory(category)
    }

    @Put('/:category')
    async updateCategory(
        @Body() updateCategoryDto: UpdateCategoryDTO,
        @Param('category') category: string,
    ): Promise<UpdateCategoryDTO> {
        return this.categoriesService.updateCategory(category, updateCategoryDto)
    }
}
