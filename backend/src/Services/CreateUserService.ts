import { getRepository } from 'typeorm';

import User from '../models/User';

interface Request {
    username: string;
    password: string;
}

class CreateUserService {
    public async execute({
        username, 
        password
    }: Request): Promise<User> {
        const usersRepository = getRepository(User);

        const checkUserExists = await usersRepository.findOne({
            where:{ username },
        })

        if(checkUserExists) {
            throw new Error('Username already in use');
        }

        const user = usersRepository.create({
            username,
            password
        })

        await usersRepository.save(user);

        return user;
    }

}

export default CreateUserService;