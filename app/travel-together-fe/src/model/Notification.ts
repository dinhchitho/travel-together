export class Notification {
    id: string;
    content: string;
    thumbnail: string;
    read: boolean;
    constructor(id: string, content: string, thumbnail: string, read: boolean) {
        this.id = id;
        this.content = content;
        this.thumbnail = thumbnail;
        this.read = read
    }
}