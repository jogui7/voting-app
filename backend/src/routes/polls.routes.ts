import { Router } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';

import Poll from '../models/Poll';
import PollsRepository from '../repositories/PollsRepository';
import CreatePollService from '../services/CreatePollService';
import CreateOptionService from '../services/CreateOptionService';
import VoteForOptionService from '../services/VoteForOption';
import shortid from 'shortid';

const pollsRouter = Router(); 

interface optionName {
    name: string;
}

interface OptionData {
    id: number;
    name: string;
    votes: number;
    pollId: string
}

async function closePoll(id: string) {
    const pollsRepository = getRepository(Poll);
    await pollsRepository.update(id, { isOpen: false });
}

pollsRouter.post('/', async (request, response) => {
    try{
        const { title, optionsNames, durationTime, userId} = request.body;

        const createPoll = new CreatePollService();
        const createOption = new CreateOptionService();

        const poll = await createPoll.execute({
            id: shortid.generate(),
            isOpen: true,
            title,
            durationTime,
            startTime: Date.now(), 
            endTime: Date.now() + durationTime * 1000 ,
            userId
        });


        const createOptions = async () => {
            return Promise.all(
                await optionsNames.map( async( { name }: optionName) => {
                    const option = await createOption.execute({ 
                        name, 
                        pollId: poll.id 
                    })
                return {...option};
            }))
        }
        

        const options = await createOptions();
        
        const res = {poll, options}
        setTimeout(closePoll, durationTime*100, poll.id);

        return response.json(res);
    } catch(err) {
        return response.status(400).json({error: err.message})
    }
});

pollsRouter.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        const pollsRepository = getCustomRepository(PollsRepository);
        const poll = await pollsRepository.findById(id);

        if(poll === null){
            throw new Error('This poll does not exist');
        }

        return response.json(poll);
    } catch(err) {
        return response.status(400).json({ error: err.message})
    }
});

pollsRouter.get('/', async (request, response) => {
    try {
        const pollsRepository = getCustomRepository(PollsRepository);
        const polls = await pollsRepository.find();

        if(polls === null){
            throw new Error("There isn't any poll yet!");
        }

        return response.json(polls);
    } catch(err) {
        return response.status(400).json({ error: err.message})
    }
});

pollsRouter.post('/:id/vote/:option', async (request, response) => {
    try{
        const { id, option } = request.params;

        const voteForOption = new VoteForOptionService();

        const votedOption = await voteForOption.execute({
            pollId: id,
            index: Number(option),
        })


        return response.json(votedOption);
    } catch(err){
        return response.status(400).json({error: err.message});
    }
});

// pollsRouter.put('/polls/:id', (request, response) => {
//     const { id } = request.params;
//     const index = polls.findIndex( poll => poll.id === id);

//     if (index < 0){
//         return response.status(400).json({ error: "Poll does not exist!"})
//     }

//     const poll = polls[index];

//     poll.isOpen = false;

//     return response.json(poll);
// });

// pollsRouter.delete('/polls/:id', (request, response) => {
//     const { id } = request.params;
//     const index = polls.findIndex( poll => poll.id === id);

//     if (index < 0){
//         return response.status(400).json({ error: "Poll does not exist!"})
//     }

//     polls.splice(index, 1);

//     return response.status(200).json();
// });

export default pollsRouter;