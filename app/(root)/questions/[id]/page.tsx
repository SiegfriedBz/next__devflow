import AnswerForm from "@/components/forms/AnswerForm"
import Metric from "@/components/shared/Metric"
import NoResult from "@/components/shared/NoResult"
import ParsedHtml from "@/components/shared/ParsedHtml"
import CustomFilter from "@/components/shared/search/filter/CustomFilter"
import Tag from "@/components/shared/Tag"
import { Button } from "@/components/ui/button"
import Voting from "@/components/Voting"
import { ANSWERS_FILTER_OPTIONS } from "@/constants/filters"
import { formatDate, getDaysAgo } from "@/lib/dates.utils"
import { getAllAnswers } from "@/services/answer.services"
import { getQuestion } from "@/services/question.services"
import type { TAnswer, TQuestion, TTag, TUser } from "@/types"
import Image from "next/image"
import Link from "next/link"
import React, { Suspense } from "react"

type TProps = {
  params: { id: string }
  searchParams: { [key: string]: string | undefined }
}
const QuestionDetailsPage = async ({ params, searchParams }: TProps) => {
  const { id: questionId } = params

  // We do not populate the question to fetch all answers.
  // Instead, we use getAllAnswers service to which we can pass searchParams.
  const question: TQuestion = await getQuestion({ filter: { _id: questionId } })

  const {
    // _id: questionId,
    title,
    content,
    views,
    author,
    upVoters,
    downVoters,
    answers: allAnswersIds, // non-populated answers
    tags,
    createdAt,
  } = question

  const numUpVotes = upVoters?.length ?? 0
  const numDownVotes = downVoters?.length ?? 0
  const numAnswers = allAnswersIds?.length ?? 0 // Total Answers for this question

  const daysAgo = getDaysAgo(createdAt)

  return (
    <section>
      {/* Question Header */}
      <Header
        author={author as TUser}
        numUpVotes={numUpVotes}
        numDownVotes={numDownVotes}
      >
        <Button className="p-0">
          <Image
            src="/assets/icons/star.svg"
            alt="star"
            width={24}
            height={24}
            className="invert-colors"
          />
        </Button>
      </Header>

      {/* Question title */}
      <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
        {title}
      </h2>

      {/* Metrics */}
      <QuestionMetrics
        daysAgo={daysAgo}
        numAnswers={numAnswers}
        views={views}
      />

      {/* Question content */}
      <ParsedHtml data={content as string} />

      {/* Tags */}
      <QuestionTags tags={tags as TTag[]} />

      {/* Answers Counter + Filter // Answers */}
      <Suspense fallback={<div className="loader my-8" />}>
        <AllAnswers questionId={questionId} searchParams={searchParams} />
      </Suspense>

      {/* Answer form */}
      <AnswerForm questionId={questionId} />
    </section>
  )
}

export default QuestionDetailsPage

type THeaderProps = {
  author: TUser
  numUpVotes: number
  numDownVotes: number
  answeredOn?: string
  children?: React.ReactNode
}

const Header = ({
  author,
  numUpVotes,
  numDownVotes,
  answeredOn,
  children,
}: THeaderProps) => {
  return (
    <>
      {/* Author */}
      <div className="flex w-full flex-col-reverse justify-between gap-2 sm:flex-row sm:items-center">
        <Author author={author as TUser} answeredOn={answeredOn} />

        {/* Voting */}
        <Voting
          className="flex w-full items-center justify-end gap-4"
          numUpVotes={numUpVotes}
          numDownVotes={numDownVotes}
        >
          {children}
        </Voting>
      </div>
    </>
  )
}

const Author = ({
  author,
  answeredOn,
}: {
  author: TUser
  answeredOn?: string
}) => {
  return (
    <Link
      href={`/profile/${(author as TUser)?._id}`}
      className="flex max-sm:flex-col max-sm:space-y-1 sm:items-end sm:space-x-8"
    >
      <div className="flex items-center gap-2">
        <Image
          src={(author as TUser)?.picture || "/assets/icons/avatar.svg"}
          width={24}
          height={24}
          alt="author avatar"
          className="invert-colors rounded-full"
        />
        <p className="paragraph-semibold text-dark300_light700 whitespace-nowrap">
          {(author as TUser)?.name}
        </p>
      </div>
      {answeredOn && (
        <span className="inline-block whitespace-nowrap text-sm text-slate-500 max-sm:ms-8 sm:ms-4">
          {answeredOn}
        </span>
      )}
    </Link>
  )
}

type TQuestionMetricsProps = {
  daysAgo: number
  numAnswers: number
  views: number
}
const QuestionMetrics = ({
  daysAgo,
  numAnswers,
  views,
}: TQuestionMetricsProps) => {
  return (
    <div className="mb-8 mt-5 flex flex-wrap gap-4">
      <Metric
        imageSrc="/assets/icons/clock.svg"
        alt="clock icon"
        value={`Asked ${
          daysAgo === 0
            ? "Today"
            : `${daysAgo} day${daysAgo === 1 ? "" : "s"} ago`
        }`}
      />
      <Metric
        imageSrc="/assets/icons/message.svg"
        alt="numOfAnswers"
        value={numAnswers}
        title=" Answers"
      />
      <Metric
        imageSrc="/assets/icons/eye.svg"
        alt="numOfViews"
        value={views}
        title=" Views"
      />
    </div>
  )
}

type TQuestionTagsProps = {
  tags: TTag[]
}
const QuestionTags = ({ tags }: TQuestionTagsProps) => {
  return (
    <ul className="mt-8 flex flex-wrap gap-4">
      {(tags as TTag[]).map((tag) => {
        return (
          <li key={tag.name}>
            <Tag {...tag} />
          </li>
        )
      })}
    </ul>
  )
}

type TAllAnswersProps = {
  questionId: string
  searchParams: { [key: string]: string | undefined }
}
const AllAnswers = async ({ questionId, searchParams }: TAllAnswersProps) => {
  const selectedAnswers: TAnswer[] = await getAllAnswers({
    filter: { question: questionId },
    searchParams,
  })

  return (
    <>
      {/* Answers Counter + Filter */}
      <div className="my-8">
        <span className="text-primary-500">
          {selectedAnswers.length} Answers
        </span>
        <div className="sm:px-4">
          <CustomFilter
            filterName="filter"
            filterOptions={ANSWERS_FILTER_OPTIONS}
          />
        </div>
      </div>
      <>
        {/* Answers */}
        {selectedAnswers?.length > 0 ? (
          <ul className="my-8 flex flex-col gap-8">
            {(selectedAnswers as TAnswer[])?.map((answer) => {
              const {
                author, // populated user
                content,
                upVoters: answerUpVoters, // non-populated user
                downVoters: answerDownvoters, // non-populated user
                createdAt,
              } = answer
              const numUpVotes = answerUpVoters?.length ?? 0
              const numDownVotes = answerDownvoters?.length ?? 0

              return (
                <div key={`answer-${answer._id}`} className="">
                  {/* Answer Author + votes */}
                  <Header
                    author={author as TUser}
                    numUpVotes={numUpVotes}
                    numDownVotes={numDownVotes}
                    answeredOn={`answered ${formatDate(createdAt)}`}
                  />
                  {/* Answer Content */}
                  <ParsedHtml data={content} />
                </div>
              )
            })}
          </ul>
        ) : (
          <NoResult
            resultType="answer"
            paragraphContent="Try changing your selection to display answers."
          />
        )}
      </>
    </>
  )
}