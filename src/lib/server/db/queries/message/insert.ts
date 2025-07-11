import { db, message, user } from '$lib/server/db';
import { sql, eq } from 'drizzle-orm';
import { first } from '$lib/server/db/queries/common';

const insertMessageQuery = () => {
	const insertedMessage = db()
		.$with('inserted_message')
		.as(
			db()
				.insert(message)
				.values({
					senderId: sql.placeholder('senderId'),
					roomId: sql.placeholder('roomId'),
					text: sql.placeholder('text')
				})
				.returning({
					id: message.id,
					roomId: message.roomId,
					senderId: message.senderId,
					text: message.text,
					createdAt: message.createdAt
				})
		);
	return db()
		.with(insertedMessage)
		.select({
			id: insertedMessage.id,
			roomId: insertedMessage.roomId,
			sender: {
				id: user.id,
				firstname: user.firstname,
				lastname: user.lastname
			},
			text: insertedMessage.text,
			createdAt: insertedMessage.createdAt
		})
		.from(insertedMessage)
		.innerJoin(user, eq(insertedMessage.senderId, user.id));
};

export const insertMessage = (value: {
	senderId: number;
	roomId: number;
	text: string;
}) => first(insertMessageQuery().execute(value));
