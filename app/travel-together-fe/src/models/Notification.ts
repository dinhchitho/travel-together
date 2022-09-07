export class Notification {
  content: string;
  thumbnail: string;
  isRead: boolean;
  permalink: string;

  constructor(
    content: string,
    thumbnail: string,
    isRead: boolean,
    permalink: string
  ) {
    this.content = content;
    this.thumbnail = thumbnail;
    this.isRead = isRead;
    this.permalink = permalink;
  }
}
