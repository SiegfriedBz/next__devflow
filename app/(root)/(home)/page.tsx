import QuestionCard from "@/components/QuestionCard"
import QuestionCardSkeleton from "@/components/QuestionCardSkeleton"
import NoResult from "@/components/shared/NoResult"
import CustomFilter from "@/components/shared/search/filter/CustomFilter"
import LocalSearchBar from "@/components/shared/search/LocalSearchBar"
import { Button } from "@/components/ui/button"
import { HOME_FILTER_OPTIONS } from "@/constants/filters"
import { getAllQuestions } from "@/services/question.services"
import type { TQuestion, TSearchParamsProps } from "@/types"
import Link from "next/link"
import { Suspense } from "react"

const Home = ({ searchParams }: TSearchParamsProps) => {
  return (
    <div>
      <div className="flex w-full items-center max-sm:flex-col-reverse sm:justify-between">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Button
          asChild
          className="primary-gradient min-h-11 rounded-xl px-4 py-3 !text-light-900 max-sm:mb-4 max-sm:w-full"
        >
          <Link href="/ask-question">Ask a Question</Link>
        </Button>
      </div>

      <div className="mt-4 flex justify-between gap-5 max-sm:flex-col sm:items-center md:flex-col">
        <LocalSearchBar queryParamName="q" placeholder="Search questions..." />

        <CustomFilter filterName="filter" filterOptions={HOME_FILTER_OPTIONS} />
      </div>

      <div className="mt-4 flex flex-col justify-between gap-8 sm:items-center">
        <Suspense fallback={<QuestionListWrapperSkeleton />}>
          <QuestionListWrapper searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}

export default Home

const QuestionListWrapper = async ({ searchParams }: TSearchParamsProps) => {
  const data: TQuestion[] | null = await getAllQuestions({ searchParams })
  console.log("==== HOME searchParams", searchParams)
  console.log("==== HOME data", data)

  return data && data?.length > 0 ? (
    <ul className="flex w-full flex-col gap-8 max-sm:gap-6 [&>*:first-child]:mt-2">
      {data.map((question) => {
        return (
          <li key={question._id}>
            <QuestionCard {...question} />
          </li>
        )
      })}
    </ul>
  ) : (
    <NoResult
      resultType="question"
      paragraphContent="Be the first to break the silence! Ask a question and kickstart a
            discussion"
      href="/ask-a-question"
      linkLabel="Ask a question"
    />
  )
}

const QuestionListWrapperSkeleton = () => {
  return Array.from({ length: 8 }, (_, index) => {
    return <QuestionCardSkeleton key={index} />
  })
}
