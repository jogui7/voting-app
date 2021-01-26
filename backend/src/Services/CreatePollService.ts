import { getCustomRepository } from 'typeorm';

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