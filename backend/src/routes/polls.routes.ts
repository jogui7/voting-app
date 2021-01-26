import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import PollsRepository from '../repositories/PollsRepository';
import CreatePollService from '../Services/CreatePollService';
import shortid from 'shortid';

const pollsRouter = Router(); 

// function closePoll(id: string) {
//     const index = polls.findIndex( poll => poll.id === id);
//     polls[index].isOpen = false;
// }

pollsRouter.post('/', async (request, response) => {
    try{
        const { title, optionsNames, durationTime, userId} = request.body;

        // const options: Array<option> = [];
        
        // optionsNames.map((optionName: string) => {
        //     options.push({name: optionName, votes: 0});
        // });
        const createPoll = new CreatePollService();

        const poll = await createPoll.execute({
            id: shortid.generate(),
            isOpen: true,
            title,
            durationTime,
            startTime: Date.now(), 
            endTime: Date.now() + durationTime * 1000 ,
            userId
        });

        //setTimeout(closePoll, durationTime*1000, poll.id);

        return response.json(poll);
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
        const poll = await pollsRepository.find();

        return response.json(poll);
    } catch(err) {
        return response.status(400).json({ error: "There isn't any poll yet!"})
    }
});

// pollRouter.post('/polls/:id/:option', (request, response) => {
//     const { id, option } = request.params;
//     const index = polls.findIndex( poll => poll.id === id);

//     if (index < 0){
//         return response.status(400).json({ error: "Poll does not exist!"})
//     }

//     const poll = polls[index];

//     if (!poll.isOpen) {
//         return response.status(400).json({ error: "Poll is already closed!" })
//     }

//     poll.options[Number(option)].votes += 1;

//     return response.json(poll.options[Number(option)]);
// });

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