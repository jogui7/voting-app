import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Poll from '../models/Poll';
import PollsRepository from '../repositories/PollsRepository';

interface Request {
    id: string;
    userId: string;
}

class ClosePollService {
    public async execute({ 
        id,
        userId
    }: Request): Promise<Poll> {
        const pollsRepository = getCustomRepository(PollsRepository);

        const poll = await pollsRepository.findOne(id);

        if(!poll) {
            throw new AppError('Poll does not exist!');
        }

        if(userId != poll.userId) {
            throw new AppError('Polls can only be deleted by its owner!');
        }

        if(!poll.isOpen) {
            throw new AppError('Poll is already closed!');
        }

        await pollsRepository.update(id, { isOpen: false });


        return poll;
    }

}

export default ClosePollService;