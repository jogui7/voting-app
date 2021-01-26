import shortid from 'shortid';
import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import User from './User';

@Entity('polls')
class Poll {
    @PrimaryColumn('uuid')
    id: string;

    @Column('boolean')
    isOpen: boolean;

    @Column()
    title: string;

    @Column('int')
    durationTime: number;

    @Column('bigint')
    startTime: number; 

    @Column('bigint')
    endTime: number;

    @Column()
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    ownerUser: string;

}

export default Poll;