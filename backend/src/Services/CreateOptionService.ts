import { getRepository } from 'typeorm';

import Option from '../models/Option';


interface Request {
    name: string;
    pollId: string;
}

class CreateOptionService {
    public async execute({ 
        name,
        pollId
    }: Request): Promise<Option> {
        const optionsRepository = getRepository(Option);

        const option = optionsRepository.create({
            name,
            pollId,
            votes: 0,
        })

        await optionsRepository.save(option);

        return option;
    }

}

export default CreateOptionService;