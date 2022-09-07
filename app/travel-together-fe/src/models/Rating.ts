export class Rating {
  rating: number;
  userIdRated: string;

  constructor(rating: number, userIdRated: string) {
    this.rating = rating;
    this.userIdRated = userIdRated;
  }
}
