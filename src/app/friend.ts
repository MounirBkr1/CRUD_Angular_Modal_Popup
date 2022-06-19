export class Friend {
  //class correspondante a entities in backend
  constructor(
    //those parametres must be seem at bachend entities
    public id: number,
    public firstName: string,
    public lastName: string,
    public department: string,
    public email: string,
    public country: string
  ) {
  }

}
