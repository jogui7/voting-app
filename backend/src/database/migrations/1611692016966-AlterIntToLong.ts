import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AlterIntToLong1611692016966 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn('polls', 'startTime',
            new TableColumn({
                name: 'startTime',
                type: 'bigint',
                isNullable: false
            }) 
        )

        await queryRunner.changeColumn('polls', 'endTime',
            new TableColumn({
                name: 'endTime',
                type: 'bigint',
                isNullable: false
            }) 
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn('polls', 'endTime',
            new TableColumn({
                name: 'endTime',
                type: 'int',
                isNullable: false
            }) 
        )

        await queryRunner.changeColumn('polls', 'startTime',
            new TableColumn({
                name: 'startTime',
                type: 'int',
                isNullable: false
            }) 
        )
    }

}
