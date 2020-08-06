import express from 'express';
import connection from './database/connection';
import convertHourToMinutes from './utils/convetHourToMinutes';

const routes = express.Router();

interface ScheduleItem {
    week_day: number;
    from: string;
    to: string;
}

routes.post('/classes', async (request, response) => {
    const {
        name,
        avatar,
        whatsapp,
        bio,
        subject,
        cost,
        schedule
    } = request.body;

    const trx = await connection.transaction();

    try {
        const insertedUsersId = await trx('users').insert({
            name,
            avatar,
            whatsapp,
            bio
        });
    
        const user_id = insertedUsersId[0];
    
        const insertedClassesIds = await trx('classes').insert({
            subject,
            cost,
            user_id
        });
    
        const class_id = insertedClassesIds[0];
    
        const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
            return {
                week_day: scheduleItem.week_day,
                from: convertHourToMinutes(scheduleItem.from),
                to: convertHourToMinutes(scheduleItem.to),
                class_id
            };
        });
    
        await trx('class_schedule').insert(classSchedule);
    
        await trx.commit();
    
        return response.status(201).send();
    } catch (err) {
        await trx.rollback();

        return response.status(400).json({
            error: 'Unexpected error while creating new class'
        })
    }
});

export default routes;