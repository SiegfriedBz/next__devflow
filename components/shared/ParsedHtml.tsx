"use client"

import parse from "html-react-parser"
import Prism from "prismjs"
import "prismjs/components/prism-aspnet"
import "prismjs/components/prism-bash"
import "prismjs/components/prism-c"
import "prismjs/components/prism-cpp"
import "prismjs/components/prism-csharp"
import "prismjs/components/prism-dart"
import "prismjs/components/prism-go"
import "prismjs/components/prism-java"
import "prismjs/components/prism-json"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-kotlin"
import "prismjs/components/prism-mongodb"
import "prismjs/components/prism-r"
import "prismjs/components/prism-ruby"
import "prismjs/components/prism-rust"
import "prismjs/components/prism-sass"
import "prismjs/components/prism-solidity"
import "prismjs/components/prism-sql"
import "prismjs/components/prism-typescript"
import "prismjs/plugins/line-numbers/prism-line-numbers.css"
import "prismjs/plugins/line-numbers/prism-line-numbers.js"
import { useEffect } from "react"

type TProps = { data: string }

const containsPreTagWithClass = (str: string) => {
  return /<pre class=/.test(str)
}

const ParsedHtml = ({ data }: TProps) => {
  useEffect(() => {
    if (containsPreTagWithClass(data)) {
      Prism.highlightAll()
    }
  }, [data])

  return data ? (
    <div className="text-dark500_light700 w-full">{parse(data)}</div>
  ) : null
}

export default ParsedHtml
