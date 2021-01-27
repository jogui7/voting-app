import { Router } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import shortid from 'shortid';

import Poll from '../models/Poll';
import PollsRepository from '../repositories/PollsRepository';
import CreatePollService from '../services/CreatePollService';
import CreateOptionService from '../services/CreateOptionService';
import VoteForOptionService from '../services/VoteForOption';
import ClosePollService from '../services/ClosePollService';
import DeletePollService from '../services/DeletePollService';
import OptionsRepository from '../repositories/OptionsRepository';


const pollsRouter = Router(); 

interface optionName {
    name: string;
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
        
        const res = {...poll, options}
        setTimeout(closePoll, durationTime*1000, poll.id);

        return response.json(res);
    } catch(err) {
        return response.status(400).json({error: err.message})
    }
});

pollsRouter.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        const pollsRepository = getCustomRepository(PollsRepository);
        const optionsRepository = getCustomRepository(OptionsRepository);

        const poll = await pollsRepository.findById(id);
        const options = await optionsRepository.find({ where: { pollId: id } })

        if(poll === null){
            throw new Error('This poll does not exist');
        }

        const res = {...poll, options};

        return response.json(res);
    } catch(err) {
        return response.status(400).json({ error: err.message})
    }
});

pollsRouter.get('/', async (request, response) => {

    const date = new Date(1611780508405);
    console.log(date.toString());

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

pollsRouter.put('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const closePoll = new ClosePollService();

        const closedPoll = await closePoll.execute({ id });

        return response.json(closedPoll);
    } catch(err) {
        return response.status(400).json({ error: err.message });
    }
});

pollsRouter.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const DeletePoll = new DeletePollService();

        await DeletePoll.execute({ id })

        return response.status(200).json();
    } catch(err) {
        return response.status(400).json({ error: err.message });
    }
});

export default pollsRouter;