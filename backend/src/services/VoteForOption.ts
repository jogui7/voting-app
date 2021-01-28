import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import PollsRepository from '../repositories/PollsRepository';
import OptionsRepository from '../repositories/OptionsRepository';

import Option from '../models/Option'

interface Request {
    pollId: string;
    index: number;
}

class VoteForOptionService {
    public async execute({
        pollId, 
        index
    }: Request): Promise<Option> {
        const pollsRepository = getCustomRepository(PollsRepository);
        const optionsRepository = getCustomRepository(OptionsRepository)

        const poll = await pollsRepository.findOne({
            where:{ id: pollId },
        })

        const option = await optionsRepository.findByIndex(pollId, index);

        if(!poll) {
            throw new AppError('Poll does not exist!');
        }

        if(!option) {
            throw new AppError('Option does not exist!');
        } 

        if(!poll.isOpen) {
            throw new AppError('Poll is already closed!');
        }
        
        await optionsRepository.increment(option, 'votes', 1);

        return option;
    }

}

export default VoteForOptionService;