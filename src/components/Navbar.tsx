import Link from 'next/link'
import React from 'react'
import { Icons } from './Icon'
import { buttonVariants } from './ui/Button'
import { getAuthSession } from '@/lib/auth'
import UserAccountNav from './UserAccountNav'
import SearchBar from './SearchBar'

const Navbar = async () => {

  const session = await getAuthSession();
  // console.log(session);

  return (
    <div className=' bg-zinc-100 fixed top-0 inset-x-0 h-fit border-b border-zinc-300 z-[10] py-2'>
      <div className=' container max-w-7xl h-full mx-auto flex items-center justify-between gap-2'>

        {/* logo  */}

        <Link href='/' className=' flex items-center gap-2'>
          <Icons.logo className=' h-8 w-8 sm:h-6 sm:w-6' />
          <p className=' hidden text-md font-medium md:block text-zinc-700'>IdeaVibe</p>
        </Link>


        {/* search bar */}
        <SearchBar/>

        {session ? <UserAccountNav user={session.user}/> : <Link href='/sign-in' className={buttonVariants()}>Sign In</Link>}

      </div>
    </div>
  )
}

export default Navbar