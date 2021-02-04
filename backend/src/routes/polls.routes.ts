import { Router } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import shortid from 'shortid';

import AppError from '../errors/AppError';

import Poll from '../models/Poll';
import PollsRepository from '../repositories/PollsRepository';
import CreatePollService from '../services/CreatePollService';
import CreateOptionService from '../services/CreateOptionService';
import VoteForOptionService from '../services/VoteForOption';
import ClosePollService from '../services/ClosePollService';
import DeletePollService from '../services/DeletePollService';
import OptionsRepository from '../repositories/OptionsRepository';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const pollsRouter = Router(); 

interface optionName {
    name: string;
}

async function closePoll(id: string) {
    const pollsRepository = getRepository(Poll);
    await pollsRepository.update(id, { isOpen: false });
}

pollsRouter.post('/', ensureAuthenticated, async (request, response) => {
    const { title, optionsNames, durationTime } = request.body;
    const { id: userId } = request.user;

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
    
    const pollRes = {...poll, options}
    setTimeout(closePoll, durationTime*1000, poll.id);

    return response.json(pollRes);
});

pollsRouter.get('/:id', async (request, response) => {
    const { id } = request.params;

    const pollsRepository = getCustomRepository(PollsRepository);
    const optionsRepository = getCustomRepository(OptionsRepository);

    const poll = await pollsRepository.findById(id);
    const options = await optionsRepository.find({ where: { pollId: id } })

    if(poll === null){
        throw new AppError('This poll does not exist');
    }

    const pollRes = {...poll, options};

    return response.json(pollRes);
});

pollsRouter.get('/', async (request, response) => {
    const pollsRepository = getCustomRepository(PollsRepository);
    const polls = await pollsRepository.find();

    if(polls === null){
        throw new AppError("There isn't any poll yet!");
    }

    return response.json(polls);
});

pollsRouter.post('/:id/vote/:option', async (request, response) => {
    const { id, option } = request.params;

    const voteForOption = new VoteForOptionService();

    const votedOption = await voteForOption.execute({
        pollId: id,
        index: Number(option),
    })


    return response.json(votedOption);
});

pollsRouter.put('/:id', ensureAuthenticated, async (request, response) => {
    const { id } = request.params;
    const { id: userId } = request.user;

    const closePoll = new ClosePollService();

    const closedPoll = await closePoll.execute({ id, userId });

    return response.json(closedPoll);
});

pollsRouter.delete('/:id', ensureAuthenticated, async (request, response) => {
    const { id } = request.params;
    const { id: userId } = request.user;

    const DeletePoll = new DeletePollService();

    await DeletePoll.execute({ id, userId })

    return response.status(200).json();
});

export default pollsRouter;