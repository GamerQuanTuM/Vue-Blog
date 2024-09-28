interface Comment {
  _id: string;
  name: string;
  email: string;
  comment: string;
  _creationTime?: Date;
  subcomment?: Array<{
    name: string;
    email: string;
    comment: string;
  }>;
  postId: string;
}

