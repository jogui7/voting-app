import {MigrationInterface, QueryRunner, TableForeignKey, Table} from "typeorm";

export class AddUserIDFk1611684851818 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createForeignKey('polls', new TableForeignKey({
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('polls') as Table;
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('userId') !== -1) as TableForeignKey;
        await queryRunner.dropForeignKey('userId', foreignKey);
    }

}
