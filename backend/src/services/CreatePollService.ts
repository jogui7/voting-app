import { getCustomRepository, getRepository } from 'typeorm';

import User from '../models/User';
import Poll from '../models/Poll';
import PollsRepository from '../repositories/PollsRepository';

interface Request {
    id: string,
    isOpen: boolean,
    title: string,
    durationTime: number ,
    startTime: number,
    endTime: number,
    userId: string
}

class CreatePollService {
    public async execute({ 
        id,
        isOpen,
        title,
        durationTime, 
        startTime, 
        endTime, 
        userId 
    }: Request): Promise<Poll> {
        const pollsRepository = getCustomRepository(PollsRepository);
        const usersRepository = getRepository(User);

        const checkUserExists = await usersRepository.findOne({
            where:{ id: userId },
        })

        if(!checkUserExists) {
            throw new Error('User does not exist!');
        } 

        const poll = pollsRepository.create({
            id,
            isOpen,
            title,
            durationTime, 
            startTime, 
            endTime, 
            userId 
        })

        await pollsRepository.save(poll);

        return poll;
    }

}

export default CreatePollService;