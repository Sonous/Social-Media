import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hashtags } from 'src/entities/hashtags.entity';
import { Repository } from 'typeorm';
import { Hashtag } from './hashtag.interface';

@Injectable()
export class HashtagsService {
    constructor(@InjectRepository(Hashtags) private hashtagsRepository: Repository<Hashtags>) {}

    async findHashtagByName(name: string) {
        const hashtags = await this.hashtagsRepository
            .createQueryBuilder('hashtag')
            .where('hashtag.name like :hashtag', { hashtag: `${name}%` })
            .getMany();

        return hashtags;
    }

    async addHashtag(hashtag: Hashtag) {
        const newHashtag = this.hashtagsRepository.create(hashtag);
        return this.hashtagsRepository.save(newHashtag);
    }
}
