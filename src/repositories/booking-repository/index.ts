import { prisma } from "@/config";

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId
    }
  });
}

async function findManyBooking(roomId: number) {
  return prisma.room.findMany({
    where: {
      id: roomId
    }
  });
}

async function findFirstRoom(roomId: number) {
  return prisma.room.findFirst({
    where: {
      id: roomId
    }
  });
}

async function findUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId
    }
  });
}

async function findUserByBooking(id: number, userId: number) {
  return prisma.booking.findFirst({
    where: {
      id,
      userId
    }
  });
}

async function updateRoom(id: number, roomId: number) {
  return prisma.booking.update({
    where: {
      id
    },
    data: {
      roomId
    }
  });
}

const bookingRepository = {
  createBooking,
  findManyBooking,
  findFirstRoom,
  findUserId,
  findUserByBooking,
  updateRoom
};

export default bookingRepository;
