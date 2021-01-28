import { getCustomRepository } from 'typeorm';

import PollsRepository from '../repositories/PollsRepository';

interface Request {
    id: string;
}

class DeletePollService {
    public async execute({ 
        id,
    }: Request): Promise<void> {
        const pollsRepository = getCustomRepository(PollsRepository);

        const poll = await pollsRepository.findOne(id);

        if(!poll) {
            throw new Error('Poll does not exist!');
        }

        await pollsRepository.delete(id);
    }

}

export default DeletePollService;