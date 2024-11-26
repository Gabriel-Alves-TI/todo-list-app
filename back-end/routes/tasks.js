const express = require('express');
const router = express.Router()
const Task = require('../model/tasks');
const { Sequelize } = require('sequelize');

router.get('/', async (req, res, next) => {
    const {search} = req.query;
    
    try {
        let tasks;

        if (search) {
            tasks = await Task.findAll({
                where: {
                    description: {
                        [Sequelize.Op.like]: `%${search}%`,
                    },
                },
            });
        } else {
            tasks = await Task.findAll();
        }

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).send({ error: 'Erro ao buscar as tarefas'})
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { description, done} = req.body;
        const tarefa = await Task.create({
            description,
            done
        });
        res.status(201).json({
            id: tarefa.id,
            description: tarefa.description,
            done: tarefa.done
        });
    } catch {
        res.status(500).json({ error: 'Erro ao criar tarefa'})
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        console.log(`ID recebido na rota PUT: ${req.params.id}`)
        const {description, done} = req.body;

        const tarefa = await Task.update(
            {description: description, done: done},
            {where: { id: req.params.id}}
        );

        if (tarefa[0] === 0){
            return res.status(404).send({ message: 'Tarefa não encontrada'});
        }

        res.status(200).json({
            mensagem: 'Tarefa alterada com sucesso'
        });
    } catch (error) {
        console.error('Erro ao atualizar tarefa:', error); // Exibe o erro real no console
        res.status(500).send({ error: 'Erro ao atualizar tarefa' });
    }
});


router.delete('/:id', async (req, res, next) => {
    try {
        console.log(`ID recebido na rota DELETE: ${req.params.id}`)

        const tarefa = await Task.destroy({
            where: { id: req.params.id}
        });
        if (tarefa === 0) {
            return res.status(404).send({ mensagem: 'Tarefa não encontrada'});
        }
        res.status(200).json({
            mensagem: 'Tarefa deletada com sucesso'
        });
    } catch (error) {
        res.status(500).send({ error: 'Erro ao deletar a tarefa'});
    }
});

module.exports = router;