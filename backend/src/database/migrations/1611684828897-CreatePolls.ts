import { MigrationInterface, QueryRunner, Table } from "typeorm";
import shortid from 'shortid';

export default class CreatePolls1611684828897 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'polls',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: `'${shortid.generate()}'`,
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'isOpen',
                        type: 'boolean',
                        isNullable: false,
                    },
                    {
                        name: 'durationTime',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'startTime',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'endTime',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'userId',
                        type: 'varchar',
                        isNullable: false,
                    },
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('polls');
    }

}
