import { Router, response } from 'express';
import shortid from 'shortid';

const routes = Router(); 

interface option {
    name: string,
    votes: number
};

interface poll {
    id: string,
    isOpen: boolean,
    title: string,
    options: Array<option>,
    durationTime: number ,
    startTime: number,
    endTime: number
}

const polls: Array<poll> = [];

function closePoll(id: string) {
    const index = polls.findIndex( poll => poll.id === id);
    polls[index].isOpen = false;
}

routes.post('/polls', (request, response) => {
    const { title, optionsNames, durationTime} = request.body;
    
    const options: Array<option> = [];
    
    optionsNames.map((optionName: string) => {
        options.push({name: optionName, votes: 0});
    }); 

    const poll = {
        id: shortid.generate(),
        isOpen: true,
        title,
        options,
        durationTime,
        startTime: Date.now(), 
        endTime: Date.now() + durationTime * 1000 
    }

    polls.push(poll);

    setTimeout(closePoll, durationTime*1000, poll.id);

	return response.json(poll);
});

routes.get('/polls/:id', (request, response) => {
    const { id } = request.params;

    const index = polls.findIndex( poll => poll.id === id);
    
    if (index < 0){
        return response.status(400).json({ error: "Poll does not exist!"})
    }

    return response.json(polls[index]);
});

routes.post('/polls/:id/:option', (request, response) => {
    const { id, option } = request.params;
    const index = polls.findIndex( poll => poll.id === id);

    if (index < 0){
        return response.status(400).json({ error: "Poll does not exist!"})
    }

    const poll = polls[index];

    if (!poll.isOpen) {
        return response.status(400).json({ error: "Poll is already closed!" })
    }

    poll.options[Number(option)].votes += 1;

    return response.json(poll.options[Number(option)]);
});

routes.put('/polls/:id', (request, response) => {
    const { id } = request.params;
    const index = polls.findIndex( poll => poll.id === id);

    if (index < 0){
        return response.status(400).json({ error: "Poll does not exist!"})
    }

    const poll = polls[index];

    poll.isOpen = false;

    return response.json(poll);
});

routes.delete('/polls/:id', (request, response) => {
    const { id } = request.params;
    const index = polls.findIndex( poll => poll.id === id);

    if (index < 0){
        return response.status(400).json({ error: "Poll does not exist!"})
    }

    polls.splice(index, 1);

    return response.status(200).json();
});

export default routes;