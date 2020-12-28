import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { PlayersService } from 'src/players/players.service'
import { CreateCategoryDTO } from './dto/create-category.dto'
import { UpdateCategoryDTO } from './dto/update-category.dto'
import { Category } from './types/category.type'

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    private readonly playersService: PlayersService,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDTO): Promise<Category> {
    const { category } = createCategoryDto
    const categoryFound = await this.categoryModel.findOne({ category }).exec()
    if (categoryFound) {
      throw new BadRequestException(`The category already exists`)
    }
    const categoryCreated = new this.categoryModel(createCategoryDto)
    return await categoryCreated.save()
  }

  async searchForAllCategories(): Promise<Array<Category>> {
    return this.categoryModel.find().populate('players').exec()
  }

  async searchCategoryForId(category: string): Promise<Category> {
    const categoryFound = await this.categoryModel.findOne({ category }).exec()
    if (!categoryFound) {
      throw new NotFoundException('Category not found.')
    }

    return categoryFound
  }

  async searchPlayerCategory(playerId: any): Promise<Category> {
    const players = await this.playersService.searchForAllPlayer()
    const playerFilter = players.filter((player) => player._id == playerId)

    if (playerFilter.length == 0) {
      throw new BadRequestException('This id is not a player.')
    }

    return await this.categoryModel.findOne().where('players').in(playerId).exec()
  }

  async updateCategory(category: string, updateCategoryDto: UpdateCategoryDTO): Promise<UpdateCategoryDTO> {
    const categoryFound = await this.categoryModel.findOne({ category }).exec()
    if (!categoryFound) {
      throw new NotFoundException(`Category not found`)
    }
    return await this.categoryModel.findOneAndUpdate({ category }, { $set: updateCategoryDto }).exec()
  }

  async assignedPlayerCategory(params: string[]): Promise<Category> {
    const category = params['category']
    const playerId = params['playerId']
    const categoryFound = await this.categoryModel.findOne({ category }).exec()

    const playerAlreadyRegisteredCategory = await this.categoryModel
      .find({ category })
      .where('players')
      .in(playerId)
      .exec()

    await this.playersService.searchByPlayerId(playerId)

    if (!categoryFound) {
      throw new BadRequestException('Category not found.')
    }

    if (playerAlreadyRegisteredCategory.length > 0) {
      throw new BadRequestException('Player already registered in the category')
    }
    categoryFound.players.push(playerId)
    return await this.categoryModel.findOneAndUpdate({ category }, { $set: categoryFound }).exec()
  }
}
