"use client"

import { deleteAnswerAction } from "@/server-actions/answer.actions"
import { deleteQuestionAction } from "@/server-actions/question.actions"
import { SignedIn } from "@clerk/clerk-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "./ui/button"

type TProps =
  | {
      actionType: "mutateQuestion" // edit || delete
      questionId: string
      answerId?: undefined
    }
  | {
      actionType: "mutateAnswer" // delete
      questionId?: undefined
      answerId: string
    }

const EditDeleteActionButton = ({
  actionType,
  questionId,
  answerId,
}: TProps) => {
  const [isClient, setIsClient] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const isMutateQuestion = actionType === "mutateQuestion"

  const handleDelete = async () => {
    try {
      setIsDeleting(true)

      const response = isMutateQuestion
        ? await deleteQuestionAction({ _id: questionId as string })
        : await deleteAnswerAction({ _id: answerId as string })

      if (response instanceof Error) {
        throw new Error(response.message)
      }
      toast.success(
        `${isMutateQuestion ? "Question" : "Answer"} deleted successfully`
      )
    } catch (error) {
      const err = error as Error
      console.log("EditDeleteActionButton ERROR", err)
      toast.error(
        `Could not delete ${isMutateQuestion ? "question" : "answer"}`
      )
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isClient) return null

  return (
    <SignedIn>
      <div className="flex items-center max-sm:-mb-4 max-sm:mt-2">
        <div className="flex items-center justify-center max-sm:-ms-6">
          {/* Edit btn */}
          {isMutateQuestion && (
            <Button asChild>
              <Link
                href={`/questions/${questionId}/edit`}
                className="items-center justify-center"
              >
                <span className="inline-flex size-8 items-center justify-center">
                  <Image
                    src="/assets/icons/edit.svg"
                    alt="edit icon"
                    width={16}
                    height={16}
                  />
                </span>
              </Link>
            </Button>
          )}

          {/* Delete btn */}
          <Button onClick={handleDelete} disabled={isDeleting}>
            <span className="inline-flex size-8 items-center justify-center">
              <Image
                src="/assets/icons/trash.svg"
                alt="delete icon"
                width={16}
                height={16}
              />
            </span>
          </Button>
        </div>
      </div>
    </SignedIn>
  )
}

export default EditDeleteActionButton
