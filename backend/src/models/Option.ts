import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import Poll from './Poll';

@Entity('options')
class Option {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @Column('int')
    votes: number;

    @Column()
    pollId: string;

    @ManyToOne(() => Poll)
    @JoinColumn({ name: 'pollId' })
    ownerPoll: Poll
    

}

export default Option;
