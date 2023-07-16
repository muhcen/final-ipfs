import {
  Entity,
  Column,
  AfterInsert,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ObjectIdColumn,
} from 'typeorm';

@Entity()
export class Ipfs {
  @ObjectIdColumn()
  id: number;

  @Column()
  cid: string;

  @Column()
  originalname: string;

  @Column()
  encoding: string;

  @Column()
  mimetype: string;

  @Column()
  size: string;

  @Column()
  description: string;

  @Column()
  metadata: string;

  @Column()
  userId: string;

  @CreateDateColumn()
  uploadTime: Date;
}
