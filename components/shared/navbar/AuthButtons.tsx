import { Button } from "@/components/ui/button"
import { cn } from "@/lib/shadcn.utils"
import { SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"

type TProps = {
  isMobileSideBar?: boolean
}
const AuthButtons = ({ isMobileSideBar }: TProps) => {
  return (
    <>
      <SignedOut>
        <div className="flex flex-col gap-3">
          {/* log in */}
          <SignButton
            isMobileSideBar={isMobileSideBar}
            icon="/assets/icons/account.svg"
            label="Login"
            href="/sign-in"
            className="btn-secondary"
            textClassName="primary-text-gradient"
          />
          {/* sign up */}
          <SignButton
            isMobileSideBar={isMobileSideBar}
            icon="/assets/icons/sign-up.svg"
            label="Sign up"
            href="/sign-up"
            className="light-border-2 btn-tertiary"
            textClassName="text-dark400_light900"
          />
        </div>
      </SignedOut>

      <SignedIn>
        <div className="py-3">
          {/* log out */}
          <SignOutButton>
            <Button className="small-medium light-border-2 btn-tertiary mx-auto flex min-h-[41px] w-full items-center gap-4 rounded-xl px-4 py-3 shadow-none">
              <Image
                src="/assets/icons/sign-up.svg"
                width={20}
                height={20}
                alt="log-out"
                className="invert-colors"
              />
              <p
                className={`text-dark400_light900 base-medium ${!isMobileSideBar && "max-lg:hidden"}`}
              >
                Log out
              </p>
            </Button>
          </SignOutButton>
        </div>
      </SignedIn>
    </>
  )
}

export default AuthButtons

type TSignButtonProps = {
  icon: string
  href: string
  label: string
  className: string
  textClassName: string
  isMobileSideBar?: boolean
}
const SignButton = ({
  icon,
  href,
  label,
  className,
  textClassName,
  isMobileSideBar = false,
}: TSignButtonProps) => {
  return (
    <Button
      asChild
      className={cn(
        "small-medium min-h-[41px] w-full rounded-xl px-4 py-3 shadow-none",
        className
      )}
    >
      <Link href={href}>
        <Image
          src={icon}
          width={20}
          height={20}
          alt={label}
          className={`${isMobileSideBar ? "hidden" : "lg:hidden"}`}
        />
        <span
          className={`w-full text-center text-base 
            ${isMobileSideBar ? "" : "max-lg:hidden"}
            ${textClassName}
          `}
        >
          {label}
        </span>
      </Link>
    </Button>
  )
}
