import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs'; 
import AppError from '../errors/AppError';

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
            throw new AppError('Username already in use');
        }

        const hashedPassword = await hash(password, 8);

        const user = usersRepository.create({
            username,
            password: hashedPassword
        })

        await usersRepository.save(user);

        return user;
    }

}

export default CreateUserService;