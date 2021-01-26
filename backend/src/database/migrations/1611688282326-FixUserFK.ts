import {MigrationInterface, QueryRunner, TableForeignKey, Table, TableColumn} from "typeorm";

export class FixUserFK1611688282326 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('polls', 'userId');

        await queryRunner.dropTable('users');

        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()'
                    },
                    {
                        name: 'username',
                        type: 'varchar',
                        isNullable: false,
                        isUnique: true,
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    }
                ]
            })
        );

        

        await queryRunner.addColumn(
            'polls',
            new TableColumn({
                name: 'userId',
                type: 'uuid',
                isNullable: true,
            })
        )

        await queryRunner.createForeignKey('polls', new TableForeignKey({
            name: 'PollOwner',
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('userId', 'PollOwner');

        await queryRunner.dropColumn('polls', 'userId');

        await queryRunner.dropTable('users');

        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()'
                    },
                    {
                        name: 'username',
                        type: 'varchar',
                        isNullable: false,
                        isUnique: true,
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    }
                ]
            })
        );

        await queryRunner.addColumn(
            'polls',
            new TableColumn({
                name: 'userId',
                type: 'varchar',
                isNullable: false,
            })
        );
    }

}
