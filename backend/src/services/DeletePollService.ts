import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import PollsRepository from '../repositories/PollsRepository';

interface Request {
    id: string;
    userId: string;
}

class DeletePollService {
    public async execute({ 
        id,
        userId
    }: Request): Promise<void> {
        const pollsRepository = getCustomRepository(PollsRepository);

        const poll = await pollsRepository.findOne(id);

        if(!poll) {
            throw new AppError('Poll does not exist!');
        }

        if(userId != poll.userId) {
            throw new AppError('Polls can only be closed by its owner!', 401);
        }

        await pollsRepository.delete(id);
    }

}

export default DeletePollService;