import { Badge } from "@/components/ui/badge"
import type { TTag } from "@/types"
import Link from "next/link"

type TProps = TTag & { showCount?: boolean }
const Tag = ({ _id, name, questions, showCount = false }: TProps) => {
  return (
    <Link href={`/tags/${_id}`} className="flex justify-between gap-2">
      <Badge
        className="subtle-medium 
          background-light800_dark300 
          text-light400_light500 
          whitespace-nowrap 
          rounded-md 
          border-none px-4 
          py-2 
          uppercase 
          shadow-md
          shadow-light-500
          dark:shadow-dark-100
        "
      >
        {name}
      </Badge>
      {showCount && questions && (
        <p className="small-medium text-dark500_light700">
          {questions?.length}
        </p>
      )}
    </Link>
  )
}

export default Tag
