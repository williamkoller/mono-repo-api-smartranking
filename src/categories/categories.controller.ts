import { Body, Controller, Get, Param, Post, Put, UsePipes, ValidationPipe, Query } from '@nestjs/common'
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
  async searchForAllCategories(@Query() params: string[]): Promise<Array<Category> | Category> {
    const categoryId = params['categoryId']
    const playerId = params['playerId']
    if (categoryId) {
      return await this.categoriesService.searchCategoryForId(categoryId)
    }
    if (playerId) {
      return this.categoriesService.searchPlayerCategory(playerId)
    }
    return await this.categoriesService.searchForAllCategories()
  }

  @Get('/:category')
  async searchPlayerCategory(@Param('category') category: string): Promise<CreateCategoryDTO> {
    return await this.categoriesService.searchPlayerCategory(category)
  }

  @Put('/:category')
  @UsePipes(ValidationPipe)
  async updateCategory(
    @Body() updateCategoryDto: UpdateCategoryDTO,
    @Param('category') category: string,
  ): Promise<UpdateCategoryDTO> {
    return this.categoriesService.updateCategory(category, updateCategoryDto)
  }

  @Post('/:category/players/:playerId')
  async assignedPlayerCategory(@Param() params: string[]): Promise<Category> {
    return this.categoriesService.assignedPlayerCategory(params)
  }
}
