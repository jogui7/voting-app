import { EntityRepository, Repository } from 'typeorm';

import Option from '../models/Option';

@EntityRepository(Option)
class OptionsRepository extends Repository<Option>{ 

    public async findByIndex(pollId: string, option: number): Promise<Option | null> {

        const findOptionsByPollId = await this.find({
            where: { pollId } ,
        })

        const findOptionByIndex = findOptionsByPollId[option];
        
        return findOptionByIndex || null;
    }

}

export default OptionsRepository;