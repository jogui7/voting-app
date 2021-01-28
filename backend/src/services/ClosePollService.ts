import { getCustomRepository } from 'typeorm';

import Poll from '../models/Poll';
import PollsRepository from '../repositories/PollsRepository';

interface Request {
    id: string;
}

class ClosePollService {
    public async execute({ 
        id,
    }: Request): Promise<Poll> {
        const pollsRepository = getCustomRepository(PollsRepository);

        const poll = await pollsRepository.findOne(id);

        if(!poll) {
            throw new Error('Poll does not exist!');
        }

        if(!poll.isOpen) {
            throw new Error('Poll is already closed!');
        }

        await pollsRepository.update(id, { isOpen: false });


        return poll;
    }

}

export default ClosePollService;