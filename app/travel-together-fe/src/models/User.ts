import { Interests } from "./Interest";
import { Report } from "./Report";
import { TravelRequest } from "./TravelRequest";

export class User {
  id?: string;
  username?: string;
  email?: string;
  password?: string;
  fullName?: string;
  gender?: boolean;
  dob?: Date;
  phone?: string;
  avatar?: string;
  coverPhoto?: string;
  country?: string;
  countryIcon?: string;
  bio?: string;
  blackListedUsers?: User;
  reports?: Report[];
  status?: boolean;
  interests?: Interests[];
  notifications?: Notification[];
  hasSubmitID?: boolean;
  origin_place?: string;
  residence_place?: string;
  issued_date?: Date;
  identify_card_id?: string;
  followingUsers?: User[];
  travelRequest?: TravelRequest;
  followedUsers?: User[];
  localGuide?: boolean;

  constructor(
    id?: string,
    username?: string,
    email?: string,
    password?: string,
    fullName?: string,
    gender?: boolean,
    dob?: Date,
    phone?: string,
    avatar?: string,
    coverPhoto?: string,
    country?: string,
    countryIcon?: string,
    bio?: string,
    blackListedUsers?: User,
    reports?: Report[],
    status?: boolean,
    interests?: Interests[],
    notifications?: Notification[],
    hasSubmitID?: boolean,
    origin_place?: string,
    residence_place?: string,
    issued_date?: Date,
    identify_card_id?: string,
    followingUsers?: User[],
    travelRequest?: TravelRequest,
    followedUsers?: User[],
    localGuide?: boolean
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.fullName = fullName;
    this.gender = gender;
    this.dob = dob;
    this.phone = phone;
    this.avatar = avatar;
    this.coverPhoto = coverPhoto;
    this.country = country;
    this.countryIcon = countryIcon;
    this.bio = bio;
    this.blackListedUsers = blackListedUsers;
    this.reports = reports;
    this.status = status;
    this.interests = interests;
    this.notifications = notifications;
    this.hasSubmitID = hasSubmitID;
    this.origin_place = origin_place;
    this.residence_place = residence_place;
    this.issued_date = issued_date;
    this.identify_card_id = identify_card_id;
    this.followingUsers = followingUsers;
    this.travelRequest = travelRequest;
    this.followedUsers = followedUsers;
    this.localGuide = localGuide;
  }
}
