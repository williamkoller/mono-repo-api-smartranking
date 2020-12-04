import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateCategoryDTO } from './dto/create-category.dto'
import { UpdateCategoryDTO } from './dto/update-category.dto'
import { Category } from './types/category.type'

@Injectable()
export class CategoriesService {
    constructor(@InjectModel('Category') private readonly categoryModel: Model<Category>) {}
    async createCategory(createCategoryDto: CreateCategoryDTO): Promise<Category> {
        const { category } = createCategoryDto
        const categoryFound = await this.categoryModel.findOne({ category }).exec()
        if (categoryFound) {
            throw new BadRequestException(`The category ${category} already exists`)
        }
        const categoryCreated = new this.categoryModel(createCategoryDto)
        return await categoryCreated.save()
    }

    async searchForAllCategories(): Promise<Array<Category | CreateCategoryDTO>> {
        const categories = await this.categoryModel.find({}, { __v: false }).exec()
        return categories.map((c) => ({
            id: c.id,
            category: c.category,
            description: c.description,
            events: c.events,
        }))
    }

    async searchByCategory(category: string): Promise<CreateCategoryDTO> {
        const categoryFound = await this.categoryModel.findOne({ category }).exec()
        if (!categoryFound) {
            throw new NotFoundException(`The category with this category: ${category} not found`)
        }
        const categoryObject = {
            id: categoryFound.id,
            category: categoryFound.category,
            description: categoryFound.description,
            events: categoryFound.events.map((eve) => ({
                name: eve.name,
                operation: eve.operation,
                value: eve.value,
            })),
        }

        return categoryObject
    }

    async updateCategory(category: string, updateCategoryDto: UpdateCategoryDTO): Promise<UpdateCategoryDTO> {
        const categoryFound = await this.categoryModel.findOne({ category }).exec()
        if (!categoryFound) {
            throw new NotFoundException(`The category with this category: ${category} not found`)
        }
        return await this.categoryModel.findOneAndUpdate({ category }, { $set: updateCategoryDto }).exec()
    }
}
