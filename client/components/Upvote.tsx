import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Flex, IconButton } from '@chakra-ui/react'
import React, { useState } from 'react'
import { PostsQuery, useVoteMutation } from '../generated/graphql'

interface UpvoteProps {
    post: PostsQuery['posts']['posts'][0]
}

const Upvote: React.FC<UpvoteProps> = ({ post }) => {
    const [loadingState, setLoadingState] = useState<'upvoteLoading' | 'downvoteLoading' | 'notLoading'>('notLoading')
    const [, vote] = useVoteMutation()
    return (
        <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
            <IconButton
                colorScheme={ post.voteStatus === 1 ? 'green' : undefined}
                variant='solid'
                aria-label='Upvote'
                size='sm'
                fontSize='20px'
                onClick={async () => {
                    if (post.voteStatus === 1) {
                        return
                    }
                    setLoadingState('upvoteLoading')
                    await vote({
                        postId: post.id,
                        value: 1
                    })
                    setLoadingState('notLoading')
                }}
                isLoading={loadingState === 'upvoteLoading'}
                icon={<ChevronUpIcon />}
            />
            {post.points}
            <IconButton
                colorScheme={ post.voteStatus === -1 ? 'red' : undefined}
                variant='solid'
                aria-label='Downvote'
                size='sm'
                fontSize='20px'
                onClick={async () => {
                    if (post.voteStatus === -1) {
                        return
                    }
                    setLoadingState('downvoteLoading')
                    await vote({
                        postId: post.id,
                        value: -1
                    })
                    setLoadingState('notLoading')
                }}
                isLoading={loadingState === 'downvoteLoading'}
                icon={<ChevronDownIcon />}
            />
        </Flex>
    )
}

export default Upvote