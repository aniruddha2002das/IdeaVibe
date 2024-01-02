// "use client"

// import React, { FC, useState } from 'react'
// import { Button } from './ui/Button'
// import { cn } from '@/lib/utils'
// import { signIn } from 'next-auth/react'
// import { Icons } from './icon'
// import { useToast } from '@/hooks/use-toast'

// interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

// const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {

//     const [isLoading, setIsLoading] = useState<boolean>(false);
//     const { toast } = useToast();

//     const loginWithGoogle = async () => {
//         setIsLoading(true);

//         try {
//             await signIn('google');
//         }
//         catch (error) {
//             // tostify notification
//             toast({
//                 title: 'Error',
//                 description: 'There was an error logging in with Google',
//                 variant: 'destructive',
//             })
//         }
//         finally {
//             setIsLoading(false);
//         }
//     }

//     return (
//         <div className={cn('flex justify-center', className)} {...props}>
//             <Button onClick={loginWithGoogle} isLoading={isLoading} size={'sm'} className=' w-full'>
//                 {isLoading ? null : <Icons.google className=' h-4 w-4 mr-2' />}
//                 Google</Button>
//         </div>
//     )
// }

// export default UserAuthForm










'use client'

import { cn } from '@/lib/utils'
import { signIn } from 'next-auth/react'
import * as React from 'react'
import { FC } from 'react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/hooks/use-toast'
import { Icons } from './Icon'


interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const loginWithGoogle = async () => {
    setIsLoading(true)

    try {
      await signIn('google')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error logging in with Google',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex justify-center', className)} {...props}>
      <Button
        isLoading={isLoading}
        type='button'
        size='sm'
        className='w-full'
        onClick={loginWithGoogle}
        disabled={isLoading}>
        {isLoading ? null : <Icons.google className='h-4 w-4 mr-2' />}
        Google
      </Button>
    </div>
  )
}

export default UserAuthForm