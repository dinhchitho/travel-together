import { Comment } from "./Comment";
import { Rating } from "./Rating";
import { User } from "./User";

export class Blog {
  id: string;
  fullName: string;
  content: string;
  images: string[];
  videos: string[];
  lat: number;
  lng: number;
  location: string;
  comments: Comment[];
  likedUsers: User[];
  userIdCreated: string;
  ratings?: Rating[];
  avatar: string | undefined;
  dateCreate: string | undefined;
  type?: string;
  isLocalGuide?: boolean;
  constructor(
    id: string,
    fullName: string,
    content: string,
    images: string[],
    videos: string[],
    lat: number,
    lng: number,
    location: string,
    comments: Comment[],
    likedUsers: User[],
    userIdCreated: string,
    avatar: string,
    ratings: Rating[]
  ) {
    this.id = id;
    this.fullName = fullName;
    this.content = content;
    this.images = images;
    this.videos = videos;
    this.lat = lat;
    this.lng = lng;
    this.location = location;
    this.comments = comments;
    this.likedUsers = likedUsers;
    this.userIdCreated = userIdCreated;
    this.avatar = avatar;
    this.ratings = ratings;
  }
}
