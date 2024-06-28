import { BADGE_CRITERIA } from "@/constants"

export type TUser = {
  _id: string
  name: string
  picture: string
  clerkId: string
  userName: string
  email: string
  userName: string
  reputation: number
  joinedDate: Date
  location: object
  savedQuestions: string[] // TODO TQuestion[] | string[]
}

export type TTag = {
  _id: string
  name: string
  description: string
  questions?: string[] // TODO TQuestion[] | string[]
  followers?: TUser[] | string[]
  createdAt?: Date
  // totalQuestions?: number
  // showCount?: boolean
}

// TODO
export type TAnswer = {
  _id: string
  author: TUser | string
  content: string
  createdAt: Date
  upVoters: TUser[] | string[]
  downVoters: TUser[] | string[]
  question: string[] // TODO TQuestion[] | string[]
}

export type TQuestion = {
  _id: string
  author: TUser | string
  content: string
  title: string
  views: number
  upVoters: TUser[] | string[]
  downVoters: TUser[] | string[]
  tags: TTag[] | string[]
  answers: TAnswer[] | string[]
  createdAt: Date
}

export interface ISidebarLink {
  imgURL: string
  href: string
  label: string
}

export type TJob = {
  id?: string
  employer_name?: string
  employer_logo?: string | undefined
  employer_website?: string
  job_employment_type?: string
  job_title?: string
  job_description?: string
  job_apply_link?: string
  job_city?: string
  job_state?: string
  job_country?: string
}

export type TCountry = {
  name: {
    common: string
  }
}

export type TGetAllQuestionsParams = {
  page?: number
  resultsPerPage?: number
  searchQuery?: string
  filter?: string
}

export type TParamsProps = {
  params: { id: string }
}

export type TSearchParamsProps = {
  searchParams: { [key: string]: string | undefined }
}

export type TURLProps = {
  params: { id: string }
  searchParams: { [key: string]: string | undefined }
}

export type TBadgeCounts = {
  GOLD: number
  SILVER: number
  BRONZE: number
}

export type TBadgeCriteria = keyof typeof BADGE_CRITERIA
