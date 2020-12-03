import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateCategoryDTO } from './dto/create-category.dto'
import { Category } from './types/category.type'

@Injectable()
export class CategoriesService {
    constructor(@InjectModel('Category') private readonly categoryModel: Model<Category>) {}
    async createCategory(createCategoryDto: CreateCategoryDTO): Promise<Category> {
        const { category } = createCategoryDto
        const categoryFound = await this.categoryModel.findOne({ category }).exec()
        if (categoryFound) {
            throw new BadRequestException(`the category ${category} already exists`)
        }
        const categoryCreated = new this.categoryModel(createCategoryDto)
        return await categoryCreated.save()
    }
}
