export class Comment {
  content: string;
  userIdComment: string;
  userAvt: string;

  constructor(content: string, userIdComment: string, userAvt: string) {
    this.content = content;
    this.userIdComment = userIdComment;
    this.userAvt = userAvt;
  }
}
