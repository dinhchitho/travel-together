export class Notification {
  id: string;
  createUser: string;
  createdDate: string;
  lastModifiedUser: string;
  updateDttm: string;
  content: string;
  thumbnail: string;
  permalink: string;
  read: boolean;
  constructor(
    id: string,
    createUser: string,
    createdDate: string,
    lastModifiedUser: string,
    updateDttm: string,
    content: string,
    thumbnail: string,
    permalink: string,
    read: boolean
  ) {
    this.id = id;
    this.createUser = createUser;
    this.createdDate = createdDate;
    this.lastModifiedUser = lastModifiedUser;
    this.updateDttm = updateDttm;
    this.content = content;
    this.thumbnail = thumbnail;
    this.permalink = permalink;
    this.read = read;
  }
}
