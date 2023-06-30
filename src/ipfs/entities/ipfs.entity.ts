import {
  Entity,
  Column,
  AfterInsert,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'ipfs' })
export class Ipfs {
  @PrimaryGeneratedColumn()
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

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  metadata: string;

  @Column({ nullable: true })
  userId: string;

  @CreateDateColumn()
  uploadTime: Date;
}
