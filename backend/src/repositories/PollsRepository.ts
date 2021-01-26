import { EntityRepository, Repository } from 'typeorm';

import Poll from '../models/Poll';

@EntityRepository(Poll)
class PollsRepository extends Repository<Poll>{ 

    public async findById(id: string): Promise<Poll | null> {

        const findPollById = await this.findOne({
            where: { id },
        })
        
        return findPollById || null;
    }

}

export default PollsRepository;