"use server"

import connectToMongoDB from "@/lib/mongoose.utils"
import type { TMutateQuestionInput } from "@/lib/zod/question.zod"
import Answer from "@/models/answer.model"
import Question, { type IQuestionDocument } from "@/models/question.model"
import Tag from "@/models/tag.model"
import User from "@/models/user.model"
import type { TQueryParams, TQuestion } from "@/types"
import type { FilterQuery, QueryOptions, UpdateQuery } from "mongoose"

export async function getHotQuestions({
  limit,
}: {
  limit: number
}): Promise<{ _id: string; title: string }[]> {
  try {
    await connectToMongoDB()

    const result = await Question.aggregate([
      {
        $project: {
          _id: 1,
          title: 1,
          upVotersCount: { $size: "$upVoters" },
        },
      },
      {
        $sort: { views: -1, upVotersCount: -1 },
      },
      {
        $limit: limit,
      },
    ])

    return JSON.parse(JSON.stringify(result))
  } catch (error) {
    const err = error as Error
    console.log("getHotQuestions Error", err.message)
    throw new Error(`Could not fetch hot questions - ${err.message}`)
  }
}

export async function getAllQuestions({
  maxPageSize = 1000,
  params,
}: {
  maxPageSize?: number
  params: TQueryParams
}): Promise<{
  questions: TQuestion[]
  hasNextPage: boolean
}> {
  try {
    const { page = 1, searchQueryParam = "", sortQueryParam } = params

    await connectToMongoDB()

    // Build searchQuery on Question
    const searchQuery: FilterQuery<IQuestionDocument> = {}

    if (searchQueryParam) {
      searchQuery.$or = [
        {
          title: {
            $regex: new RegExp(searchQueryParam, "i"),
          },
        },
        {
          content: {
            $regex: new RegExp(searchQueryParam, "i"),
          },
        },
      ]
    }

    // Build sortQuery on Question
    let sortQuery: Record<string, 1 | -1> | undefined
    switch (sortQueryParam) {
      // OK
      case "newest":
        sortQuery = { createdAt: -1 }
        break
      // OK
      case "unanswered":
        searchQuery.answers = { $size: 0 }
        break
      case "frequent":
        sortQuery = { views: -1 }
        break
      case "recommended":
        sortQuery = { upVoters: -1 }
        break
      default:
        sortQuery = { createdAt: -1 }
    }

    // Pagination
    const limit = maxPageSize
    const skip = (page - 1) * maxPageSize

    // Perform query
    const result = await Question.find(searchQuery)
      .populate([
        { path: "author", model: User },
        { path: "tags", model: Tag },
        { path: "upVoters", model: User },
        { path: "downVoters", model: User },
        { path: "answers", model: Answer },
      ])
      .skip(skip)
      .limit(limit)
      .sort(sortQuery)

    // Pagination data
    const totalDocs = await Question.countDocuments(searchQuery)
    const hasNextPage = totalDocs > skip + result.length

    // format
    const questions = JSON.parse(JSON.stringify(result))

    return { questions, hasNextPage }
  } catch (error) {
    const err = error as Error
    console.log("getAllQuestions Error", err.message)
    throw new Error(`Could not fetch questions - ${err.message}`)
  }
}

export async function getQuestion({
  filter,
}: {
  filter: FilterQuery<IQuestionDocument>
}): Promise<IQuestionDocument> {
  try {
    const result: IQuestionDocument | null = await Question.findOne(
      filter
    ).populate([
      { path: "author", model: User, select: "_id clerkId name picture" },
      { path: "tags", model: Tag, select: "_id name" },
    ])

    if (!result) {
      throw new Error(`Question not found`)
    }

    return result
  } catch (error) {
    const err = error as Error
    console.log("getQuestion Error", err.message)
    throw new Error(`Could not fetch question - ${err.message}`)
  }
}

export type TGetQuestionDataForEditReturn = {
  _id: string
  author: { clerkId: string }
  title: string
  content: string
  tags: { _id: string; name: string }[]
}

export async function getQuestionDataForEdit({
  filter,
}: {
  filter: FilterQuery<IQuestionDocument>
}): Promise<TGetQuestionDataForEditReturn> {
  try {
    const result: IQuestionDocument | null = await Question.findOne(filter, {
      _id: 1,
      author: 1,
      title: 1,
      content: 1,
      tags: 1,
    }).populate([
      { path: "author", model: User, select: "clerkId" },
      { path: "tags", model: Tag, select: "_id name" },
    ])

    if (!result) {
      throw new Error(`Question not found`)
    }

    const question: TGetQuestionDataForEditReturn = JSON.parse(
      JSON.stringify(result)
    )

    return question
  } catch (error) {
    const err = error as Error
    console.log("getQuestion Error", err.message)
    throw new Error(`Could not fetch question - ${err.message}`)
  }
}

export async function createQuestion({
  data,
}: {
  data: Omit<TMutateQuestionInput, "tags"> & {
    author: IQuestionDocument["author"]
  }
}): Promise<IQuestionDocument | null> {
  try {
    await connectToMongoDB()

    const result: IQuestionDocument = await Question.create({
      ...data,
    })

    return result
  } catch (error) {
    const err = error as Error
    console.log("createQuestion Error", err)
    throw new Error(`Could not create question - ${err.message}`)
  }
}

export async function updateQuestion({
  filter,
  data,
  options = { new: true },
}: {
  filter: FilterQuery<IQuestionDocument> | undefined
  data: UpdateQuery<IQuestionDocument> | undefined
  options?: QueryOptions<IQuestionDocument> | null | undefined
}): Promise<IQuestionDocument | null> {
  try {
    await connectToMongoDB()

    console.log("updateQuestion -> data", data)

    const result: IQuestionDocument | null = await Question.findOneAndUpdate(
      filter,
      data,
      options
    )

    if (!result) {
      throw new Error(`Question not found`)
    }

    return result
  } catch (error) {
    const err = error as Error
    console.log("===== updateQuestion Error", err)
    throw new Error(`Could not update question - ${err.message}`)
  }
}

export async function deleteQuestion({
  filter,
  options = {},
}: {
  filter: FilterQuery<IQuestionDocument> | undefined
  options?: QueryOptions<IQuestionDocument> | null | undefined
}): Promise<IQuestionDocument | null> {
  try {
    await connectToMongoDB()

    //  TODO
    // delete tags associated with question

    // delete question
    const result = await Question.findOneAndDelete(filter, options)
    if (!result) {
      throw new Error(`Question not found`)
    }

    return result
  } catch (error) {
    const err = error as Error
    console.log("===== deleteQuestion Error", err)
    throw new Error(`Could not delete question - ${err.message}`)
  }
}

export async function updateManyQuestions({
  filter,
  data,
}: {
  filter: FilterQuery<IQuestionDocument> | undefined
  data: UpdateQuery<IQuestionDocument> | undefined
}) {
  try {
    await connectToMongoDB()

    const result = await Question.updateMany(filter, data)

    return result
  } catch (error) {
    const err = error as Error
    console.log("===== updateManyQuestions Error", err)
    throw new Error(`Could not update questions - ${err.message}`)
  }
}

export async function deleteManyQuestions({
  filter,
}: {
  filter: FilterQuery<IQuestionDocument> | undefined
}) {
  try {
    await connectToMongoDB()

    const result = await Question.deleteMany(filter)

    return result
  } catch (error) {
    const err = error as Error
    console.log("===== deleteManyQuestions Error", err)
    throw new Error(`Could not delete questions - ${err.message}`)
  }
}
