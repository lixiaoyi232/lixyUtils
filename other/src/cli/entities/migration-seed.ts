import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm'

@Entity()
export class MigrationSeed {

  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    unique: true
  })
  name!: string

  @Column()
  createdTime!: Date

  @BeforeInsert()
  beforeInsert() {
    this.createdTime = new Date()
  }

}
