import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Group = {
  __typename?: 'Group';
  createdAt: Scalars['String'];
  creatorId: Scalars['Float'];
  description: Scalars['String'];
  id: Scalars['Float'];
  members: Array<Member>;
  membersnumber: Scalars['Float'];
  name: Scalars['String'];
  posts: Array<Post>;
  updatedAt: Scalars['String'];
};

export type GroupInput = {
  description: Scalars['String'];
  name: Scalars['String'];
};

export type GroupResponse = {
  __typename?: 'GroupResponse';
  errors?: Maybe<Array<FieldError>>;
  group?: Maybe<Group>;
};

export type Member = {
  __typename?: 'Member';
  group: Group;
  groupId: Scalars['Float'];
  user: User;
  userId: Scalars['Float'];
  value: Scalars['Float'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createGroup: GroupResponse;
  createPost: PostResponse;
  deletePost: Scalars['Boolean'];
  forgotPassword: Scalars['Boolean'];
  login: UserResponse;
  logout: Scalars['Boolean'];
  member: Scalars['Boolean'];
  register: UserResponse;
  resetPassword: UserResponse;
  updateGroup?: Maybe<Group>;
  updatePost?: Maybe<Post>;
  vote: Scalars['Boolean'];
};


export type MutationCreateGroupArgs = {
  options: GroupInput;
};


export type MutationCreatePostArgs = {
  options: PostInput;
};


export type MutationDeletePostArgs = {
  id: Scalars['Int'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationLoginArgs = {
  options: UserLoginInput;
};


export type MutationMemberArgs = {
  groupId: Scalars['Int'];
  value: Scalars['Int'];
};


export type MutationRegisterArgs = {
  options: UserRegisterInput;
};


export type MutationResetPasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationUpdateGroupArgs = {
  description: Scalars['String'];
  id: Scalars['Int'];
  name: Scalars['String'];
};


export type MutationUpdatePostArgs = {
  id: Scalars['Int'];
  text: Scalars['String'];
  title: Scalars['String'];
};


export type MutationVoteArgs = {
  postId: Scalars['Int'];
  value: Scalars['Int'];
};

export type Post = {
  __typename?: 'Post';
  createdAt: Scalars['String'];
  creator: User;
  creatorId: Scalars['Float'];
  group: Group;
  groupId: Scalars['Float'];
  id: Scalars['Float'];
  points: Scalars['Float'];
  text: Scalars['String'];
  title: Scalars['String'];
  updatedAt: Scalars['String'];
  voteStatus?: Maybe<Scalars['Int']>;
};

export type PostInput = {
  groupId: Scalars['String'];
  text: Scalars['String'];
  title: Scalars['String'];
};

export type PostResponse = {
  __typename?: 'PostResponse';
  errors?: Maybe<Array<FieldError>>;
  post?: Maybe<Post>;
};

export type Query = {
  __typename?: 'Query';
  group?: Maybe<Group>;
  groups?: Maybe<Array<Group>>;
  post?: Maybe<Post>;
  posts: Array<Post>;
  test: Scalars['String'];
  userLoggedIn?: Maybe<User>;
};


export type QueryGroupArgs = {
  id: Scalars['Int'];
};


export type QueryPostArgs = {
  id: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['Float'];
  updatedAt: Scalars['String'];
  username: Scalars['String'];
};

export type UserLoginInput = {
  password: Scalars['String'];
  username: Scalars['String'];
};

export type UserRegisterInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type CreateGroupMutationVariables = Exact<{
  name: Scalars['String'];
  description: Scalars['String'];
}>;


export type CreateGroupMutation = { __typename?: 'Mutation', createGroup: { __typename?: 'GroupResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, group?: { __typename?: 'Group', id: number, name: string, description: string } | null | undefined } };

export type CreatePostMutationVariables = Exact<{
  title: Scalars['String'];
  text: Scalars['String'];
  groupId: Scalars['String'];
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'PostResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, post?: { __typename?: 'Post', id: number, title: string, text: string } | null | undefined } };

export type DeletePostMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeletePostMutation = { __typename?: 'Mutation', deletePost: boolean };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, user?: { __typename?: 'User', id: number, username: string } | null | undefined } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type MemberMutationVariables = Exact<{
  value: Scalars['Int'];
  groupId: Scalars['Int'];
}>;


export type MemberMutation = { __typename?: 'Mutation', member: boolean };

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, user?: { __typename?: 'User', id: number, username: string } | null | undefined } };

export type ResetPasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, user?: { __typename?: 'User', id: number, username: string } | null | undefined } };

export type UpdateGroupMutationVariables = Exact<{
  id: Scalars['Int'];
  name: Scalars['String'];
  description: Scalars['String'];
}>;


export type UpdateGroupMutation = { __typename?: 'Mutation', updateGroup?: { __typename?: 'Group', id: number, name: string, description: string } | null | undefined };

export type UpdatePostMutationVariables = Exact<{
  id: Scalars['Int'];
  title: Scalars['String'];
  text: Scalars['String'];
}>;


export type UpdatePostMutation = { __typename?: 'Mutation', updatePost?: { __typename?: 'Post', id: number, title: string, text: string } | null | undefined };

export type VoteMutationVariables = Exact<{
  value: Scalars['Int'];
  postId: Scalars['Int'];
}>;


export type VoteMutation = { __typename?: 'Mutation', vote: boolean };

export type GroupQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GroupQuery = { __typename?: 'Query', group?: { __typename?: 'Group', id: number, createdAt: string, updatedAt: string, name: string, description: string, membersnumber: number, creatorId: number, posts: Array<{ __typename?: 'Post', id: number, title: string, text: string }>, members: Array<{ __typename?: 'Member', userId: number }> } | null | undefined };

export type GroupsQueryVariables = Exact<{ [key: string]: never; }>;


export type GroupsQuery = { __typename?: 'Query', groups?: Array<{ __typename?: 'Group', id: number, name: string, description: string, membersnumber: number, creatorId: number, posts: Array<{ __typename?: 'Post', id: number, title: string, text: string }>, members: Array<{ __typename?: 'Member', userId: number }> }> | null | undefined };

export type PostQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type PostQuery = { __typename?: 'Query', post?: { __typename?: 'Post', id: number, createdAt: string, updatedAt: string, title: string, points: number, text: string, voteStatus?: number | null | undefined, creator: { __typename?: 'User', id: number, username: string }, group: { __typename?: 'Group', id: number, name: string, description: string } } | null | undefined };

export type PostsQueryVariables = Exact<{ [key: string]: never; }>;


export type PostsQuery = { __typename?: 'Query', posts: Array<{ __typename?: 'Post', id: number, createdAt: string, updatedAt: string, title: string, points: number, voteStatus?: number | null | undefined, creator: { __typename?: 'User', id: number, username: string }, group: { __typename?: 'Group', id: number, name: string, description: string } }> };

export type UserLoggedInQueryVariables = Exact<{ [key: string]: never; }>;


export type UserLoggedInQuery = { __typename?: 'Query', userLoggedIn?: { __typename?: 'User', id: number, username: string } | null | undefined };


export const CreateGroupDocument = gql`
    mutation CreateGroup($name: String!, $description: String!) {
  createGroup(options: {name: $name, description: $description}) {
    errors {
      field
      message
    }
    group {
      id
      name
      description
    }
  }
}
    `;

export function useCreateGroupMutation() {
  return Urql.useMutation<CreateGroupMutation, CreateGroupMutationVariables>(CreateGroupDocument);
};
export const CreatePostDocument = gql`
    mutation CreatePost($title: String!, $text: String!, $groupId: String!) {
  createPost(options: {title: $title, text: $text, groupId: $groupId}) {
    errors {
      field
      message
    }
    post {
      id
      title
      text
    }
  }
}
    `;

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument);
};
export const DeletePostDocument = gql`
    mutation DeletePost($id: Int!) {
  deletePost(id: $id)
}
    `;

export function useDeletePostMutation() {
  return Urql.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!) {
  login(options: {username: $username, password: $password}) {
    errors {
      field
      message
    }
    user {
      id
      username
    }
  }
}
    `;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const MemberDocument = gql`
    mutation Member($value: Int!, $groupId: Int!) {
  member(value: $value, groupId: $groupId)
}
    `;

export function useMemberMutation() {
  return Urql.useMutation<MemberMutation, MemberMutationVariables>(MemberDocument);
};
export const RegisterDocument = gql`
    mutation Register($username: String!, $email: String!, $password: String!) {
  register(options: {username: $username, email: $email, password: $password}) {
    errors {
      field
      message
    }
    user {
      id
      username
    }
  }
}
    `;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const ResetPasswordDocument = gql`
    mutation ResetPassword($token: String!, $newPassword: String!) {
  resetPassword(token: $token, newPassword: $newPassword) {
    errors {
      field
      message
    }
    user {
      id
      username
    }
  }
}
    `;

export function useResetPasswordMutation() {
  return Urql.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument);
};
export const UpdateGroupDocument = gql`
    mutation UpdateGroup($id: Int!, $name: String!, $description: String!) {
  updateGroup(id: $id, name: $name, description: $description) {
    id
    name
    description
  }
}
    `;

export function useUpdateGroupMutation() {
  return Urql.useMutation<UpdateGroupMutation, UpdateGroupMutationVariables>(UpdateGroupDocument);
};
export const UpdatePostDocument = gql`
    mutation UpdatePost($id: Int!, $title: String!, $text: String!) {
  updatePost(id: $id, title: $title, text: $text) {
    id
    title
    text
  }
}
    `;

export function useUpdatePostMutation() {
  return Urql.useMutation<UpdatePostMutation, UpdatePostMutationVariables>(UpdatePostDocument);
};
export const VoteDocument = gql`
    mutation Vote($value: Int!, $postId: Int!) {
  vote(value: $value, postId: $postId)
}
    `;

export function useVoteMutation() {
  return Urql.useMutation<VoteMutation, VoteMutationVariables>(VoteDocument);
};
export const GroupDocument = gql`
    query Group($id: Int!) {
  group(id: $id) {
    id
    createdAt
    updatedAt
    name
    description
    membersnumber
    creatorId
    posts {
      id
      title
      text
    }
    members {
      userId
    }
  }
}
    `;

export function useGroupQuery(options: Omit<Urql.UseQueryArgs<GroupQueryVariables>, 'query'>) {
  return Urql.useQuery<GroupQuery>({ query: GroupDocument, ...options });
};
export const GroupsDocument = gql`
    query Groups {
  groups {
    id
    name
    description
    membersnumber
    creatorId
    posts {
      id
      title
      text
    }
    members {
      userId
    }
  }
}
    `;

export function useGroupsQuery(options?: Omit<Urql.UseQueryArgs<GroupsQueryVariables>, 'query'>) {
  return Urql.useQuery<GroupsQuery>({ query: GroupsDocument, ...options });
};
export const PostDocument = gql`
    query Post($id: Int!) {
  post(id: $id) {
    id
    createdAt
    updatedAt
    title
    points
    text
    voteStatus
    creator {
      id
      username
    }
    group {
      id
      name
      description
    }
  }
}
    `;

export function usePostQuery(options: Omit<Urql.UseQueryArgs<PostQueryVariables>, 'query'>) {
  return Urql.useQuery<PostQuery>({ query: PostDocument, ...options });
};
export const PostsDocument = gql`
    query Posts {
  posts {
    id
    createdAt
    updatedAt
    title
    points
    voteStatus
    creator {
      id
      username
    }
    group {
      id
      name
      description
    }
  }
}
    `;

export function usePostsQuery(options?: Omit<Urql.UseQueryArgs<PostsQueryVariables>, 'query'>) {
  return Urql.useQuery<PostsQuery>({ query: PostsDocument, ...options });
};
export const UserLoggedInDocument = gql`
    query UserLoggedIn {
  userLoggedIn {
    id
    username
  }
}
    `;

export function useUserLoggedInQuery(options?: Omit<Urql.UseQueryArgs<UserLoggedInQueryVariables>, 'query'>) {
  return Urql.useQuery<UserLoggedInQuery>({ query: UserLoggedInDocument, ...options });
};