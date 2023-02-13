import { prisma } from "@/config";
import faker from "@faker-js/faker";

export async function createBookingRoomUser(userId: number, roomId: number) {
  return prisma.booking.create({
    data: { userId, roomId },
  });
}

export async function createHotelWithRooms(roomQuantity?: number, roomCapacity?: number) {
  const rooms = [];
  if (roomQuantity === undefined) {
    roomQuantity = faker.datatype.number({ min: 1, max: 5 });
  }

  let i = 0;
  do {
    rooms.push({
      name: faker.lorem.word(),
      capacity: roomCapacity !== undefined ? roomCapacity : faker.datatype.number({ min: 1, max: 4 }),
    });
    i++;
  } while (i < roomQuantity);

  return prisma.hotel.create({
    data: {
      name: faker.lorem.word(),
      image: faker.image.imageUrl(),
      Rooms: {
        create: rooms,
      },
    },
    include: {
      Rooms: true,
    },
  });
}
