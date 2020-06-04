import Knex from 'knex';

// CRIAR TABELA
export async function up(knex: Knex) {
    return knex.schema.createTable('points', table => {
        table.increments('id').primary();
        table.string('image').notNullable();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('city').notNullable();
        table.string('uf', 2).notNullable();
        table.string('whatsapp').notNullable();
        table.decimal('lagitude').notNullable();
        table.decimal('longitude').notNullable();
    });
}

// DELETAR TABELA
export async function down(knex: Knex) {
    return knex.schema.dropTable('points');
}