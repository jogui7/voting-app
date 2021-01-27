import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateOptions1611761554273 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'options',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        generationStrategy: 'increment',
                        isGenerated: true,
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        isNullable: false
                    },
                    {
                        name: 'votes',
                        type: 'int',
                        isNullable: false,
                        default: 0,
                    },
                    {
                        name: 'pollId',
                        type: 'varchar',
                        isNullable: false,
                    }
                ]
            })
        )

        await queryRunner.createForeignKey('options', new TableForeignKey({
            name: 'OptionOwner',
            columnNames: ['pollId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'polls',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('options', 'OptionOwner');

        await queryRunner.dropTable('options');
    }

}
