import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  Uid: number;

  @Column()
  Username: string;

  @Column()
  City: string;

  @Column()
  Friend: number;
}
