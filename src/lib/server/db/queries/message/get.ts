import { db, message, user } from '$lib/server/db';
import { sql, eq } from 'drizzle-orm';

const getMessagesQuery = () =>
	db()
		.select({
			id: message.id,
			createdAt: message.createdAt,
			roomId: message.roomId,
			senderId: message.senderId,
			senderFirstname: user.firstname,
			senderLastname: user.lastname,
			text: message.text
		})
		.from(message)
		.innerJoin(user, eq(message.senderId, user.id))
		.where(eq(message.roomId, sql.placeholder('roomId')))
		.orderBy(message.createdAt);

export type ReceivedMessage = {
	id: number;
	roomId: number;
	sender: {
		id: number;
		firstname: string;
		lastname: string;
	};
	text: string;
	createdAt: Date;
};

export const getMessages = async (roomId: number) => {
	const messages = await getMessagesQuery().execute({ roomId });
	return messages.map(
		({
			id,
			createdAt,
			roomId,
			senderId,
			senderFirstname,
			senderLastname,
			text
		}) => ({
			id,
			roomId,
			sender: {
				id: senderId,
				firstname: senderFirstname,
				lastname: senderLastname
			},
			text,
			createdAt
		})
	);
};
